from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    DATABASE_URL: str = Field(default="postgresql+asyncpg://nexusiq_user:nexusiq_password@localhost:5432/nexusiq_db")
    REDIS_URL: str = Field(default="redis://localhost:6379/0")
    JWT_SECRET: str = Field(default="supersecretjwtkey_replace_in_production")
    JWT_ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30)
    GEMINI_API_KEY: str = Field(default="mock_key")
    GITHUB_WEBHOOK_SECRET: str = Field(default="supersecretwebhookkey_replace_in_production")
    SECRET_ENCRYPTION_KEY: str = Field(default="hG1tK5eYp9qWz2mN8xLv6cJ3rB4uA5dC6eF7gH8iJ9k=") # 32-byte URL safe base64 key

settings = Settings()
