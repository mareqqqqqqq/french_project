import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import StaticPool

from app.backend.main import app
from app.backend.db import Base, get_db


DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest.fixture # заготовка, которую pytest передаёт в тесты автоматически
async def db_session():
    engine = create_async_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}, # нужно только для sqlite
        poolclass=StaticPool, # только для sqlite в памяти
    )

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(bind=engine, expire_on_commit = False)

    async with session_factory() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    await engine.dispose()

@pytest.fixture
async def client(db_session): # тестовый клиент
    app.dependency_overrides[get_db] = lambda: db_session

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac

    app.dependecy_overrides.clear()