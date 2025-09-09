# Ingestion service: CSV/JSON parsing, exercise normalization

def parse_workout_log(file_path: str):
    """Parse CSV/JSON workout log and return structured data."""
    # TODO: Implement parsing logic
    pass

def normalize_exercise_name(name: str):
    """Stub for LLM-powered exercise name normalization."""
    # TODO: Integrate with AI service
    return name

def ingest_workout(session_date, location, exercises):
    """Ingest a workout with date, location, and normalized exercises."""
    from app.db import SessionLocal
    from app.models import WorkoutSession, Exercise, Set
    db = SessionLocal()
    session = WorkoutSession(date=session_date, location=location)
    db.add(session)
    db.commit()
    db.refresh(session)
    for ex in exercises:
        exercise = db.query(Exercise).filter_by(name=ex["name"]).first()
        if not exercise:
            exercise = Exercise(
                name=ex["name"],
                equipment=ex.get("equipment"),
                primary_muscle=ex.get("primary_muscle"),
                secondary_muscle=ex.get("secondary_muscle"),
                
            )
            db.add(exercise)
            db.commit()
            db.refresh(exercise)
        for s in ex["sets"]:
            set_obj = Set(
                exercise_id=exercise.id,
                session_id=session.id,
                reps=s["reps"],
                weight=s["weight"],
                rpe=getattr(s, "rpe", None),
                timestamp=session_date
            )
            db.add(set_obj)
    db.commit()
    db.close()
