import tensorflow as tf
from tensorflow.keras.models import load_model
import threading
import os
import shutil
from datetime import datetime
import pickle
import logging
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

class ModelManager:
    def __init__(self, model_dir='models'):
        self.model_dir = model_dir
        self.model_lock = threading.Lock()
        self.current_model = None
        self.encoders = {}
        self.is_updating = False
        self.setup_logging()
        self.load_current_model()

    def setup_logging(self):
        logging.basicConfig(
            filename='logs/model_manager.log',
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )

    def load_current_model(self):
        """Load model và encoders với thread-safe"""
        with self.model_lock:
            try:
                model_path = os.path.join(self.model_dir, 'recommend_model.h5')
                self.current_model = load_model(model_path)
                
                # Load encoders
                encoder_files = ['user_encoder.pkl', 'course_encoder.pkl', 
                               'tfidf.pkl', 'scaler.pkl']
                for file in encoder_files:
                    name = file.split('.')[0]
                    with open(os.path.join(self.model_dir, file), 'rb') as f:
                        self.encoders[name] = pickle.load(f)
                
                logging.info("Model and encoders loaded successfully")
            except Exception as e:
                logging.error(f"Error loading model: {str(e)}")
                # Nếu load thất bại, thử load backup
                self.load_backup_model()

    def load_backup_model(self):
        """Load model backup nếu model chính bị lỗi"""
        try:
            backup_dir = os.path.join(self.model_dir, 'backup')
            if os.path.exists(backup_dir):
                model_path = os.path.join(backup_dir, 'recommend_model.h5')
                self.current_model = load_model(model_path)
                
                # Load backup encoders
                encoder_files = ['user_encoder.pkl', 'course_encoder.pkl', 
                               'tfidf.pkl', 'scaler.pkl']
                for file in encoder_files:
                    name = file.split('.')[0]
                    with open(os.path.join(backup_dir, file), 'rb') as f:
                        self.encoders[name] = pickle.load(f)
                
                logging.info("Backup model loaded successfully")
        except Exception as e:
            logging.error(f"Error loading backup model: {str(e)}")
            raise

    def safe_update_model(self, new_model_path, new_encoders):
        """Cập nhật model một cách an toàn"""
        if self.is_updating:
            logging.warning("Model update already in progress")
            return False

        self.is_updating = True
        try:
            # Tạo temporary directory
            temp_dir = os.path.join(self.model_dir, 'temp')
            os.makedirs(temp_dir, exist_ok=True)

            # Copy model mới vào temp
            temp_model_path = os.path.join(temp_dir, 'recommend_model.h5')
            shutil.copy2(new_model_path, temp_model_path)

            # Copy encoders mới vào temp
            for name, encoder in new_encoders.items():
                with open(os.path.join(temp_dir, f'{name}.pkl'), 'wb') as f:
                    pickle.dump(encoder, f)

            # Load và verify model mới
            try:
                test_model = load_model(temp_model_path)
                # Có thể thêm các verification khác ở đây
            except Exception as e:
                logging.error(f"New model verification failed: {str(e)}")
                shutil.rmtree(temp_dir)
                return False

            # Backup model hiện tại
            backup_dir = os.path.join(self.model_dir, 'backup')
            os.makedirs(backup_dir, exist_ok=True)
            
            with self.model_lock:
                # Lưu model và encoders hiện tại vào backup
                current_model_path = os.path.join(self.model_dir, 'recommend_model.h5')
                if os.path.exists(current_model_path):
                    shutil.copy2(current_model_path, 
                               os.path.join(backup_dir, 'recommend_model.h5'))
                    for name in self.encoders:
                        src = os.path.join(self.model_dir, f'{name}.pkl')
                        if os.path.exists(src):
                            shutil.copy2(src, os.path.join(backup_dir, f'{name}.pkl'))

                # Move files từ temp vào thư mục chính
                shutil.move(temp_model_path, current_model_path)
                for name in new_encoders:
                    src = os.path.join(temp_dir, f'{name}.pkl')
                    dst = os.path.join(self.model_dir, f'{name}.pkl')
                    shutil.move(src, dst)

                # Load model mới
                self.load_current_model()

            # Cleanup
            if os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)

            logging.info("Model updated successfully")
            return True

        except Exception as e:
            logging.error(f"Error during model update: {str(e)}")
            return False

        finally:
            self.is_updating = False

    def predict(self, user_id, course_id, features=None):
        """Thread-safe prediction"""
        with self.model_lock:
            try:
                # Encode inputs
                user_encoded = self.encoders['user_encoder'].transform([user_id])
                course_encoded = self.encoders['course_encoder'].transform([course_id])
                
                # Prepare features
                user_input = user_encoded
                course_input = course_encoded
                
                # Additional features
                feature_inputs = []
                if features and 'user_score' in features:
                    user_score = self.encoders['scaler'].transform([[features['user_score']]])
                    feature_inputs.append(user_score)
                
                # Make prediction
                inputs = [user_input, course_input] + feature_inputs
                prediction = self.current_model.predict(inputs)
                
                return prediction[0][0]
                
            except Exception as e:
                logging.error(f"Prediction error: {str(e)}")
                return None

    def get_similar_courses(self, course_id, recent_interactions_df, n=5):
        """Tìm khóa học tương tự dựa trên hành vi người dùng gần đây"""
        try:
            # Tạo ma trận user-course interaction
            interaction_matrix = pd.pivot_table(
                recent_interactions_df,
                values='score',
                index='user_id',
                columns='course_id',
                fill_value=0
            )
            
            # Tính similarity giữa các khóa học
            course_similarity = cosine_similarity(interaction_matrix.T)
            course_similarity = pd.DataFrame(
                course_similarity,
                index=interaction_matrix.columns,
                columns=interaction_matrix.columns
            )
            
            # Lấy n khóa học tương tự nhất
            if course_id in course_similarity.index:
                similar_scores = course_similarity[course_id].sort_values(ascending=False)
                similar_courses = similar_scores[1:n+1].index.tolist()
                return similar_courses
            return []
            
        except Exception as e:
            logging.error(f"Error finding similar courses: {str(e)}")
            return []

    def get_model_info(self):
        """Lấy thông tin về model hiện tại"""
        return {
            "model_path": os.path.join(self.model_dir, 'recommend_model.h5'),
            "last_updated": datetime.fromtimestamp(
                os.path.getmtime(os.path.join(self.model_dir, 'recommend_model.h5'))
            ).strftime('%Y-%m-%d %H:%M:%S'),
            "encoders_loaded": list(self.encoders.keys())
        } 