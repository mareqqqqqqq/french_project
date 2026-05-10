from fastapi import APIRouter, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.backend.schemas.user import UserCreate, UserLogin
from app.backend.db import get_db
from app.backend.models.user import User
from sqlalchemy import select
from fastapi import HTTPException
from app.backend.core.security import get_password_hash, verify_password_hash, create_access_token, create_refresh_token


# просто коллектор,
router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user.email))
    db_user = result.scalars().first()

    if db_user:
        raise HTTPException(
            status_code=409,
            detail="Пользователь с такой почтой уже существует"
        )

    new_user = User(
        username = user.username,
        email =  user.email,
        hashed_password = get_password_hash(user.password)
    )

    db.add(new_user)
    await db.commit() # сохранть
    await db.refresh(new_user) # освежили данные в питоне чтобы узнать какой id база дата пользователю

    print(f"Новый пользователь {user.email} принят к обработке")

    # return автоматически добавляет код 200(успех) как httpExpression
    return {"message": "Успех", "email": user.email}


@router.post("/login")
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user.email))
    db_user = result.scalars().first() # scalars - превращает результат в список обьектов Python

    if not db_user:
        raise HTTPException(
            status_code =401,
            detail="Пользователь с такой почтой не найден"
        )

    is_valid = verify_password_hash(user.password, db_user.hashed_password)

    if not is_valid:
        raise HTTPException(
            status_code=401,
            detail="Неверный пароль"
        )

    # subject
    access_token = create_access_token({"sub": str(db_user.id)})
    refresh_token = create_refresh_token({"sub": str(db_user.id)})

    db_user.refresh_token = refresh_token
    await db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "username": db_user.username
    }
