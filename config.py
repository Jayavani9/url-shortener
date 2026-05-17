from dotenv import load_dotenv
import os

load_dotenv()
PORT = int(os.getenv("PORT",8000))
SECRET_KEY = os.getenv("SECRET_KEY")
API_KEY = os.getenv("API_KEY")
DB_PATH = os.getenv("DB_PATH", "urls.db")
RATE_LIMIT = os.getenv("RATE_LIMIT", "100 per hour")
BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")
DATABASE_URL = os.getenv("DATABASE_URL")