from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import logging
import json
import numpy as np
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

# Import AI models and utilities
from recommendation_manager.model_manager import ModelManager
from recommendation_manager.scheduler import ModelUpdateScheduler
from chatbot.chatbot_utils import chatbot_response
from config import DATABASE_URL, HOST, PORT

# Initialize FastAPI app
app = FastAPI(
    title="EnglishForce AI Server",
    description="Combined server for Chatbot and Course Recommendation",
    version="1.0.0"
)

# Initialize ModelManager for recommendation system
model_manager = ModelManager(model_dir='models')

# Initialize scheduler
model_scheduler = ModelUpdateScheduler(model_manager)

# Database connection
engine = create_engine(DATABASE_URL)

# Logging setup
logging.basicConfig(
    filename='logs/server.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Pydantic models
class Message(BaseModel):
    msg: str

class CourseBase(BaseModel):
    course_id: int
    name: str
    description: str
    price: float
    average_rating: float
    number_of_rating: int
    number_of_enrollment: int

class RecommendationRequest(BaseModel):
    user_id: int
    n_recommendations: Optional[int] = 10

class RecommendationResponse(BaseModel):
    user_id: int
    recommendations: List[CourseBase]
    timestamp: datetime

# Database dependency
def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()

# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "EnglishForce AI Server",
        "version": "1.0.0",
        "endpoints": {
            "/chat": "Chat with AI assistant",
            "/recommendations": "Get personalized course recommendations",
            "/health": "Check service health",
            "/scheduler/status": "Get scheduler status and next update time",
            "/scheduler/trigger": "Trigger immediate model update"
        }
    }

# Health check endpoint
@app.get("/health")
def health_check():
    """Check the health status of both AI services"""
    try:
        # Test chatbot
        test_response = chatbot_response("hello")
        
        # Get recommendation model info
        model_info = model_manager.get_model_info()
        
        return {
            "status": "healthy",
            "chatbot_status": "operational" if test_response else "error",
            "recommendation_model": model_info,
            "timestamp": datetime.now()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Course recommendation endpoints
@app.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest, db: Session = Depends(get_db)):
    """Get final course recommendations for a user"""
    try:
        # 1. Get model-based recommendations
        user_query = f"""
        SELECT average_score_in_exams
        FROM users
        WHERE user_id = {request.user_id}
        """
        user_info = pd.read_sql(user_query, db.bind)
        
        if user_info.empty:
            raise HTTPException(status_code=404, detail="User not found")

        # 2. Get recent interactions for collaborative filtering
        recent_interactions = pd.read_sql(
            """
            SELECT user_id, course_id, score
            FROM interactions
            WHERE created_at >= NOW() - INTERVAL '30 days'
            """,
            db.bind
        )

        # 3. Get user's viewed/enrolled courses
        user_courses = pd.read_sql(
            f"""
            SELECT course_id
            FROM enrollments
            WHERE user_id = {request.user_id}
            """,
            db.bind
        )['course_id'].tolist()

        # 4. Get all available courses
        all_courses = pd.read_sql(
            """
            SELECT id as course_id, name, description, price,
                   average_rating, number_of_rating, number_of_enrollments as number_of_enrollment
            FROM courses
            """,
            db.bind
        )

        # 5. Filter out enrolled courses
        available_courses = all_courses[~all_courses['course_id'].isin(user_courses)]

        # 6. Get collaborative filtering recommendations
        similar_courses = []
        if user_courses:
            for course_id in user_courses[-3:]:  # Use last 3 courses
                similar = model_manager.get_similar_courses(
                    course_id,
                    recent_interactions,
                    n=3  # Get top 3 similar courses for each
                )
                similar_courses.extend(similar)

        # 7. Get model predictions for available courses
        model_predictions = []
        for _, course in available_courses.iterrows():
            pred = model_manager.predict(
                user_id=request.user_id,
                course_id=course['course_id'],
                features={
                    'user_score': user_info['average_score_in_exams'].iloc[0]
                }
            )
            if pred is not None:
                model_predictions.append((course['course_id'], pred))

        # 8. Combine and rank recommendations
        final_scores = {}
        
        # Add model predictions (70% weight)
        if model_predictions:
            max_pred = max(p[1] for p in model_predictions)
            for course_id, pred in model_predictions:
                final_scores[course_id] = 0.7 * (pred / max_pred)

        # Add collaborative filtering results (30% weight)
        if similar_courses:
            for i, course_id in enumerate(similar_courses):
                if course_id not in user_courses:  # Don't recommend enrolled courses
                    score = 0.3 * (1 - (i / len(similar_courses)))  # Decay score by position
                    final_scores[course_id] = final_scores.get(course_id, 0) + score

        # Sort by final score and get top N
        top_course_ids = sorted(
            final_scores.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:request.n_recommendations]

        # Get course details for recommendations
        recommended_courses = available_courses[
            available_courses['course_id'].isin([c[0] for c in top_course_ids])
        ]

        # Convert to CourseBase objects
        course_list = [
            CourseBase(
                course_id=row['course_id'],
                name=row['name'],
                description=row['description'],
                price=row['price'],
                average_rating=row['average_rating'],
                number_of_rating=row['number_of_rating'],
                number_of_enrollment=row['number_of_enrollment']
            )
            for _, row in recommended_courses.iterrows()
        ]
        
        return RecommendationResponse(
            user_id=request.user_id,
            recommendations=course_list,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        logging.error(f"Recommendation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    """Check the health status of both AI services"""
    try:
        # Test chatbot
        test_response = chatbot_response("hello")
        
        # Get recommendation model info
        model_info = model_manager.get_model_info()
        
        return {
            "status": "healthy",
            "chatbot_status": "operational" if test_response else "error",
            "recommendation_model": model_info,
            "timestamp": datetime.now()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Chatbot endpoint
@app.post("/chat")
def chat(message: Message):
    """Chat with the AI assistant"""
    try:
        response = chatbot_response(message.msg)
        return {"response": response}
    except Exception as e:
        logging.error(f"Chatbot error: {str(e)}")
        raise HTTPException(status_code=500, detail="Chatbot processing error")

@app.get("/scheduler/status")
def get_scheduler_status():
    """Get scheduler status and next update time"""
    return model_scheduler.get_status()

@app.post("/scheduler/trigger")
async def trigger_update():
    """Trigger immediate model update"""
    model_scheduler.update_model()
    return {"message": "Model update triggered"}

@app.on_event("startup")
async def startup_event():
    """Start scheduler when server starts"""
    model_scheduler.start()

@app.on_event("shutdown")
async def shutdown_event():
    """Stop scheduler when server shuts down"""
    model_scheduler.stop()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT) 