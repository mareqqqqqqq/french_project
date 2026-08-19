from fastapi import HTTPException
from passlib.context import CryptContext
import bcrypt
import jwt
from datetime import datetime, timedelta
from app.backend.core.config import settings
from cryptography.fernet import Fernet, InvalidToken
import json

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = settings.SECRET_KEY
MATCH_TOKEN_KEY = settings.MATCH_TOKEN_KEY
match_fernet = Fernet(MATCH_TOKEN_KEY)
ALGORITHMS = ["HS256"]


def get_password_hash(password: str):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password_hash(password: str, hashed_password: str):
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHMS[0])
    return encoded_jwt


def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHMS[0])
    return encoded_jwt


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHMS)
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Токен истёк")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Невалидный токен")


def create_match_token(card_id: int, lesson_id: int) -> str:
    payload = {"card_id": card_id, "lesson_id": lesson_id}  # питоновский словарь

    # текстовое представление словаря(метод dumps)
    payload_bytes = json.dumps(payload).encode("utf-8")  # encode - превращает в байты
    encrypted_bytes = match_fernet.encrypt(payload_bytes)  # шифрование
    return encrypted_bytes.decode("utf-8")  # обратно в текстовую строку


def decode_match_token(token: str) -> dict:
    try:
        decrypted_bytes = match_fernet.decrypt(token.encode("utf-8"))
        # json.loads обратная операция json.dumps
        return json.loads(decrypted_bytes.decode("utf-8"))
    except InvalidToken:
        raise HTTPException(status_code=400, detail="Невалидный токен")
