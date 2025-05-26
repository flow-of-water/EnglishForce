import numpy as np
import pandas as pd
from sqlalchemy import create_engine, text
from typing import List, Dict, Any
from .model_manager import ModelManager
from .recommendation_utils import RecommendationSystem
import os

def clean_nan_values(obj):
    """Clean NaN values from dictionary for JSON compatibility"""
    if isinstance(obj, dict):
        return {k: clean_nan_values(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_nan_values(item) for item in obj]
    elif isinstance(obj, float) and (np.isnan(obj) or np.isinf(obj)):
        return None
    elif isinstance(obj, (np.float32, np.float64)):
        return float(obj)
    elif isinstance(obj, (np.int32, np.int64)):
        return int(obj)
    return obj

class EnhancedRecommendationSystem:
    def __init__(self, database_url: str):
        self.database_url = database_url
        self.model_manager = ModelManager()
        self.engine = create_engine(database_url)
        self.base_recommender = RecommendationSystem()
        # Update model check interval to 72 hours (72 * 3600 seconds)
        self.model_manager.start_model_watcher(check_interval=259200)

    def get_recent_interactions(self, user_id: int, limit: int = 10) -> List[Dict[str, Any]]:
        """Get the most recent course interactions for a user"""
        query = text("""
            SELECT course_id, score
            FROM interactions
            WHERE user_id = :user_id
            ORDER BY created_at DESC
            LIMIT :limit
        """)
        
        with self.engine.connect() as conn:
            result = conn.execute(query, {"user_id": user_id, "limit": limit})
            return [{"course_id": row[0], "score": row[1]} for row in result]

    def get_similar_courses(self, course_ids: List[int], k: int = 5) -> List[Dict[str, Any]]:
        """Get similar courses based on course metadata"""
        # Get all courses from the model's courses_df
        all_courses = pd.read_csv(os.path.join(os.path.dirname(__file__), 'courses.csv'))
        
        # Fill NaN values with appropriate defaults
        all_courses['price'] = all_courses['price'].fillna(0)
        all_courses['average_rating'] = all_courses['average_rating'].fillna(0)
        all_courses['number_of_enrollments'] = all_courses['number_of_enrollments'].fillna(0)
        all_courses['number_of_rating'] = all_courses['number_of_rating'].fillna(0)
        all_courses['description'] = all_courses['description'].fillna('')
        
        # Filter courses that are in the input list
        reference_courses = all_courses[all_courses['course_id'].isin(course_ids)]
        
        if reference_courses.empty:
            return []
            
        # Calculate average features for reference courses
        avg_features = reference_courses[[
            'price', 'average_rating', 'number_of_enrollments', 'number_of_rating'
        ]].mean()
        
        # Calculate similarity scores for all courses
        def calculate_similarity(row):
            features = row[['price', 'average_rating', 'number_of_enrollments', 'number_of_rating']]
            # Simple Euclidean distance-based similarity
            return -np.sqrt(((features - avg_features) ** 2).sum())
            
        all_courses['similarity'] = all_courses.apply(calculate_similarity, axis=1)
        
        # Get top-k similar courses, excluding the input courses
        similar_courses = (
            all_courses[~all_courses['course_id'].isin(course_ids)]
            .nlargest(k, 'similarity')
            [['course_id', 'name', 'description', 'price', 'average_rating']]
            .to_dict('records')
        )
        
        # Clean NaN values for JSON compatibility
        return [clean_nan_values(course) for course in similar_courses]

    def get_model_recommendations(self, user_id: int, k: int = 5) -> List[Dict[str, Any]]:
        """Get recommendations from the current model version"""
        try:
            # Use the base recommender but with the latest model from ModelManager
            model_components = self.model_manager.get_model()
            self.base_recommender.model = model_components['model']
            self.base_recommender.user_encoder = model_components['user_encoder']
            self.base_recommender.course_encoder = model_components['course_encoder']
            self.base_recommender.scaler = model_components['scaler']
            self.base_recommender.tfidf = model_components['tfidf']
            
            # Get recommendations using the base recommender
            recommendations = self.base_recommender.recommend_top_k_courses(user_id, k)
            
            # Clean NaN values for JSON compatibility
            return [clean_nan_values(course) for course in recommendations]

        except Exception as e:
            raise Exception(f"Error in model recommendations: {str(e)}")

    def get_enhanced_recommendations(self, user_id: int, k: int = 5) -> List[Dict[str, Any]]:
        """Get enhanced course recommendations combining recent interactions and model predictions"""
        try:
            # Get recent interactions
            recent_interactions = self.get_recent_interactions(user_id)
            
            recommendations = []
            
            if recent_interactions:
                # Get similar courses based on recent interactions
                interaction_course_ids = [int(interaction['course_id']) for interaction in recent_interactions]
                similar_courses = self.get_similar_courses(interaction_course_ids, k=k)
                
                # Weight recommendations by interaction scores
                for course in similar_courses:
                    course['recommendation_source'] = 'interaction_based'
                recommendations.extend(similar_courses)

            try:
                # Try to get model-based recommendations
                model_recommendations = self.get_model_recommendations(user_id, k=k)
                for course in model_recommendations:
                    course['recommendation_source'] = 'model_based'
                recommendations.extend(model_recommendations)
            except ValueError:
                # User not in model training data, continue with only interaction-based recommendations
                pass

            # Remove duplicates (prefer interaction-based if duplicate)
            seen_courses = set()
            unique_recommendations = []
            for rec in recommendations:
                course_id = rec['course_id']
                if course_id not in seen_courses:
                    seen_courses.add(course_id)
                    unique_recommendations.append(rec)

            # Return top-k recommendations
            return unique_recommendations[:k]

        except Exception as e:
            raise Exception(f"Error in enhanced recommendations: {str(e)}") 