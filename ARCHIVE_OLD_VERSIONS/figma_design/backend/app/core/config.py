from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # Application
    PROJECT_NAME: str = "labl IQ Rate Analyzer"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://yourdomain.com"
    ]
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/shipping_analyzer"
    # For development with SQLite:
    # DATABASE_URL: str = "sqlite:///./shipping_analyzer.db"
    
    # File Storage
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_FILE_TYPES: List[str] = [".csv", ".xlsx", ".xls"]
    
    # AWS S3 (for production)
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    S3_BUCKET: Optional[str] = None
    
    # Redis (for background tasks)
    REDIS_URL: str = "redis://localhost:6379"
    
    # Shipping APIs
    UPS_API_KEY: Optional[str] = None
    FEDEX_API_KEY: Optional[str] = None
    USPS_API_KEY: Optional[str] = None
    DHL_API_KEY: Optional[str] = None
    
    # Third-party integrations
    EASYPOST_API_KEY: Optional[str] = None
    SHIPSTATION_API_KEY: Optional[str] = None
    SHIPPO_API_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()