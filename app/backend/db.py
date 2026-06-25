from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.backend.core.config import settings

DATABASE_URL = f"postgresql+asyncpg://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"

# настроили движок для настроек бд, чтобы каждый раз не писать лишний код, это называется диспетчер соединений
engine = create_async_engine(
    DATABASE_URL, echo=True
)  # знает куда подключаться, какой класс использовать, echo позволяет, выводить sql запросы в консоль

# конфигуратор(фабрика), не создаёт сейчас, а хранит кфг чтобы позже создать
AsyncSessionLocal = async_sessionmaker(
    bind=engine,  # указывает через какой драйвер подключаться
    class_=AsyncSession,
    expire_on_commit=False,  # если поставить true, то после загрузки данных sqlalchemy удалит данные из памяти питона, это может привети к ошибкам тк каждый раз будет лазить в бд
)


# все классы будут наследоваться отсюда, позволяет одной командой создать все таблицы
class Base(DeclarativeBase):
    pass


async def get_db():  # когда отправляется запрос, например на /register fastapi видит зависимоcть от get_db
    async with AsyncSessionLocal() as session:  # создаёт обьект сессии и открывает соединение с mysql
        yield session  # отдаёт открытую сессию в функцию регистрации, и работаем с базой
