from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime
import logging
from .model_trainer import train_model
from .model_manager import ModelManager
from config import MODEL_UPDATE_INTERVAL

class ModelUpdateScheduler:
    def __init__(self, model_manager: ModelManager):
        self.model_manager = model_manager
        self.scheduler = BackgroundScheduler()
        self.setup_logging()

    def setup_logging(self):
        logging.basicConfig(
            filename='logs/scheduler.log',
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )

    def update_model(self):
        try:
            logging.info(f"Starting scheduled model update at {datetime.now()}")
            result = train_model()
            if result['status'] == 'success':
                self.model_manager.load_model()
                logging.info("Model updated successfully")
            else:
                logging.error(f"Model update failed: {result.get('error', 'Unknown error')}")
        except Exception as e:
            logging.error(f"Error during scheduled model update: {str(e)}")

    def start(self):
        """Start the scheduler with interval trigger"""
        self.scheduler.add_job(
            self.update_model,
            trigger=IntervalTrigger(hours=MODEL_UPDATE_INTERVAL),
            next_run_time=datetime.now()  # Run immediately on startup
        )
        self.scheduler.start()
        logging.info(f"Scheduler started. Model will update every {MODEL_UPDATE_INTERVAL} hours")

    def stop(self):
        """Stop the scheduler"""
        self.scheduler.shutdown()
        logging.info("Scheduler stopped")

    def get_status(self):
        """Lấy thông tin về lần cập nhật tiếp theo"""
        job = self.scheduler.get_job('model_update_job')
        next_run = job.next_run_time if job else None
        
        return {
            "status": "running" if self.scheduler.running else "stopped",
            "next_update": next_run.isoformat() if next_run else None,
            "update_interval_hours": MODEL_UPDATE_INTERVAL,
            "cron_expression": None  # IntervalTrigger does not support cron expression
        } 