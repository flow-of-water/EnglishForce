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
from config import DATABASE_URL, HOST, PORT

# Import AI models and utilities
from chatbot.chatbot_utils import chatbot_response
from recommended_system.enhanced_recommendation import EnhancedRecommendationSystem

# Initialize FastAPI app
app = FastAPI(
    title="EnglishForce AI Server",
    description="Combined server for Chatbot and Course Recommendation",
    version="1.0.0"
)

# Initialize recommendation system
recommendation_system = EnhancedRecommendationSystem(DATABASE_URL)

# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "EnglishForce AI Server",
        "version": "1.0.0",
        "endpoints": {
            "/chat": "Chat with AI assistant",
            "/recommendations": "Get course recommendations for a user",
            "/reload-model": "Force reload the recommendation model"
        }
    }

class Message(BaseModel):
    msg: str

class RecommendationRequest(BaseModel):
    user_id: int
    n_recommendations: Optional[int] = 5

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

# Course recommendation endpoints
@app.post("/recommendations")
def get_course_recommendations(request: RecommendationRequest):
    """Get course recommendations for a specific user"""
    try:
        recommendations = recommendation_system.get_enhanced_recommendations(
            user_id=request.user_id,
            k=request.n_recommendations
        )
        return {"recommendations": recommendations}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logging.error(f"Recommendation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Error generating recommendations")

@app.post("/reload-model")
def reload_model():
    """Force reload the recommendation model"""
    try:
        result = recommendation_system.model_manager.force_reload_model()
        if result["success"]:
            return result
        else:
            raise HTTPException(status_code=500, detail=result["message"])
    except Exception as e:
        logging.error(f"Model reload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error reloading model: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT) 