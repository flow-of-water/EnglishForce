import numpy as np
import pandas as pd
import pickle
import os
from tensorflow.keras.models import load_model
from typing import List, Dict, Any

class RecommendationSystem:
    def __init__(self):
        # Get the current directory path
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Load model và các preprocessing tools
        model_path = os.path.join(current_dir, 'recommend_model.keras')
        if not os.path.exists(model_path):
            # Fallback to .h5 if .keras doesn't exist
            model_path = os.path.join(current_dir, 'recommend_model.h5')
        
        self.model = load_model(model_path)
        # Compile model if not compiled
        if not hasattr(self.model, 'optimizer') or self.model.optimizer is None:
            from tensorflow.keras.optimizers import Adam
            self.model.compile(optimizer=Adam(1e-3), loss='mse', metrics=['mae'])
            
        with open(os.path.join(current_dir, 'user_encoder.pkl'), 'rb') as f:
            self.user_encoder = pickle.load(f)
        with open(os.path.join(current_dir, 'course_encoder.pkl'), 'rb') as f:
            self.course_encoder = pickle.load(f)
        with open(os.path.join(current_dir, 'scaler.pkl'), 'rb') as f:
            self.scaler = pickle.load(f)
        with open(os.path.join(current_dir, 'tfidf.pkl'), 'rb') as f:
            self.tfidf = pickle.load(f)

        # Load course metadata
        self.courses_df = pd.read_csv(os.path.join(current_dir, 'courses.csv'))
        self.users_df = pd.read_csv(os.path.join(current_dir, 'users.csv'))

    def recommend_top_k_courses(self, user_id: int, k: int = 5) -> List[Dict[str, Any]]:
        """
        Gợi ý top k khóa học cho user
        
        Args:
            user_id (int): ID của user
            k (int): Số lượng khóa học muốn gợi ý
            
        Returns:
            List[Dict]: Danh sách các khóa học được gợi ý với thông tin chi tiết
        """
        try:
            user_id = int(user_id)
            if user_id not in self.user_encoder.classes_:
                raise ValueError("User ID not found. Bạn cần thêm user này vào hệ thống trước.")

            # Encode user
            user_encoded = self.user_encoder.transform([user_id])[0]

            # Lấy thông tin user
            user_info = self.users_df[self.users_df['user_id'] == user_id].iloc[0]
            score = user_info['average_score_in_exams'] if pd.notna(user_info['average_score_in_exams']) else 0
            user_score = self.scaler.transform([[score, 0, 0, 0, 0]])[0][0]

            # Chuẩn bị input cho từng course
            user_input = []
            course_input = []
            user_score_input = []
            course_features_input = []
            desc_tfidf_input = []

            for _, row in self.courses_df.iterrows():
                course_id = row['course_id']
                if course_id not in self.course_encoder.classes_:
                    continue  # bỏ qua course lạ

                course_encoded = self.course_encoder.transform([course_id])[0]

                # scale features
                scaled = self.scaler.transform([[0, row['price'], row['average_rating'], 
                                              row['number_of_enrollments'], row['number_of_rating']]])[0][1:]
                tfidf_vec = np.asarray(self.tfidf.transform([row['description'] if pd.notna(row['description']) else '']).toarray()[0])

                user_input.append(user_encoded)
                course_input.append(course_encoded)
                user_score_input.append(user_score)
                course_features_input.append(scaled)
                desc_tfidf_input.append(tfidf_vec)

            # Dự đoán
            predictions = self.model.predict([
                np.array(user_input),
                np.array(course_input),
                np.array(user_score_input),
                np.array(course_features_input),
                np.array(desc_tfidf_input)
            ])

            # Lấy top-k
            predictions_array = np.asarray(predictions).flatten()
            
            # Debug logging
            print(f"Debug: Total courses in courses_df: {len(self.courses_df)}")
            print(f"Debug: Total predictions: {len(predictions_array)}")
            print(f"Debug: Requested k: {k}")
            
            # Đảm bảo k không vượt quá số lượng predictions
            actual_k = min(k, len(predictions_array))
            if actual_k == 0:
                print("Debug: No predictions available")
                return []  # Không có predictions nào
                
            # print(f"Debug: Actual k to return: {actual_k}")
            top_indices = predictions_array.argsort()[-actual_k:][::-1]
            # print(f"Debug: Top indices: {top_indices}")
            
            # Lọc courses_df để chỉ lấy những courses đã được predict
            valid_courses_df = self.courses_df.iloc[:len(predictions_array)]
            # print(f"Debug: Valid courses df length: {len(valid_courses_df)}")
            
            # Chỉ lấy các trường cần thiết và chuyển NaN thành None
            top_courses = valid_courses_df.iloc[top_indices][['course_id', 'name', 'description', 'price', 'average_rating', 'number_of_enrollments', 'number_of_rating']]
            
            # Convert to list of dictionaries và xử lý NaN
            result = []
            for _, row in top_courses.iterrows():
                course_dict = {}
                for col in top_courses.columns:
                    val = row[col]
                    if pd.isna(val):
                        course_dict[col] = None
                    elif isinstance(val, (np.integer, np.floating)):
                        course_dict[col] = val.item()  # Convert numpy types to Python native types
                    else:
                        course_dict[col] = val
                result.append(course_dict)
            
            return result

        except Exception as e:
            raise Exception(f"Error in recommendation: {str(e)}")

# Initialize global recommendation system
recommendation_system = RecommendationSystem()
