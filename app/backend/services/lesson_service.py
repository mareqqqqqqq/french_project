from sqlalchemy.ext.asyncio import AsyncSession
from app.backend.repositories.lesson_repo import LessonRepository

class LessonService:
    def __init__(self, db: AsyncSession):
        self.repo = LessonRepository(db)

    async def create_lesson(self, teacher_id: int, title: str):
        lesson = await self.repo.create_lesson(teacher_id, title)
        return lesson

    async def get_all_lessons(self, teacher_id: int):
        lessons = await self.repo.get_all_lessons_by_teacher(teacher_id)
        return lessons

    async def delete_lesson(self, lesson_id: int, teacher_id: int):
        result = await self.repo.delete_lesson(lesson_id)

        if result:
            return True
        else:
            return False

    async def add_vocabulary_card(self, lesson_id: int, word_fr: str, word_ru: str, emoji: str = None):
        pass

    async def add_fill_blank(self, lesson_id: int, sentence: str, translation: str, correct_answer: str, options: list):
        pass