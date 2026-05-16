from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.backend.db import Base


class User(Base):
    __tablename__ = "users"
    id = Column(
        Integer, primary_key=True
    )  # уникальность, не может быть 2 пользователя с одним и тем же id
    username = Column(String(15), unique=True)
    email = Column(String(150), unique=True, index=True)
    hashed_password = Column(String(255))
    is_admin = Column(Boolean, default=False)
    refresh_token = Column(String(500), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
