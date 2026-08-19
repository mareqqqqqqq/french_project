from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import List, Optional


class CreateLessonSchema(BaseModel):
    title: str = Field(min_length=3, max_length=100)


class CreateVocabularyCardSchema(BaseModel):
    word_fr: str = Field(min_length=3, max_length=100)
    word_ru: str = Field(min_length=3, max_length=100)
    emoji: Optional[str] = Field(None, max_length=100)


class CreateFillBlankSchema(BaseModel):
    sentence: str = Field(min_length=3)
    translation: str = Field(min_length=3)
    correct_answer: str = Field(min_length=3, max_length=100)
    options: List[str] = Field(default=[], max_length=100)

    class Config:
        from_attributes = True


# схема не для валидации, а для фильтрации и перевода с бд языка на json
class VocabularyCardSchema(BaseModel):
    id: int
    lesson_id: int
    word_fr: str
    word_ru: str
    emoji: Optional[str] = None

    class Config:
        from_attributes = True


class FillBlankSchema(BaseModel):
    id: int
    lesson_id: int
    sentence: str
    translation: str
    correct_answer: str
    options: List[str] = Field(default=[])

    class Config:
        from_attributes = True


class LessonSchema(BaseModel):
    id: int
    title: str = Field(min_length=3, max_length=100)
    teacher_id: int
    created_at: datetime

    vocabulary_cards: List[VocabularyCardSchema] = []
    fill_blank_exercises: List[FillBlankSchema] = []

    class Config:
        from_attributes = True


class FillBlankPublicSchema(BaseModel):
    id: int
    lesson_id: int
    sentence: str
    translation: str
    options: List[str] = Field(default=[])

    class Config:
        from_attributes = True


class LessonPublicSchema(BaseModel):
    id: int
    title: str = Field(min_length=3, max_length=100)
    teacher_id: int
    created_at: datetime

    vocabulary_cards: List[VocabularyCardSchema] = []
    fill_blank_exercises: List[FillBlankPublicSchema] = []

    class Config:
        from_attributes = True


class MatchFrItemSchema(BaseModel):
    id: int
    word: str


class MatchRuItemSchema(BaseModel):
    token: str
    word: str


class MatchDataSchema(BaseModel):
    fr_items: List[MatchFrItemSchema]
    ru_items: List[MatchRuItemSchema]


