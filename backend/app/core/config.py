from pydantic_settings import BaseSettings
from pydantic import computed_field
from urllib.parse import quote_plus

class Settings(BaseSettings):
    PROJECT_NAME: str = "JewelE Backend"
    API_V1_STR: str = "/api/v1"

    # Database
    POSTGRES_SERVER: str = "127.0.0.1"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "jewelry_db"
    POSTGRES_PORT: int = 5432

    @computed_field
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return (
            f"postgresql+psycopg2://{quote_plus(self.POSTGRES_USER)}:"
            f"{quote_plus(self.POSTGRES_PASSWORD)}@"
            f"{self.POSTGRES_SERVER}:"
            f"{self.POSTGRES_PORT}/"
            f"{self.POSTGRES_DB}"
        )

    # Security
    SECRET_KEY: str = "CHANGE_THIS_TO_A_SECURE_SECRET_KEY_IN_PRODUCTION"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 11520

    # Razorpay
    RAZORPAY_KEY_ID: str = "rzp_test_placeholder" # Placeholder, user needs to fill
    RAZORPAY_KEY_SECRET: str = "rzp_secret_placeholder" # Placeholder, user needs to fill
    RAZORPAY_WEBHOOK_SECRET: str = "webhook_secret_placeholder"

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()
