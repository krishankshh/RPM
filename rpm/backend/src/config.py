import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # MongoDB Configuration
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb+srv://krishankshh54:professorai@rpm.wca8g.mongodb.net/?retryWrites=true&w=majority&appName=rpm')
    
    # DeepSeek AI Configuration
    DEEPSEEK_API_KEY = os.getenv('DEEPSEEK_API_KEY', 'sk-df9a6adbdc9f4035a0f35d89ad73f739')
    DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1'
    
    # Google OAuth Configuration
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
    
    # JWT and Security
    JWT_SECRET = os.getenv('JWT_SECRET', 'ai_tutoring_platform_jwt_secret_2024')
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', 'ai_tutoring_platform_flask_secret_2024')
    
    # Application Configuration
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')
    
    # Credit System
    DAILY_CREDIT_LIMIT = int(os.getenv('DAILY_CREDIT_LIMIT', 500))
    TOKENS_PER_CREDIT = int(os.getenv('TOKENS_PER_CREDIT', 75))
    
    # File Upload Configuration
    MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB
    ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}
    UPLOAD_FOLDER = 'uploads'
    
    # Vector Database Configuration
    VECTOR_INDEX_PATH = 'vector_index'
    CHUNK_SIZE = 500
    CHUNK_OVERLAP = 50

class ProductionConfig(Config):
    FLASK_ENV = 'production'
    DEBUG = False

class DevelopmentConfig(Config):
    FLASK_ENV = 'development'
    DEBUG = True

def get_config():
    env = os.getenv('FLASK_ENV', 'development')
    if env == 'production':
        return ProductionConfig()
    return DevelopmentConfig()

