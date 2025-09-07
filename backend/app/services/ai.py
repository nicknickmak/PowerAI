import re
import difflib

# AI service: exercise normalization, summarization, query translation

def exercise_normalizer(name: str):
    """Advanced normalization: fuzzy matching, punctuation removal, and synonym mapping. Returns canonical name, primary muscle, and secondary muscle."""
    synonyms = {
        # Chest
        "bench press": ("Chest", None, ["bench", "benchpress", "bench press", "bnch prs", "bench prs", "barbell bench press", "bb bench", "flat bench"]),
        "incline bench press": ("Chest", None, ["incline bench", "incline bench press", "incline", "incline bnch prs", "incline bb bench", "incline barbell bench"]),
        "decline bench press": ("Chest", None, ["decline bench", "decline bench press", "decline bb bench", "decline barbell bench"]),
        "chest fly": ("Chest", None, ["fly", "chest fly", "pec fly", "dumbbell fly", "db fly", "machine fly"]),
        "push up": ("Chest", "Triceps", ["push up", "pushup", "push-ups", "pushups"]),
        "chest dip": ("Chest", "Triceps", ["chest dip", "dip", "dips", "tricep dip", "bench dip", "parallel bar dip"]),
        "machine chest press": ("Chest", None, ["machine chest press", "chest press machine"]),
        "pec deck": ("Chest", None, ["pec deck", "machine fly", "pec deck fly"]),
        "smith machine bench press": ("Chest", None, ["smith machine bench press", "smith bench", "smith press"]),
        # Back
        "deadlift": ("Back", "Hamstrings", ["deadlift", "dl", "dead lift", "dedlift", "barbell deadlift", "bb deadlift", "conventional deadlift", "sumo deadlift", "romanian deadlift", "rdl", "stiff leg deadlift"]),
        "barbell row": ("Back", "Biceps", ["barbell row", "bb row", "bent over row", "bent-over row", "pendlay row", "t-bar row"]),
        "dumbbell row": ("Back", "Biceps", ["dumbbell row", "db row", "one arm row", "single arm row", "kroc row"]),
        "seated cable row": ("Back", "Biceps", ["seated cable row", "cable row", "machine row", "row machine"]),
        "lat pulldown": ("Back", "Biceps", ["lat pulldown", "pulldown", "lat pull down", "machine pulldown", "wide grip pulldown", "close grip pulldown"]),
        "pull up": ("Back", "Biceps", ["pull up", "pullup", "pull-ups", "pullups", "chin up", "chinup", "chin-ups", "chinups", "assisted pull up", "weighted pull up"]),
        "face pull": ("Back", "Shoulders", ["face pull", "cable face pull"]),
        "pull over": ("Back", None, ["pull over", "pullover", "db pullover", "dumbbell pullover", "machine pullover"]),
        "reverse hyperextension": ("Back", "Glutes", ["reverse hyperextension", "reverse hyper", "hyperextension"]),
        "single leg deadlift": ("Back", "Hamstrings", ["single leg deadlift", "single leg rdl", "one leg deadlift"]),
        "machine row": ("Back", "Biceps", ["machine row", "row machine"]),
        # Shoulders
        "shoulder press": ("Shoulders", "Triceps", ["shoulder press", "overhead press", "military press", "bb shoulder press", "db shoulder press", "dumbbell shoulder press", "arnold press", "machine shoulder press"]),
        "lateral raise": ("Shoulders", None, ["lateral raise", "side raise", "db lateral raise", "dumbbell lateral raise", "machine lateral raise"]),
        "front raise": ("Shoulders", None, ["front raise", "db front raise", "dumbbell front raise"]),
        "rear delt fly": ("Shoulders", None, ["rear delt fly", "reverse fly", "rear delt raise", "db rear delt fly", "dumbbell rear delt fly"]),
        "upright row": ("Shoulders", "Traps", ["upright row", "barbell upright row", "db upright row", "dumbbell upright row"]),
        "smith machine shoulder press": ("Shoulders", "Triceps", ["smith machine shoulder press", "smith shoulder press"]),
        "machine shoulder press": ("Shoulders", "Triceps", ["machine shoulder press", "shoulder press machine"]),
        "cable lateral raise": ("Shoulders", None, ["cable lateral raise", "cable side raise"]),
        # Arms - Triceps
        "tricep pushdown": ("Arms", None, ["tricep pushdown", "triceps pushdown", "cable pushdown", "rope pushdown", "straight bar pushdown"]),
        "tricep extension": ("Arms", None, ["tricep extension", "triceps extension", "overhead tricep extension", "skullcrusher", "skull crusher", "lying tricep extension", "db tricep extension", "dumbbell tricep extension"]),
        "cable tricep extension": ("Arms", None, ["cable tricep extension", "cable overhead tricep extension"]),
        "cable kickback": ("Arms", None, ["cable kickback", "tricep kickback", "db kickback", "dumbbell kickback"]),
        "machine tricep extension": ("Arms", None, ["machine tricep extension", "tricep extension machine"]),
        # Arms - Biceps
        "bicep curl": ("Arms", None, ["bicep curl", "biceps curl", "barbell curl", "bb curl", "db curl", "dumbbell curl", "hammer curl", "preacher curl", "machine curl", "ez bar curl"]),
        "cable curl": ("Arms", None, ["cable curl", "cable bicep curl"]),
        "preacher curl": ("Arms", None, ["preacher curl", "machine preacher curl"]),
        "machine bicep curl": ("Arms", None, ["machine bicep curl", "bicep curl machine"]),
        "reverse curl": ("Arms", None, ["reverse curl", "barbell reverse curl", "db reverse curl", "dumbbell reverse curl"]),
        "wrist curl": ("Arms", None, ["wrist curl", "reverse wrist curl", "barbell wrist curl", "db wrist curl", "dumbbell wrist curl"]),
        # Legs - Quads
        "squat": ("Legs", "Glutes", ["squat", "back squat", "front squat", "sqaut", "squats", "barbell squat", "bb squat", "bodyweight squat", "goblet squat", "hack squat", "smith machine squat", "overhead squat"]),
        "front squat": ("Legs", None, ["front squat", "barbell front squat", "bb front squat"]),
        "zercher squat": ("Legs", None, ["zercher squat", "barbell zercher squat"]),
        "sumo squat": ("Legs", None, ["sumo squat", "sumo bb squat", "sumo barbell squat"]),
        "split squat": ("Legs", None, ["split squat", "bulgarian split squat", "rear foot elevated split squat", "rfess"]),
        "hack squat": ("Legs", None, ["hack squat", "machine hack squat"]),
        "leg press": ("Legs", None, ["leg press", "machine leg press", "sled press"]),
        "step up": ("Legs", None, ["step up", "step ups", "db step up", "dumbbell step up", "barbell step up"]),
        "smith machine squat": ("Legs", None, ["smith machine squat", "smith squat"]),
        "machine leg press": ("Legs", None, ["machine leg press", "leg press machine"]),
        # Legs - Hamstrings
        "romanian deadlift": ("Legs", None, ["romanian deadlift", "rdl", "barbell rdl", "bb rdl", "db rdl", "dumbbell rdl"]),
        "stiff leg deadlift": ("Legs", None, ["stiff leg deadlift", "stiff-legged deadlift", "barbell stiff leg deadlift"]),
        "leg curl": ("Legs", None, ["leg curl", "hamstring curl", "machine leg curl"]),
        "machine leg curl": ("Legs", None, ["machine leg curl", "leg curl machine"]),
        # Legs - Glutes
        "hip thrust": ("Legs", None, ["hip thrust", "barbell hip thrust", "bb hip thrust", "glute bridge", "db hip thrust", "dumbbell hip thrust"]),
        "glute bridge": ("Legs", None, ["glute bridge", "barbell glute bridge", "bb glute bridge", "db glute bridge", "dumbbell glute bridge"]),
        "reverse hyperextension": ("Legs", None, ["reverse hyperextension", "reverse hyper", "hyperextension"]),
        "donkey kick": ("Legs", None, ["donkey kick", "glute kickback"]),
        "fire hydrant": ("Legs", None, ["fire hydrant", "hip abduction"]),
        # Legs - Calves
        "calf raise": ("Legs", None, ["calf raise", "calf raises", "standing calf raise", "seated calf raise", "machine calf raise"]),
        "machine calf raise": ("Legs", None, ["machine calf raise", "calf raise machine"]),
        # Legs - Adductors/Abductors
        "thigh abductor": ("Legs", None, ["thigh abductor", "hip abductor", "abductor machine"]),
        "thigh adductor": ("Legs", None, ["thigh adductor", "hip adductor", "adductor machine"]),
        "hip abduction": ("Legs", None, ["hip abduction", "abductor", "abductor machine"]),
        "hip adduction": ("Legs", None, ["hip adduction", "adductor", "adductor machine"]),
        # Core
        "plank": ("Core", None, ["plank", "front plank", "elbow plank"]),
        "side plank": ("Core", None, ["side plank", "side planks"]),
        "crunch": ("Core", None, ["crunch", "crunches", "ab crunch", "machine crunch", "cable crunch"]),
        "sit up": ("Core", None, ["sit up", "situp", "sit-ups", "situps"]),
        "leg raise": ("Core", None, ["leg raise", "leg raises", "hanging leg raise", "lying leg raise"]),
        "hanging knee raise": ("Core", None, ["hanging knee raise", "knee raise"]),
        "russian twist": ("Core", None, ["russian twist", "twist", "db russian twist", "dumbbell russian twist"]),
        "ab wheel rollout": ("Core", None, ["ab wheel rollout", "wheel rollout", "ab rollout"]),
        "mountain climber": ("Core", None, ["mountain climber", "mountain climbers"]),
        "hollow hold": ("Core", None, ["hollow hold", "hollow body hold"]),
        "superman": ("Core", None, ["superman", "supermans"]),
        "bird dog": ("Core", None, ["bird dog", "birddog"]),
        "cable crunch": ("Core", None, ["cable crunch", "rope crunch"]),
        # Explosive/Power
        "box jump": ("Explosive/Power", None, ["box jump", "box jumps"]),
        "medicine ball slam": ("Explosive/Power", None, ["medicine ball slam", "med ball slam", "ball slam"]),
        "sled push": ("Explosive/Power", None, ["sled push", "prowler push"]),
        "sled pull": ("Explosive/Power", None, ["sled pull", "prowler pull"]),
        "power clean": ("Explosive/Power", None, ["power clean", "clean", "barbell clean"]),
        "clean and jerk": ("Explosive/Power", None, ["clean and jerk", "c&j", "barbell clean and jerk"]),
        "snatch": ("Explosive/Power", None, ["snatch", "barbell snatch"]),
        "hang clean": ("Explosive/Power", None, ["hang clean", "barbell hang clean"]),
        "hang snatch": ("Explosive/Power", None, ["hang snatch", "barbell hang snatch"]),
        "jerk": ("Explosive/Power", None, ["jerk", "barbell jerk"]),
        "push press": ("Explosive/Power", None, ["push press", "barbell push press"]),
        "muscle up": ("Explosive/Power", None, ["muscle up", "muscle-up", "ring muscle up", "bar muscle up"]),
        # Forearms/Grip
        "farmer's walk": ("Forearms/Grip", None, ["farmer's walk", "farmers walk", "farmer walk", "db farmer's walk", "dumbbell farmer's walk"]),
        "shrug": ("Forearms/Grip", None, ["shrug", "barbell shrug", "bb shrug", "db shrug", "dumbbell shrug"]),
        # Misc/Other
        "pull down": ("Back", "Biceps", ["pull down", "pulldown", "lat pulldown"]),
        # Add more as needed
    }
    name_clean = re.sub(r'[^a-zA-Z0-9 ]', '', name).strip().lower()
    for canonical, (primary, secondary, variants) in synonyms.items():
        match = difflib.get_close_matches(name_clean, variants, n=1, cutoff=0.8)
        if match:
            return canonical, primary, secondary
    return name_clean, None, None

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
        norm_name, primary_muscle, secondary_muscle = exercise_normalizer(exercise.name)
        total_sets = len(exercise.sets)
        total_reps = sum(s.reps or 0 for s in exercise.sets if s.reps is not None)
        max_weight = max((s.weight or 0) for s in exercise.sets if s.weight is not None)
        total_volume = sum((s.weight or 0) * (s.reps or 0) for s in exercise.sets if s.weight is not None and s.reps is not None)
        summaries.append(f"{norm_name}: {total_sets} sets, {total_reps} reps, {max_weight} max weight, {total_volume} total volume")
        norm_exercises.append({
            "name": norm_name,
            "primary_muscle": primary_muscle,
            "secondary_muscle": secondary_muscle,
            "sets": exercise.sets
        })
    if session_date and location:
        ingest_workout(session_date, location, norm_exercises)
    summary = " | ".join(summaries)
    return summary
