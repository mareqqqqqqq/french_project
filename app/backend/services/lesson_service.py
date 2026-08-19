from http.client import HTTPException

from sqlalchemy.ext.asyncio import AsyncSession

from app.backend.core.exceptions import NotAuthorizedException
from app.backend.repositories.lesson_repo import LessonRepository
from app.backend.core.security import create_match_token, decode_match_token


class LessonService:
    def __init__(self, db: AsyncSession):
        self.repo = LessonRepository(db)

    async def create_lesson(self, teacher_id: int, title: str):
        lesson = await self.repo.create_lesson(teacher_id, title)
        return lesson

    async def delete_lesson(self, lesson_id: int, teacher_id: int):
        lesson = await self.repo.get_lesson_by_id(lesson_id)
        if teacher_id != lesson.teacher_id:
            raise NotAuthorizedException(message=f"Недостаточно прав")

        await self.repo.delete_lesson(lesson)

    async def get_all_lessons_by_teacher(self, teacher_id: int):
        lessons = await self.repo.get_all_lessons_by_teacher(teacher_id)
        return lessons

    async def add_vocabulary_card(
        self,
        teacher_id: int,
        lesson_id: int,
        word_fr: str,
        word_ru: str,
        emoji: str = None,
    ):
        lesson = await self.repo.get_lesson_by_id(lesson_id)
        if teacher_id != lesson.teacher_id:
            raise NotAuthorizedException(message=f"недостаточно прав")

        vocabulary_card = await self.repo.add_vocabulary_card(
            lesson_id, word_fr, word_ru, emoji
        )
        return vocabulary_card

    async def add_fill_blank(
        self,
        teacher_id: int,
        lesson_id: int,
        sentence: str,
        translation: str,
        correct_answer: str,
        options: list,
    ):
        lesson = await self.repo.get_lesson_by_id(lesson_id)
        if teacher_id != lesson.teacher_id:
            raise NotAuthorizedException(message="Недостаточно прав")

        fill_blank = await self.repo.add_fill_blank(
            lesson_id, sentence, translation, correct_answer, options
        )
        return fill_blank

    async def all_lessons(self):
        lessons = await self.repo.all_lessons()
        return lessons

    async def check_match(
        self, lesson_id: int, left_card_id: int, right_token: str
    ) -> bool:
        payload = decode_match_token(right_token)

        if payload["lesson_id"] != lesson_id:
            raise NotAuthorizedException(message="Токен от другого урока")

        is_match = left_card_id == payload["card_id"]

        card = await self.repo.get_vocabulary_card(left_card_id)
        if card.lesson_id != lesson_id:
            raise NotAuthorizedException("Карточка не принадлежит этому уроку")

        return is_match

    async def get_match_data(self, lesson_id: int):
        lesson = await self.repo.get_lesson_by_id(lesson_id)

        fr_items = [
            {"id": card.id, "word": card.word_fr} for card in lesson.vocabulary_cards
        ]

        ru_items = [
            {"token": create_match_token(card.id, lesson_id), "word": card.word_ru}
            for card in lesson.vocabulary_cards
        ]

        return {"fr_items": fr_items, "ru_items": ru_items}

