from fastapi import HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.backend.core.security import decode_token
from app.backend.db import get_db
from fastapi import Cookie
from fastapi import Request

limiter = Limiter(key_func=get_remote_address)


async def get_current_user(
    request: Request,
    access_token: str = Cookie(default=None),
    db: AsyncSession = Depends(get_db),
):
    from app.backend.models.user import User

    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="No access token in cookie"
        )

    payload = decode_token(access_token)
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(status_code=401, detail="Incorrect token")

    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=401, detail="no user found")

    return user


async def require_teacher(
    current_user=Depends(get_current_user),
):
    if not current_user.is_teacher:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user
