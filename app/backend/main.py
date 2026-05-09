from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.backend.api.v1.auth import router as auth_router

app = FastAPI(title="French Project API") # app кземпляр fastapi

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:8080",
        "http://localhost:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# мы импортировали auth_router из auth файла, include router, говорит взять всё что накопилось в router и в файле auth
# prefix то что будет после домена и до /register, полный путь
# tags просто для красоты, когда откроем локалка/docs будет список функций сгруппированы по параметру auth
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
