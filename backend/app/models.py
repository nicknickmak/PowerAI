from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, desc
from sqlalchemy.orm import relationship
from .db import Base

class WorkoutSession(Base):
    __tablename__ = "workout_sessions"
    id = Column(Integer, primary_key=True, index=True)
    location = Column(String)
    date = Column(DateTime)
    notes = Column(String)
    sets = relationship("Set", back_populates="session")

class Exercise(Base):
    __tablename__ = "exercises"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    equipment = Column(String)
    primary_muscle = Column(String)
    secondary_muscle = Column(String)
    sets = relationship("Set", back_populates="exercise")

class Set(Base):
    __tablename__ = "sets"
    id = Column(Integer, primary_key=True, index=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id"))
    session_id = Column(Integer, ForeignKey("workout_sessions.id"))
    reps = Column(Integer)
    weight = Column(Float)
    rpe = Column(Float)
    exercise = relationship("Exercise", back_populates="sets")
    session = relationship("WorkoutSession", back_populates="sets")

def get_top_set_for_exercise(db, exercise_id):
    """Return the set with the highest weight * reps for a given exercise."""
    return (
        db.query(Set)
        .filter(Set.exercise_id == exercise_id)
        .order_by(desc(Set.weight * Set.reps))
        .first()
    )
