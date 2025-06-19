import os
import logging
import importlib.util
from typing import Dict, Any
from .data_exporter import DataExporter

class TrainingPipeline:
    def __init__(self, database_url: str):
        self.current_dir = os.path.dirname(os.path.abspath(__file__))
        self.data_exporter = DataExporter(database_url)
        
    def export_data(self) -> Dict[str, Any]:
        """Export data from database to CSV files"""
        try:
            logging.info("Exporting data from database...")
            return self.data_exporter.export_all_data()
        except Exception as e:
            logging.error(f"Data export error: {str(e)}")
            return {
                "success": False,
                "message": f"Data export failed: {str(e)}"
            }
        
    def run_preprocessing(self) -> Dict[str, Any]:
        """Run the existing preprocessing script"""
        try:
            logging.info("Running preprocessing...")
            
            # Import and run the preprocessing script
            preprocess_path = os.path.join(self.current_dir, '15_4_preprocess.py')
            spec = importlib.util.spec_from_file_location("preprocess", preprocess_path)
            preprocess_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(preprocess_module)
            
            return {
                "success": True,
                "message": "Preprocessing completed successfully"
            }
        except Exception as e:
            logging.error(f"Preprocessing error: {str(e)}")
            return {
                "success": False,
                "message": f"Preprocessing failed: {str(e)}"
            }
    
    def run_training(self) -> Dict[str, Any]:
        """Run the existing training script"""
        try:
            logging.info("Running model training...")
            
            # Import and run the training script
            train_path = os.path.join(self.current_dir, '15_4_train_model.py')
            spec = importlib.util.spec_from_file_location("train_model", train_path)
            train_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(train_module)
            
            return {
                "success": True,
                "message": "Model training completed successfully",
                "model_path": os.path.join(self.current_dir, 'recommend_model.keras')
            }
        except Exception as e:
            logging.error(f"Training error: {str(e)}")
            return {
                "success": False,
                "message": f"Training failed: {str(e)}"
            }
    
    def train_and_save_model(self) -> Dict[str, Any]:
        """Complete training pipeline: export data, preprocess, train"""
        try:
            logging.info("Starting complete training pipeline...")
            
            # Step 1: Export data from database
            export_result = self.export_data()
            if not export_result["success"]:
                return export_result
            
            # Step 2: Run preprocessing
            preprocess_result = self.run_preprocessing()
            if not preprocess_result["success"]:
                return preprocess_result
            
            # Step 3: Run training
            training_result = self.run_training()
            if not training_result["success"]:
                return training_result
            
            return {
                "success": True,
                "message": "Complete training pipeline finished successfully",
                "export": export_result,
                "preprocessing": preprocess_result,
                "training": training_result
            }
            
        except Exception as e:
            logging.error(f"Training pipeline error: {str(e)}")
            return {
                "success": False,
                "message": f"Training pipeline failed: {str(e)}"
            } 