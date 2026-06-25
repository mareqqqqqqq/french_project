from pydantic import BaseModel, Field
from datetime import datetime

class LessonSchema(BaseModel):
    id: int
    title: str = Field(min_length=3, max_length=100)
    teacher_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CreateLessonSchema(BaseModel):
    title: str = Field(min_length=3, max_length=100)



