from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from app.backend.api.v1.auth import router as auth_router
from app.backend.core.dependencies import limiter
from app.backend.api.v1.lesson import router as lesson_router

app = FastAPI(title="French Project API")  # app эземпляр fastapi
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# мы импортировали auth_router из auth файла, include router, говорит взять всё что накопилось в router и в файле auth
# prefix то что будет после домена и до /register, полный путь
# tags просто для красоты, когда откроем локалка/docs будет список функций сгруппированы по параметру auth
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(lesson_router, prefix="/api/v1/lesson", tags=["lesson"])
