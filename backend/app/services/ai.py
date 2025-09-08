import re
import difflib
EXERCISE_DICT = {
    # Chest
    "bench press": ("Chest", None, "Barbell", ["bench press", "bench", "bb bench press", "barbell bench press"]),
    "dumbbell bench press": ("Chest", None, "Dumbbell", ["dumbbell bench press", "db bench press", "dumbbell bench", "db bench"]),
    "incline bench press": ("Chest", None, "Barbell", ["incline bench", "incline bench press", "incline", "incline bnch prs", "incline bb bench", "incline barbell bench"]),
    "decline bench press": ("Chest", None, "Barbell", ["decline bench", "decline bench press", "decline bb bench", "decline barbell bench"]),
    "chest fly": ("Chest", None, "Dumbbell", ["fly", "chest fly", "pec fly", "dumbbell fly", "db fly", "machine fly"]),
    "push up": ("Chest", "Triceps", "Bodyweight", ["push up", "pushup", "push-ups", "pushups"]),
    "chest dip": ("Chest", "Triceps", "Bodyweight", ["chest dip", "dip", "dips", "tricep dip", "bench dip", "parallel bar dip"]),
    "machine chest press": ("Chest", None, "Machine", ["machine chest press", "chest press machine"]),
    "pec deck": ("Chest", None, "Machine", ["pec deck", "machine fly", "pec deck fly"]),
    "smith machine bench press": ("Chest", None, "Smith Machine", ["smith machine bench press", "smith bench", "smith press"]),
    # Back
    "deadlift": ("Back", "Hamstrings", "Barbell", ["deadlift", "dl", "dead lift", "dedlift", "barbell deadlift", "bb deadlift", "conventional deadlift", "sumo deadlift", "romanian deadlift", "rdl", "stiff leg deadlift"]),
    "barbell row": ("Back", "Biceps", "Barbell", ["barbell row", "bb row", "bent over row", "bent-over row", "pendlay row", "t-bar row"]),
    "dumbbell row": ("Back", "Biceps", "Dumbbell", ["dumbbell row", "db row", "one arm row", "single arm row", "kroc row"]),
    "seated cable row": ("Back", "Biceps", "Cable", ["seated cable row", "cable row", "machine row", "row machine"]),
    "lat pulldown": ("Back", "Biceps", "Cable", ["lat pulldown", "pulldown", "lat pull down", "machine pulldown", "wide grip pulldown", "close grip pulldown"]),
    "pull up": ("Back", "Biceps", "Bodyweight", ["pull up", "pullup", "pull-ups", "pullups", "chin up", "chinup", "chin-ups", "chinups", "assisted pull up", "weighted pull up"]),
    "face pull": ("Back", "Shoulders", "Cable", ["face pull", "cable face pull"]),
    "pull over": ("Back", None, "Dumbbell", ["pull over", "pullover", "db pullover", "dumbbell pullover", "machine pullover"]),
    "reverse hyperextension": ("Back", "Glutes", "Machine", ["reverse hyperextension", "reverse hyper", "hyperextension"]),
    "single leg deadlift": ("Back", "Hamstrings", "Barbell", ["single leg deadlift", "single leg rdl", "one leg deadlift"]),
    "machine row": ("Back", "Biceps", "Machine", ["machine row", "row machine"]),
    # Shoulders
    "shoulder press": ("Shoulders", "Triceps", "Barbell", ["shoulder press", "overhead press", "military press", "bb shoulder press", "db shoulder press", "dumbbell shoulder press", "arnold press", "machine shoulder press"]),
    "lateral raise": ("Shoulders", None, "Dumbbell", ["lateral raise", "side raise", "db lateral raise", "dumbbell lateral raise", "machine lateral raise"]),
    "front raise": ("Shoulders", None, "Dumbbell", ["front raise", "db front raise", "dumbbell front raise"]),
    "rear delt fly": ("Shoulders", None, "Dumbbell", ["rear delt fly", "reverse fly", "rear delt raise", "db rear delt fly", "dumbbell rear delt fly"]),
    "upright row": ("Shoulders", "Traps", "Barbell", ["upright row", "barbell upright row", "db upright row", "dumbbell upright row"]),
    "smith machine shoulder press": ("Shoulders", "Triceps", "Smith Machine", ["smith machine shoulder press", "smith shoulder press"]),
    "machine shoulder press": ("Shoulders", "Triceps", "Machine", ["machine shoulder press", "shoulder press machine"]),
    "cable lateral raise": ("Shoulders", None, "Cable", ["cable lateral raise", "cable side raise"]),
    # Arms - Triceps
    "tricep pushdown": ("Triceps", None, "Cable", ["tricep pushdown", "triceps pushdown", "cable pushdown", "rope pushdown", "straight bar pushdown", ]),
    "tricep pulldown": ("Triceps", None, "Cable", ["tricep pulldown", "triceps pulldown", "cable pulldown", "rope pulldown", "straight bar pulldown"]),
    "tricep extension": ("Triceps", None, "Dumbbell", ["tricep extension", "triceps extension", "overhead tricep extension", "skullcrusher", "skull crusher", "lying tricep extension", "db tricep extension", "dumbbell tricep extension"]),
    "cable tricep extension": ("Triceps", None, "Cable", ["cable tricep extension", "cable overhead tricep extension"]),
    "cable kickback": ("Triceps", None, "Cable", ["cable kickback", "tricep kickback", "db kickback", "dumbbell kickback"]),
    "machine tricep extension": ("Triceps", None, "Machine", ["machine tricep extension", "tricep extension machine"]),
    # Arms - Biceps
    "bicep curl": ("Biceps", None, "Barbell", ["bicep curl", "biceps curl", "barbell curl", "bb curl", "db curl", "dumbbell curl", "hammer curl", "preacher curl", "machine curl", "ez bar curl"]),
    "cable curl": ("Biceps", None, "Cable", ["cable curl", "cable bicep curl"]),
    "preacher curl": ("Biceps", None, "Barbell", ["preacher curl", "machine preacher curl"]),
    "machine bicep curl": ("Biceps", None, "Machine", ["machine bicep curl", "bicep curl machine"]),
    "reverse curl": ("Biceps", None, "Barbell", ["reverse curl", "barbell reverse curl", "db reverse curl", "dumbbell reverse curl"]),
    "wrist curl": ("Forearms", None, "Barbell", ["wrist curl", "reverse wrist curl", "barbell wrist curl", "db wrist curl", "dumbbell wrist curl"]),
    # Legs - Quads
    "squat": ("Legs", "Glutes", "Barbell", ["squat", "back squat", "front squat", "sqaut", "squats", "barbell squat", "bb squat", "bodyweight squat", "goblet squat", "hack squat", "smith machine squat", "overhead squat"]),
    "front squat": ("Legs", None, "Barbell", ["front squat", "barbell front squat", "bb front squat"]),
    "zercher squat": ("Legs", None, "Barbell", ["zercher squat", "barbell zercher squat"]),
    "sumo squat": ("Legs", None, "Barbell", ["sumo squat", "sumo bb squat", "sumo barbell squat"]),
    "split squat": ("Legs", None, "Barbell", ["split squat", "bulgarian split squat", "rear foot elevated split squat", "rfess"]),
    "hack squat": ("Legs", None, "Machine", ["hack squat", "machine hack squat"]),
    "leg press": ("Legs", None, "Machine", ["leg press", "machine leg press", "sled press"]),
    "step up": ("Legs", None, "Dumbbell", ["step up", "step ups", "db step up", "dumbbell step up", "barbell step up"]),
    "smith machine squat": ("Legs", None, "Smith Machine", ["smith machine squat", "smith squat"]),
    "machine leg press": ("Legs", None, "Machine", ["machine leg press", "leg press machine"]),
    # Legs - Hamstrings
    "romanian deadlift": ("Legs", None, "Barbell", ["romanian deadlift", "rdl", "barbell rdl", "bb rdl", "db rdl", "dumbbell rdl"]),
    "stiff leg deadlift": ("Legs", None, "Barbell", ["stiff leg deadlift", "stiff-legged deadlift", "barbell stiff leg deadlift"]),
    "leg curl": ("Legs", None, "Machine", ["leg curl", "hamstring curl", "machine leg curl"]),
    "machine leg curl": ("Legs", None, "Machine", ["machine leg curl", "leg curl machine"]),
    # Legs - Glutes
    "hip thrust": ("Legs", None, "Barbell", ["hip thrust", "barbell hip thrust", "bb hip thrust", "glute bridge", "db hip thrust", "dumbbell hip thrust"]),
    "glute bridge": ("Legs", None, "Barbell", ["glute bridge", "barbell glute bridge", "bb glute bridge", "db glute bridge", "dumbbell glute bridge"]),
    "reverse hyperextension": ("Legs", None, "Machine", ["reverse hyperextension", "reverse hyper", "hyperextension"]),
    "donkey kick": ("Legs", None, "Bodyweight", ["donkey kick", "glute kickback"]),
    "fire hydrant": ("Legs", None, "Bodyweight", ["fire hydrant", "hip abduction"]),
    # Legs - Calves
    "calf raise": ("Legs", None, "Machine", ["calf raise", "calf raises", "standing calf raise", "seated calf raise", "machine calf raise"]),
    "machine calf raise": ("Legs", None, "Machine", ["machine calf raise", "calf raise machine"]),
    # Legs - Adductors/Abductors
    "thigh abductor": ("Legs", None, "Machine", ["thigh abductor", "hip abductor", "abductor machine"]),
    "thigh adductor": ("Legs", None, "Machine", ["thigh adductor", "hip adductor", "adductor machine"]),
    "hip abduction": ("Legs", None, "Machine", ["hip abduction", "abductor", "abductor machine"]),
    "hip adduction": ("Legs", None, "Machine", ["hip adduction", "adductor", "adductor machine"]),
    # Core
    "plank": ("Core", None, "Bodyweight", ["plank", "front plank", "elbow plank"]),
    "side plank": ("Core", None, "Bodyweight", ["side plank", "side planks"]),
    "crunch": ("Core", None, "Bodyweight", ["crunch", "crunches", "ab crunch", "machine crunch", "cable crunch"]),
    "sit up": ("Core", None, "Bodyweight", ["sit up", "situp", "sit-ups", "situps"]),
    "leg raise": ("Core", None, "Bodyweight", ["leg raise", "leg raises", "hanging leg raise", "lying leg raise"]),
    "hanging knee raise": ("Core", None, "Bodyweight", ["hanging knee raise", "knee raise"]),
    "russian twist": ("Core", None, "Dumbbell", ["russian twist", "twist", "db russian twist", "dumbbell russian twist"]),
    "ab wheel rollout": ("Core", None, "Ab Wheel", ["ab wheel rollout", "wheel rollout", "ab rollout"]),
    "mountain climber": ("Core", None, "Bodyweight", ["mountain climber", "mountain climbers"]),
    "hollow hold": ("Core", None, "Bodyweight", ["hollow hold", "hollow body hold"]),
    "superman": ("Core", None, "Bodyweight", ["superman", "supermans"]),
}

def summarize_stats(stats):
    """Stub for AI-powered natural language recap."""
    # TODO: Integrate with LLM
    return "Summary goes here."

def process_query(query: list, session_date=None, location=None):
    """Ingest workout, process analytics, and return summary."""
    from app.services.ingestion import ingest_workout
    summaries = []
    norm_exercises = []
    for exercise in query:
        norm_name, primary_muscle, secondary_muscle, equipment = exercise_normalizer(exercise.name)
        total_sets = len(exercise.sets)
        total_reps = sum(s.reps or 0 for s in exercise.sets if s.reps is not None)
        max_weight = max((s.weight or 0) for s in exercise.sets if s.weight is not None)
        total_volume = sum((s.weight or 0) * (s.reps or 0) for s in exercise.sets if s.weight is not None and s.reps is not None)
        summaries.append(f"{norm_name}: {total_sets} sets, {total_reps} reps, {max_weight} max weight, {total_volume} total volume")
        norm_exercises.append({
            "name": norm_name,
            "primary_muscle": primary_muscle,
            "secondary_muscle": secondary_muscle,
            "equipment": equipment,
            "sets": exercise.sets
        })
    if session_date and location:
        ingest_workout(session_date, location, norm_exercises)
    summary = " | ".join(summaries)
    return summary
