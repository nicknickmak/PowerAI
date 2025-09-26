# API endpoints for lifting analytics app
from fastapi import APIRouter
from pydantic import BaseModel
from app.db import SessionLocal
from app.models import Exercise, Set, WorkoutSession
from sqlalchemy import desc
from app.services.ingestion import ingest_workout

router = APIRouter()

class SubmitRequest(BaseModel):
    exercises: list
    session_date: str = None
    location: str = None

class SubmitResponse(BaseModel):
    success: bool
    detail: str = None

@router.get("/sessions")
def get_sessions():
    """
    Get all workout sessions with their exercises and sets
    TODO: move DB logic to a ingestion service
    """
    db = SessionLocal()
    sessions_out = []
    sessions = db.query(WorkoutSession).order_by(desc(WorkoutSession.date)).all()

    for session in sessions:
        sets = db.query(Set).filter(Set.session_id == session.id).all()
        sets_out = []
        for s in sets:
            exercise = db.query(Exercise).filter(Exercise.id == s.exercise_id).first()
            sets_out.append({
                "exercise": exercise.name if exercise else None,
                "equipment": exercise.equipment if exercise else None,
                "primaryMuscle": exercise.primary_muscle if exercise else None,
                "secondaryMuscle": exercise.secondary_muscle if exercise else None,
                "weight": s.weight,
                "reps": s.reps,
                "rpe": getattr(s, "rpe", None),
                "timestamp": s.timestamp.isoformat() if getattr(s, "timestamp", None) else None
            })
        sessions_out.append({
            "id": session.id,
            "date": session.date.isoformat() if session.date else None,
            "location": session.location,
            "sets": sets_out
        })
    db.close()
    return {"sessions": sessions_out}


@router.post("/submit", response_model=SubmitResponse)
def submit_endpoint(request: SubmitRequest):
    try:
        ingest_workout(request.exercises)
        return SubmitResponse(success=True, detail="Workout submitted successfully.")
    except Exception as e:
        return SubmitResponse(success=False, detail=str(e))

@router.get("/workouts/last-workout-by-muscle")
def get_last_workout_by_muscle():
    """
    Get the most recent workout session for each muscle group and return the details
    TODO: move DB logic to a ingestion service
    """
    db = SessionLocal()
    # Get all muscle groups from exercises
    muscle_groups = db.query(Exercise.primary_muscle).distinct().all()
    # Normalize muscle group names to lowercase
    muscle_groups = [mg[0].lower() for mg in muscle_groups if mg[0]]
    result = {}
    for muscle in muscle_groups:
        # Get the most recent session that has sets for this muscle group
        session = (
            db.query(WorkoutSession)
            .join(Set, WorkoutSession.id == Set.session_id)
            .join(Exercise, Set.exercise_id == Exercise.id)
            .filter(Exercise.primary_muscle == muscle, WorkoutSession.date.isnot(None))
            .order_by(WorkoutSession.date.desc())
            .first()
        )

        # If a session is found, get the the sets for this muscle group in that session
        # return the set with the highest weight
        if session:
            top_set = (
                db.query(Set)
                .join(Exercise, Set.exercise_id == Exercise.id)
                .filter(Set.session_id == session.id, Exercise.primary_muscle == muscle)
                .order_by(desc(Set.weight))
                .first()
            )
            if not top_set:
                continue

            result[muscle] = {
                "session_date": session.date if session.date else None,
                "location": session.location,
                "exercise": top_set.exercise.name,
                "equipment": top_set.exercise.equipment,
                "primary_muscle": top_set.exercise.primary_muscle,
                "secondary_muscle": top_set.exercise.secondary_muscle,
                "top_set": {"weight": top_set.weight, "reps": top_set.reps, "rpe": top_set.rpe}
            }
        else:
            result[muscle] = {
                "session_date": None,
                "location": None,
                "exercise": None,
                "equipment": None,
                "primary_muscle": None,
                "secondary_muscle": None,
                "top_set": None
            }

    db.close()
    return {"last_workout_by_muscle": result}