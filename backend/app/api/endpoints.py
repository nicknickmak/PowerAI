# API endpoints for lifting analytics app
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.services.ai import process_query
from datetime import datetime
from app.db import SessionLocal
from app.models import Exercise, Set, WorkoutSession
from sqlalchemy.orm import joinedload
from sqlalchemy import desc

router = APIRouter()

class WorkoutSet(BaseModel):
    weight: float = None
    reps: int = None
    note: str = None

class WorkoutExercise(BaseModel):
    name: str
    sets: List[WorkoutSet]

class QueryRequest(BaseModel):
    query: List[WorkoutExercise]

class QueryResponse(BaseModel):
    result: str

@router.get("/exercises/{id}/prs")
def get_prs(id: int):
    # TODO: Implement PR lookup
    return {"prs": []}

@router.get("/exercises/{id}/last")
def get_last_session(id: int):
    # TODO: Implement last session lookup
    return {"last_session": None}

@router.get("/summary/weekly")
def get_weekly_summary():
    # TODO: Implement weekly summary
    return {"summary": {}}

@router.get("/exercises")
def get_exercises():
    db = SessionLocal()
    exercises_out = []
    exercises = db.query(Exercise).all()

    for ex in exercises:
        # Find most recent set for this exercise
        last_set = db.query(Set).filter(Set.exercise_id == ex.id).order_by(desc(Set.timestamp)).first()
        if last_set:
            last_date = last_set.timestamp.date().isoformat() if last_set.timestamp else None
            # Get all sets for this exercise in the most recent session
            sets = db.query(Set).filter(Set.exercise_id == ex.id, Set.timestamp == last_set.timestamp).all()
            sets_out = [{"weight": s.weight, "reps": s.reps} for s in sets]
        else:
            last_date = None
            sets_out = []
        exercises_out.append({
            "name": ex.name,
            "equipment": ex.equipment,
            "primaryMuscle": ex.primary_muscle,
            "secondaryMuscle": ex.secondary_muscle,
            "lastDate": last_date,
            "sets": sets_out
        })
    db.close()
    return {"exercises": exercises_out}

@router.post("/query", response_model=QueryResponse)
def query_endpoint(request: QueryRequest):
    try:
        # Example: get date and location from request or use defaults
        session_date = datetime.now()
        location = "Unknown"  # Replace with actual location if available in request
        result = process_query(request.query, session_date=session_date, location=location)
        return QueryResponse(result=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
