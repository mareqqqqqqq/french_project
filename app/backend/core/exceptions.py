from fastapi import FastAPI, APIRouter
from app.backend.db import get_db

db = get_db()


router = APIRouter()



class AppException(Exception):
    '''баовое исключение для всего приложения'''
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class EntityNotFoundException(AppException):
    '''Когда обьект не найден в бд'''
    def __init__(self, message: str = "Обьект не найден в бд"):
        super().__init__(message, status_code=404)

class NotAuthorizedException(AppException):
    '''недостаточно прав'''
    def __init__(self, message: str = "Недостаточно прав"):
        super().__init__(message, status_code=403)

class DatabaseException(AppException):
    def __init__(self, message: str = "Внутренняя ошибка бд"):
        super().__init__(message, status_code=500)
