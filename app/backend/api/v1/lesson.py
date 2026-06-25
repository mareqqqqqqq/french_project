from fastapi import APIRouter, status, Depends, Response, Cookie, Request, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from app.backend.db import get_db
from app.backend.models.user import User
from app.backend.schemas.lesson import CreateLessonSchema
from app.backend.core.dependencies import require_teacher

from app.backend.services.lesson_service import LessonService

router = APIRouter()

@router.post("/create_lesson")
async def create_lesson(
        lesson: CreateLessonSchema, db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_teacher)
):
    lesson_service = LessonService(db)
    user_id = current_user.id

    try:
        result = await lesson_service.create_lesson(user_id, lesson.title)
        return result
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )

@router.get("/lessons_by_teacher")
async def show_lessons(
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_teacher),
):
    lesson_service = LessonService(db)
    user_id = current_user.id
    try:
        result = await lesson_service.get_all_lessons(user_id)
        return result
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST, detail = str(e)
        )

@router.post("/delete_lesson")
async def delete_lesson(
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(require_teacher)
):
    lesson_service = LessonService(db)


    

