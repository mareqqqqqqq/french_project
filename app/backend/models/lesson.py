from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.types import JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.backend.db import Base


class Lesson(Base):
    __tablename__ = "lesson"
    id = Column(
        Integer, primary_key=True
    )  # уникальный id primary key его генерит сама бд
    title = Column(String(200), nullable=False)
    teacher_id = Column(
        Integer, ForeignKey("users.id"), nullable=False
    )  # ForeignKey ссылка на строку в другой таблице
    created_at = Column(DateTime, server_default=func.now())

    vocabulary_cards = relationship(
        "VocabularyCard", back_populates="lesson", cascade="all, delete-orphan"
    )
    fill_blank_exercises = relationship(
        "FillBlankExercises", back_populates="lesson", cascade="all, delete-orphan"
    )
    user_progress = relationship(
        "UserProgress", back_populates="lesson", cascade="all, delete-orphan"
    )


class VocabularyCard(Base):
    __tablename__ = "vocabulary_cards"

    id = Column(Integer, primary_key=True)
    lesson_id = Column(Integer, ForeignKey("lesson.id"), nullable=False)
    word_fr = Column(String(200), nullable=False)
    word_ru = Column(String(200), nullable=False)
    emoji = Column(String(10), nullable=True)

    lesson = relationship("Lesson", back_populates="vocabulary_cards")


class FillBlankExercises(Base):
    __tablename__ = "fill_blank_exercises"

    id = Column(Integer, primary_key=True)
    lesson_id = Column(Integer, ForeignKey("lesson.id"), nullable=False)
    sentence = Column(String(500), nullable=False)
    translation = Column(String(500), nullable=False)
    correct_answer = Column(String(250), nullable=False)
    options = Column(JSON, nullable=False)

    lesson = relationship("Lesson", back_populates="fill_blank_exercises")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lesson.id"), nullable=False)
    score = Column(Integer, nullable=False, default=0)
    xp_earned = Column(Integer, nullable=False, default=0)
    completed_at = Column(DateTime, server_default=func.now())

    lesson = relationship("Lesson", back_populates="user_progress")
