from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# наследуем BaseModel чтобы включилась логика Body paremeter чтобы читалось тело(body) того что было отправлено в запросу
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str = Field(min_length=8, description="Пароль должен быть не короче 8 символов")

class UserLogin(BaseModel):
    email: EmailStr
    password: str


