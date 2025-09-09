# Ingestion service: CSV/JSON parsing, exercise normalization

def parse_workout_log(file_path: str):
    """Parse CSV/JSON workout log and return structured data."""
    # TODO: Implement parsing logic
    pass

def normalize_exercise_name(name: str):
    """Stub for LLM-powered exercise name normalization."""
    # TODO: Integrate with AI service
    return name

def ingest_workout(exercises):
    """Ingest a workout with date, location, and normalized exercises."""
    from app.db import SessionLocal
    from app.models import WorkoutSession, Exercise, Set
    db = SessionLocal()
    # Extract date and location from the first exercise, fallback to None if missing
    date = exercises[0].get("date") if exercises and "date" in exercises[0] else None
    location = exercises[0].get("location") if exercises and "location" in exercises[0] else None
    session = WorkoutSession(date=date, location=location)
    db.add(session)
    db.commit()
    db.refresh(session)
    for ex in exercises:
        # Lowercase all string fields in ex
        lowered_ex = {}
        for k, v in ex.items():
            if isinstance(v, str):
                lowered_ex[k] = v.lower()
            elif isinstance(v, list):
                # Lowercase strings in sets
                lowered_ex[k] = [
                    {sk: (sv.lower() if isinstance(sv, str) else sv) for sk, sv in s.items()} for s in v
                ]
            else:
                lowered_ex[k] = v
        exercise = db.query(Exercise).filter_by(name=lowered_ex["name"]).first()
        if not exercise:
            exercise = Exercise(
                name=lowered_ex["name"],
                equipment=lowered_ex.get("equipment"),
                primary_muscle=lowered_ex.get("primary_muscle"),
                secondary_muscle=lowered_ex.get("secondary_muscle"),
            )
            db.add(exercise)
            db.commit()
            db.refresh(exercise)
        for s in lowered_ex["sets"]:
            set_obj = Set(
                exercise_id=exercise.id,
                session_id=session.id,
                reps=s["reps"],
                weight=s["weight"],
                rpe=s.get("rpe", None),
            )
            db.add(set_obj)
    db.commit()
    db.close()
