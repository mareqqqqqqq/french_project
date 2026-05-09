from pydantic_settings import BaseSettings
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.sql import func
import os
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from pydantic_settings import BaseSettings, SettingsConfigDict

base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
env_path = os.path.join(base_dir, ".env")


# у класса приоритет для приведения типов это нам даёт BaseSettings библиотека
class Settings(BaseSettings):
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str
    SECRET_KEY: str

    model_config = SettingsConfigDict(env_file=env_path) # указали настройку для файла, будем лезть в .env файл

print(f"ищу вот тут: {env_path}")
settings = Settings()

DATABASE_URL = f"mysql+aiomysql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"

# настроили движок для настроек бд, чтобы каждый раз не писать лишний код, это называется диспетчер соединений
engine = create_async_engine(DATABASE_URL, echo = True) # знает куда подключаться, какой класс использовать, echo позволяет, выводить sql запросы в консоль

# конфигуратор(фабрика), не создаёт сейчас, а хранит кфг чтобы позже создать
AsyncSessionLocal = async_sessionmaker(
    bind=engine, # указывает через какой драйвер подключаться
    class_=AsyncSession,
    expire_on_commit=False # если поставить true, то после загрузки данных sqlalchemy удалит данные из памяти питона, это может привети к ошибкам тк каждый раз будет лазить в бд
)

# все классы будут наследоваться отсюда, позволяет одной командой создать все таблицы
class Base(DeclarativeBase):
    pass

async def get_db(): # когда отправляется запрос, например на /register fastapi видит зависимоcть от get_db
    async with AsyncSessionLocal() as session: # создаёт обьект сессии и открывает соединение с mysql
        yield session # отдаёт открытую сессию в функцию регистрации, и работаем с базой




#TODO разобраться с синхронным и асинхронными потоками, как во flast и fastapi




