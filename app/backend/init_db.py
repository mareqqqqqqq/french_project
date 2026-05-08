from app.backend.db import engine, Base
from app.backend.models.user import User
import asyncio
from app.backend.db import engine, Base

async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Таблицы созданы")


if __name__ == "__main__":
    asyncio.run(init_models())


