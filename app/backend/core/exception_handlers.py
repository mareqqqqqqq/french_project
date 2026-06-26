import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.backend.core.exceptions import AppException
from sqlalchemy.exc import SQLAlchemyError


logger = logging.getLogger(__name__)

def register_db_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": exc.__class__.__name__,
                "detail": exc.message,
            }
        )

    @app.exception_handler(SQLAlchemyError)
    async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
        # записывает в логи полную трассировку ошибки
        logger.error(f"Необработанный сбой SQLAlchemy: {str(exc)}", exc_info=True)

        return JSONResponse(
            status_code=500,
            content={
                "error": "DatabaseException",
                "detail": "Произошёл критический сбой при работе с бд"
            }
        )

