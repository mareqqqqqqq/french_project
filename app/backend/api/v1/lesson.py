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
    lesson: CreateLessonSchema,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    lesson_service = LessonService(db)
    user_id = current_user.id
    lesson = await lesson_service.create_lesson(user_id, lesson.title)
    return lesson

@router.post("/delete_lesson")
async def delete_lesson(
    lesson_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_teacher),
):
    lesson_service = LessonService(db)
    result = await lesson_service.delete_lesson(lesson_id, current_user.id)
    return result




@router.get("/lessons_by_teacher")
async def show_lessons(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    lesson_service = LessonService(db)
    user_id = current_user.id

    result = await lesson_service.get_all_lessons_by_teacher(user_id)
    return result







@router.post("/add_fill_blank")
async def add_fill_blank():
    pass

@router.post("/add_vocabulary_card")
async def add_vocabulary_card():
    pass


