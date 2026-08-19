from fastapi import APIRouter, status, Depends, Response, Cookie, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.backend.db import get_db
from app.backend.models.user import User
from app.backend.schemas.lesson import (
    CreateLessonSchema,
    CreateVocabularyCardSchema,
    LessonSchema,
    CreateFillBlankSchema,
    LessonPublicSchema,
    MatchDataSchema,
)
from app.backend.core.dependencies import require_teacher, get_current_user

from app.backend.services.lesson_service import LessonService
from typing import List


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
    lesson_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    lesson_service = LessonService(db)
    result = await lesson_service.delete_lesson(lesson_id, current_user.id)
    return result


@router.get("/all_lessons_by_teacher", response_model=List[LessonSchema])
async def show_lessons(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    lesson_service = LessonService(db)
    user_id = current_user.id

    result = await lesson_service.get_all_lessons_by_teacher(user_id)

    return result


@router.post("/add_vocabulary_card")
async def add_vocabulary_card(
    lesson_id: int,
    vocabulary_card: CreateVocabularyCardSchema,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    lesson_service = LessonService(db)

    return await lesson_service.add_vocabulary_card(
        current_user.id,
        lesson_id,
        vocabulary_card.word_fr,
        vocabulary_card.word_ru,
        vocabulary_card.emoji,
    )


@router.post("/add_fill_blank")
async def add_fill_blank(
    fill_blank: CreateFillBlankSchema,
    lesson_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    lesson_service = LessonService(db)

    return await lesson_service.add_fill_blank(
        current_user.id,
        lesson_id,
        fill_blank.sentence,
        fill_blank.translation,
        fill_blank.correct_answer,
        fill_blank.options,
    )


@router.get("/all_lessons", response_model=List[LessonPublicSchema])
async def all_lessons(
    db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)
):
    lesson_service = LessonService(db)
    result = await lesson_service.all_lessons()

    return result


@router.post("/lesson/{lesson_id}/check_match")
async def check_match(
    lesson_id: int,
    left_card_id: int,
    right_token: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> bool:
    lesson_service = LessonService(db)
    is_match = await lesson_service.check_match(lesson_id, left_card_id, right_token)

    return is_match


@router.get("/lesson/{lesson_id}/match_data", response_model=MatchDataSchema)
async def match_data(
    lesson_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lesson_service = LessonService(db)
    return await lesson_service.get_match_data(lesson_id)
