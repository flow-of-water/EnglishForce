from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/dbname")

# Scheduler Configuration
MODEL_UPDATE_INTERVAL = int(os.getenv("MODEL_UPDATE_INTERVAL", "72"))

# Server Configuration
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8000")) 