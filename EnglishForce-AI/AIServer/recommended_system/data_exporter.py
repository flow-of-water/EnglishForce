import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os
import logging
from typing import Dict, Any

class DataExporter:
    def __init__(self, database_url: str):
        self.database_url = database_url
        self.current_dir = os.path.dirname(os.path.abspath(__file__))
        self.engine = create_engine(database_url)
        
    def export_users(self) -> Dict[str, Any]:
        """Export users data from database"""
        try:
            query = """
            SELECT 
                u.id AS user_id,
                ROUND(AVG(ea.score)::numeric, 2) AS average_score_in_exams
            FROM users u
            LEFT JOIN exam_attempts ea ON u.id = ea.user_id
            GROUP BY u.id
            """
            df = pd.read_sql(query, self.engine)
            output_path = os.path.join(self.current_dir, 'users.csv')
            df.to_csv(output_path, index=False)
            
            return {
                "success": True,
                "message": "Users data exported successfully",
                "file_path": output_path,
                "rows_exported": len(df)
            }
        except Exception as e:
            logging.error(f"Error exporting users: {str(e)}")
            return {
                "success": False,
                "message": f"Failed to export users: {str(e)}"
            }
    
    def export_courses(self) -> Dict[str, Any]:
        """Export courses data from database"""
        try:
            query = """
            SELECT 
                c.id AS course_id,
                c.name,
                c.description,
                c.price::float,
                ROUND(AVG(uc.rating)::numeric, 2) AS average_rating,
                COUNT(DISTINCT uc.user_id) AS number_of_enrollments,
                COUNT(uc.rating) AS number_of_rating
            FROM courses c
            LEFT JOIN user_courses uc ON c.id = uc.course_id
            GROUP BY c.id
            """
            df = pd.read_sql(query, self.engine)
            output_path = os.path.join(self.current_dir, 'courses.csv')
            df.to_csv(output_path, index=False)
            
            return {
                "success": True,
                "message": "Courses data exported successfully",
                "file_path": output_path,
                "rows_exported": len(df)
            }
        except Exception as e:
            logging.error(f"Error exporting courses: {str(e)}")
            return {
                "success": False,
                "message": f"Failed to export courses: {str(e)}"
            }
    
    def export_ratings(self) -> Dict[str, Any]:
        """Export ratings data from database"""
        try:
            query = """
            SELECT 
                u.id AS user_id,
                c.id AS course_id,
                uc.rating::float AS rating
            FROM user_courses uc
            JOIN users u ON uc.user_id = u.id
            JOIN courses c ON uc.course_id = c.id
            WHERE uc.rating IS NOT NULL
            """
            df = pd.read_sql(query, self.engine)
            output_path = os.path.join(self.current_dir, 'ratings.csv')
            df.to_csv(output_path, index=False)
            
            return {
                "success": True,
                "message": "Ratings data exported successfully",
                "file_path": output_path,
                "rows_exported": len(df)
            }
        except Exception as e:
            logging.error(f"Error exporting ratings: {str(e)}")
            return {
                "success": False,
                "message": f"Failed to export ratings: {str(e)}"
            }
    
    def export_all_data(self) -> Dict[str, Any]:
        """Export all training data from database"""
        try:
            logging.info("Starting data export from database...")
            
            # Export users
            users_result = self.export_users()
            if not users_result["success"]:
                return users_result
            
            # Export courses
            courses_result = self.export_courses()
            if not courses_result["success"]:
                return courses_result
            
            # Export ratings
            ratings_result = self.export_ratings()
            if not ratings_result["success"]:
                return ratings_result
            
            return {
                "success": True,
                "message": "All training data exported successfully",
                "exports": {
                    "users": users_result,
                    "courses": courses_result,
                    "ratings": ratings_result
                },
                "summary": {
                    "total_users": users_result["rows_exported"],
                    "total_courses": courses_result["rows_exported"],
                    "total_ratings": ratings_result["rows_exported"]
                }
            }
            
        except Exception as e:
            logging.error(f"Error in data export: {str(e)}")
            return {
                "success": False,
                "message": f"Data export failed: {str(e)}"
            } 