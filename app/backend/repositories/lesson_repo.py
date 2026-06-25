from sqlalchemy.ext.asyncio import AsyncSession
from app.backend.models.lesson import VocabularyCard, Lesson, FillBlankExercises, UserProgress
from sqlalchemy import select, delete
import datetime

class LessonRepository():
    def __init__(self, db: AsyncSession):
        self.db = db

    # получаем все уроки от учителя
    async def get_all_lessons_by_teacher(self, teacher_id: int):
        result = await self.db.execute(select(Lesson).where(Lesson.teacher_id == teacher_id))
        return result.scalars().all()

    async def get_lesson_by_id(self, lesson_id: int):
        result = await self.db.execute(select(Lesson).where(Lesson.id == lesson_id))
        return result.scalar_one_or_none()

    async def create_lesson(self, teacher_id: int, title: str):
        new_lesson = Lesson(
            title = title,
            teacher_id = teacher_id,
        )

        self.db.add(new_lesson)
        await self.db.commit()
        await self.db.refresh(new_lesson)

        return new_lesson

    async def delete_lesson(self, lesson_id: int):
        lesson_to_delete = await self.get_lesson_by_id(lesson_id)

        if lesson_to_delete:
            await self.db.delete(lesson_to_delete)
            await self.db.commit()
            return True

        return False

    async def add_vocabulary_card(self, lesson_id: int, word_fr: str, word_ru: str, emoji: str = None):
        new_vocabulary_card = VocabularyCard(
            lesson_id = lesson_id,
            word_fr = word_fr,
            word_ru = word_ru,
            emoji = emoji
        )

        self.db.add(new_vocabulary_card)
        await self.db.commit()
        await self.db.refresh(new_vocabulary_card)

        return new_vocabulary_card

    async def add_fill_blank(self, lesson_id: int, sentence: str, translation: str, correct_answer: str, options: list):
        new_fill_blank = FillBlankExercises(
            lesson_id=lesson_id,
            sentence=sentence,
            translation=translation,
            correct_answer=correct_answer,
            options=options
        )

        self.db.add(new_fill_blank)
        await self.db.commit()
        await self.db.refresh(new_fill_blank)

        return new_fill_blank