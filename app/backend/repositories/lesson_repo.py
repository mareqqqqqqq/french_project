from sqlalchemy.ext.asyncio import AsyncSession
from app.backend.models.lesson import (
    VocabularyCard,
    Lesson,
    FillBlankExercises,
)
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import selectinload
from app.backend.core.exceptions import DatabaseException, EntityNotFoundException


class LessonRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_lessons_by_teacher(self, teacher_id: int):
        try:
            result = await self.db.execute(
                select(Lesson)
                .where(Lesson.teacher_id == teacher_id)
                .options(selectinload(Lesson.vocabulary_cards))
                .options(selectinload(Lesson.fill_blank_exercises))
            )
            return result.scalars().all()
        except SQLAlchemyError as e:
            raise DatabaseException(
                message=f"Ошобка получения всех уроков от учителя: {str(e)}"
            )

    async def get_lesson_by_id(self, lesson_id: int):
        try:
            result = await self.db.execute(
                select(Lesson)
                .where(Lesson.id == lesson_id)
                .options(selectinload(Lesson.vocabulary_cards))
            )
            lesson = result.scalar_one_or_none()
            if lesson is None:
                raise EntityNotFoundException(message=f"Ошибка: урок не найден в бд")

            return lesson
        except SQLAlchemyError as e:
            raise DatabaseException(message=f"Ошибка получения урока из бд: {str(e)}")

    async def create_lesson(self, teacher_id: int, title: str):
        try:
            new_lesson = Lesson(
                title=title,
                teacher_id=teacher_id,
            )

            self.db.add(new_lesson)
            await self.db.commit()
            await self.db.refresh(new_lesson)

            return new_lesson

        except SQLAlchemyError as e:
            await self.db.rollback()
            raise DatabaseException(message=f"Ошибка создания урока: {str(e)}")

    async def delete_lesson(self, lesson_to_delete: Lesson):
        try:
            await self.db.delete(lesson_to_delete)
            await self.db.commit()
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise DatabaseException(
                message=f"Ошибка удаления урока из бд текст ошибки: {str(e)}"
            )

    async def add_vocabulary_card(
        self, lesson_id: int, word_fr: str, word_ru: str, emoji: str = None
    ):
        try:
            new_vocabulary_card = VocabularyCard(
                lesson_id=lesson_id, word_fr=word_fr, word_ru=word_ru, emoji=emoji
            )

            self.db.add(new_vocabulary_card)
            await self.db.commit()
            await self.db.refresh(new_vocabulary_card)

            return new_vocabulary_card
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise DatabaseException(
                message="Ошибка при добавлении новой словарной карточки"
            )

    async def add_fill_blank(
        self,
        lesson_id: int,
        sentence: str,
        translation: str,
        correct_answer: str,
        options: list,
    ):
        try:
            new_fill_blank = FillBlankExercises(
                lesson_id=lesson_id,
                sentence=sentence,
                translation=translation,
                correct_answer=correct_answer,
                options=options,
            )

            self.db.add(new_fill_blank)
            await self.db.commit()
            await self.db.refresh(new_fill_blank)

            return new_fill_blank
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise DatabaseException(message=f"Ошибка при добавлении: {str(e)}")

    async def all_lessons(self):
        try:
            result = await self.db.execute(
                select(Lesson)
                .options(selectinload(Lesson.vocabulary_cards))
                .options(selectinload(Lesson.fill_blank_exercises))
            )
            return result.scalars().all()
        except SQLAlchemyError as e:
            raise DatabaseException(message=f"Ошибка при получении всех уроков")

    async def get_vocabulary_card(self, card_id: int):
        try:
            result = await self.db.execute(
                select(VocabularyCard).where(VocabularyCard.id == card_id)
            )

            vocabulary_card = result.scalars().first()

            if vocabulary_card is None:
                raise EntityNotFoundException()

            return vocabulary_card

        except SQLAlchemyError as e:
            raise DatabaseException()
