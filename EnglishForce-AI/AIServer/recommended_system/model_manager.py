import os
import time
import threading
import logging
from typing import Optional
from tensorflow.keras.models import load_model
import pickle

class ModelManager:
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(ModelManager, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if not hasattr(self, 'initialized'):
            self.current_model = None
            self.current_user_encoder = None
            self.current_course_encoder = None
            self.current_scaler = None
            self.current_tfidf = None
            self.model_path = None
            self.last_modified = 0
            self.initialized = True
            self.load_latest_model()

    def force_reload_model(self) -> dict:
        """Force reload the model immediately and return status"""
        try:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            model_path = os.path.join(current_dir, 'recommend_model.h5')
            
            if not os.path.exists(model_path):
                return {"success": False, "message": "Model file not found"}

            # Force reload by resetting last_modified
            self.last_modified = 0
            self.load_latest_model()
            
            return {
                "success": True, 
                "message": "Model reloaded successfully",
                "model_path": model_path,
                "last_modified": time.ctime(os.path.getmtime(model_path))
            }
            
        except Exception as e:
            return {"success": False, "message": f"Error reloading model: {str(e)}"}

    def load_latest_model(self):
        """Load the latest model and its components"""
        try:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            model_path = os.path.join(current_dir, 'recommend_model.h5')
            
            # Check if model file exists and has been modified
            if not os.path.exists(model_path):
                logging.error("Model file not found")
                return
                
            current_modified = os.path.getmtime(model_path)
            if current_modified <= self.last_modified:
                return

            # Load new model and components
            with self._lock:
                self.current_model = load_model(model_path)
                with open(os.path.join(current_dir, 'user_encoder.pkl'), 'rb') as f:
                    self.current_user_encoder = pickle.load(f)
                with open(os.path.join(current_dir, 'course_encoder.pkl'), 'rb') as f:
                    self.current_course_encoder = pickle.load(f)
                with open(os.path.join(current_dir, 'scaler.pkl'), 'rb') as f:
                    self.current_scaler = pickle.load(f)
                with open(os.path.join(current_dir, 'tfidf.pkl'), 'rb') as f:
                    self.current_tfidf = pickle.load(f)
                
                self.model_path = model_path
                self.last_modified = current_modified
                
            logging.info("Successfully loaded new model version")
            
        except Exception as e:
            logging.error(f"Error loading model: {str(e)}")
            raise

    def get_model(self):
        """Get the current model and its components"""
        self.load_latest_model()  # Check for updates
        return {
            'model': self.current_model,
            'user_encoder': self.current_user_encoder,
            'course_encoder': self.current_course_encoder,
            'scaler': self.current_scaler,
            'tfidf': self.current_tfidf
        }

    def start_model_watcher(self, check_interval: int = 60):
        """Start a background thread to watch for model updates"""
        def watcher():
            while True:
                try:
                    self.load_latest_model()
                except Exception as e:
                    logging.error(f"Error in model watcher: {str(e)}")
                time.sleep(check_interval)

        watcher_thread = threading.Thread(target=watcher, daemon=True)
        watcher_thread.start() 