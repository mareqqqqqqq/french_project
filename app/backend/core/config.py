from pydantic_settings import BaseSettings, SettingsConfigDict
import os

base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
env_path = os.path.join(base_dir, ".env")


class Settings(BaseSettings):
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str
    SECRET_KEY: str
    MATCH_TOKEN_KEY: str

    RATE_LIMIT_REGISTER: str = "5/minute"
    RATE_LIMIT_LOGIN: str = "10/minute"
    RATE_LIMIT_REFRESH: str = "30/minute"

    model_config = SettingsConfigDict(env_file=env_path)


settings = Settings()
