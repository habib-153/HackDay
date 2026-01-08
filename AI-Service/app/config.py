from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # API Keys
    gemini_api_key: str = ""
    openai_api_key: str = ""
    
    # Database
    mongodb_url: str = "mongodb://localhost:27017/heartspeak"
    redis_url: str = "redis://localhost:6379"
    
    # Services
    node_server_url: str = "http://localhost:5000"
    
    # App Settings
    app_name: str = "HeartSpeak AI Service"
    debug: bool = True
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
