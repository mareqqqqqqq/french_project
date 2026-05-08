from pydantic import BaseModel, EmailStr
from typing import Optional

# наследуем BaseModel чтобы включилась логика Body paremeter чтобы читалось тело(body) того что было отправлено в запросу
class UserCreate(BaseModel):
    username: Optional[str] = None
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str


