from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Union
from datetime import datetime
import logging
import json
import numpy as np
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from config import DATABASE_URL, HOST, PORT

import os
import warnings
from sklearn.exceptions import DataConversionWarning

# Tắt log từ TensorFlow
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

# Tắt warning từ sklearn
warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")


# Import AI models and utilities
from chatbot.chatbot_utils import chatbot_response
from recommended_system.enhanced_recommendation import EnhancedRecommendationSystem
from recommended_system.training_pipeline import TrainingPipeline

# Initialize FastAPI app
app = FastAPI(
    title="EnglishForce AI Server",
    description="Combined server for Chatbot and Course Recommendation",
    version="1.0.0"
)

# Initialize recommendation system
recommendation_system = EnhancedRecommendationSystem(DATABASE_URL)

# Initialize training pipeline
training_pipeline = TrainingPipeline(DATABASE_URL)

# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "EnglishForce AI Server",
        "version": "1.0.0",
        "endpoints": {
            "/chat": "Chat with AI assistant",
            "/recommendations": "Get course recommendations for a user",
            "/reload-model": "Train and reload the recommendation model"
        }
    }

class Message(BaseModel):
    msg: str
    userId: Union[str, int]  

class RecommendationRequest(BaseModel):
    user_id: int
    n_recommendations: Optional[int] = 5

# Chatbot endpoint
@app.post("/chat")
def chat(message: Message):
    """Chat with the AI assistant"""
    try:
        response = chatbot_response(message.msg, message.userId)
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
    """Train and reload the recommendation model using existing scripts"""
    try:
        # Step 1: Run complete training pipeline using existing scripts
        logging.info("Starting model training using existing scripts...")
        training_result = training_pipeline.train_and_save_model()
        
        if not training_result["success"]:
            raise HTTPException(status_code=500, detail=training_result["message"])
        
        # Step 2: Force reload the newly trained model
        logging.info("Reloading the newly trained model...")
        reload_result = recommendation_system.model_manager.force_reload_model()
        
        if not reload_result["success"]:
            raise HTTPException(status_code=500, detail=reload_result["message"])
        
        # Step 3: Return combined results
        return {
            "success": True,
            "message": "Model trained and reloaded successfully using existing scripts",
            "training_info": training_result,
            "reload_info": reload_result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Model training and reload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error training and reloading model: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT) 