from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SetBase(BaseModel):
    exercise_id: int
    session_id: int
    reps: int
    weight: float
    rpe: Optional[float] = None
    timestamp: datetime

class SetCreate(SetBase):
    pass

class Set(SetBase):
    id: int
    class Config:
        orm_mode = True

class ExerciseBase(BaseModel):
    name: str
    category: Optional[str] = None
    primary_muscle: Optional[str] = None
    secondary_muscle: Optional[str] = None

class ExerciseCreate(ExerciseBase):
    pass

class Exercise(ExerciseBase):
    id: int
    class Config:
        orm_mode = True

class WorkoutSessionBase(BaseModel):
    date: datetime
    notes: Optional[str] = None
    location: Optional[str] = None

class WorkoutSessionCreate(WorkoutSessionBase):
    pass

class WorkoutSession(WorkoutSessionBase):
    id: int
    class Config:
        orm_mode = True
