import re
import os
import numpy as np
import faiss
from sklearn.feature_extraction.text import TfidfVectorizer
from typing import Dict, Any

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
    # Quads
    "squat": ("Quads", "Glutes", "Barbell", ["squat", "back squat", "front squat", "sqaut", "squats", "barbell squat", "bb squat", "bodyweight squat", "goblet squat", "hack squat", "smith machine squat", "overhead squat"]),
    "front squat": ("Quads", "Glutes", "Barbell", ["front squat", "barbell front squat", "bb front squat"]),
    "zercher squat": ("Quads", "Glutes", "Barbell", ["zercher squat", "barbell zercher squat"]),
    "sumo squat": ("Quads", "Glutes", "Barbell", ["sumo squat", "sumo bb squat", "sumo barbell squat"]),
    "split squat": ("Quads", "Glutes", "Barbell", ["split squat", "bulgarian split squat", "rear foot elevated split squat", "rfess"]),
    "hack squat": ("Quads", "Glutes", "Machine", ["hack squat", "machine hack squat"]),
    "leg press": ("Quads", "Glutes", "Machine", ["leg press", "machine leg press", "sled press"]),
    "step up": ("Quads", "Glutes", "Dumbbell", ["step up", "step ups", "db step up", "dumbbell step up", "barbell step up"]),
    "smith machine squat": ("Quads", "Glutes", "Smith Machine", ["smith machine squat", "smith squat"]),
    "machine leg press": ("Quads", "Glutes", "Machine", ["machine leg press", "leg press machine"]),
    # Hamstrings
    "romanian deadlift": ("Hamstrings", "Glutes", "Barbell", ["romanian deadlift", "rdl", "barbell rdl", "bb rdl", "db rdl", "dumbbell rdl"]),
    "stiff leg deadlift": ("Hamstrings", "Glutes", "Barbell", ["stiff leg deadlift", "stiff-legged deadlift", "barbell stiff leg deadlift"]),
    "leg curl": ("Hamstrings", None, "Machine", ["leg curl", "hamstring curl", "machine leg curl"]),
    "machine leg curl": ("Hamstrings", None, "Machine", ["machine leg curl", "leg curl machine"]),
    # Glutes
    "hip thrust": ("Glutes", "Hamstrings", "Barbell", ["hip thrust", "barbell hip thrust", "bb hip thrust", "glute bridge", "db hip thrust", "dumbbell hip thrust"]),
    "glute bridge": ("Glutes", "Hamstrings", "Barbell", ["glute bridge", "barbell glute bridge", "bb glute bridge", "db glute bridge", "dumbbell glute bridge"]),
    "reverse hyperextension": ("Glutes", "Hamstrings", "Machine", ["reverse hyperextension", "reverse hyper", "hyperextension"]),
    "donkey kick": ("Glutes", "Hamstrings", "Bodyweight", ["donkey kick", "glute kickback"]),
    "fire hydrant": ("Glutes", "Hip Abductors", "Bodyweight", ["fire hydrant", "hip abduction"]),
    # Calves
    "calf raise": ("Calves", None, "Machine", ["calf raise", "calf raises", "standing calf raise", "seated calf raise", "machine calf raise"]),
    "machine calf raise": ("Calves", None, "Machine", ["machine calf raise", "calf raise machine"]),
    # Adductors/Abductors
    "thigh abductor": ("Hip Abductors", None, "Machine", ["thigh abductor", "hip abductor", "abductor machine"]),
    "thigh adductor": ("Hip Adductors", None, "Machine", ["thigh adductor", "hip adductor", "adductor machine"]),
    "hip abduction": ("Hip Abductors", None, "Machine", ["hip abduction", "abductor", "abductor machine"]),
    "hip adduction": ("Hip Adductors", None, "Machine", ["hip adduction", "adductor", "adductor machine"]),
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

EQUIPMENT_TYPES = [
    "Barbell", 
    "Dumbbell", 
    "Bodyweight", 
    "Machine", 
    "Cable", 
    "Smith Machine", 
    "Ab Wheel", 
    "Kettlebell", 
    "yoga ball", 
    "medicine ball", 
    "resistance band"
]

EXERCISE_NAMES = list(EXERCISE_DICT.keys())
# Use TF-IDF for simple embedding
_vectorizer = TfidfVectorizer().fit(EXERCISE_NAMES)
EXERCISE_EMBEDDINGS = _vectorizer.transform(EXERCISE_NAMES).toarray().astype('float32')
FAISS_INDEX = faiss.IndexFlatL2(EXERCISE_EMBEDDINGS.shape[1])
FAISS_INDEX.add(EXERCISE_EMBEDDINGS)

def embed_text(text: str) -> np.ndarray:
    """
    Convert text to embedding using the same vectorizer as for EXERCISE_EMBEDDINGS.
    """
    # Clean input: lowercase, strip, collapse spaces
    clean_text = re.sub(r'\s+', ' ', text.strip().lower())
    embedding = _vectorizer.transform([clean_text]).toarray()[0]
    return np.array(embedding, dtype='float32')

def embedding_retriever(query: str, top_k: int = 5) -> list:
    """
    Retrieve top_k similar exercise names using embeddings and FAISS.
    """
    query_vec = embed_text(query)
    D, I = FAISS_INDEX.search(np.array([query_vec]), top_k)
    return [EXERCISE_NAMES[i] for i in I[0]]


def llm_selector(candidates: list, original_exercise: str) -> Dict[str, Any]:
    """
    Use LLM to select the most relevant exercise from candidates or create a new one.
    candidates: List of dicts with keys: name, primary_muscle, secondary_muscle, equipment
    original_exercise: The raw input exercise name
    Returns a dict with keys: canonical_exercise, primary_muscle, secondary_muscle, equipment
    """
    try:
        import openai
        openai.api_key = os.getenv("OPENAI_API_KEY")
        import json

        # Step 1: Filter by equipment if present in original_exercise
        equipment_in_original = None
        for eq in EQUIPMENT_TYPES:
            if eq.lower() in original_exercise.lower():
                equipment_in_original = eq
                break
        filtered_candidates = candidates
        if equipment_in_original:
            filtered_candidates = [c for c in candidates if c.get("equipment") and c["equipment"].lower() == equipment_in_original.lower()]
            if not filtered_candidates:
                filtered_candidates = candidates  # fallback to all if none match

        # Step 2: Rank candidates by relevance using LLM (only select from given candidates)
        candidate_names = [c["name"] for c in filtered_candidates]
        ranking_prompt = (
            f"Given the original exercise '{original_exercise}', rank the following candidate names by relevance: {json.dumps(candidate_names)}. "
            "Return only the indices of the candidates sorted by relevance, as a JSON list. For example: [2, 0, 1] if candidate_names[2] is most relevant. "
        )
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": ranking_prompt}],
            max_tokens=50,
            temperature=0.2
        )
        content = response.choices[0].message.content
        result = json.loads(content)

        # Rearrange filtered_candidates in the order given by result (indices)
        if isinstance(result, list) and all(isinstance(i, int) for i in result):
            filtered_candidates = [filtered_candidates[i] for i in result if i < len(filtered_candidates)]

        # Step 3: Check if the candidate is relevant enough, else add original exercise (LLM can format new if needed)
        selected_candidate = filtered_candidates[0] if filtered_candidates else None
        relevance_prompt = (
            f"Given the original exercise '{original_exercise}' and the selected candidate {json.dumps(selected_candidate)}, "
            "is the candidate relevant enough? If not, return a JSON object for the original exercise formatted as: "
            "{'canonical_exercise': ..., 'primary_muscle': ..., 'secondary_muscle': ..., 'equipment': ...}. "
            "Otherwise, return the candidate as is. "
        )
        response2 = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": relevance_prompt}],
            max_tokens=50,
            temperature=0.2
        )
        final_content = response2.choices[0].message.content
        # Fix for single quotes in LLM output
        if final_content.strip().startswith("{"):
            final_content = final_content.replace("'", '"')
        final_result = json.loads(final_content)
        return {
            "canonical_exercise": final_result.get("canonical_exercise"),
            "primary_muscle": final_result.get("primary_muscle"),
            "secondary_muscle": final_result.get("secondary_muscle"),
            "equipment": final_result.get("equipment")
        }
    except Exception as e:
        raise RuntimeError(f"LLM selection failed: {e}")

def hybrid_normalize_exercise(raw_input: str) -> Dict[str, Any]:
    """
    Hybrid exercise normalization using dictionary lookup, embedding retrieval, and LLM selection.
    raw_input: The raw input exercise name
    Returns a dict with keys: canonical_exercise, primary_muscle, secondary_muscle, equipment
    """
    # Step 1: Dictionary lookup
    # Ensure exercise_normalizer is defined before use
    if 'exercise_normalizer' not in globals():
        def exercise_normalizer(name: str):
            for canonical, (primary, secondary, equipment, aliases) in EXERCISE_DICT.items():
                if name.lower() == canonical:
                    return canonical, primary, secondary, equipment
                if name.lower() in [a.lower() for a in aliases]:
                    return canonical, primary, secondary, equipment
            return None, None, None, None
    canonical, primary, secondary, equipment = exercise_normalizer(raw_input)

    # Step 2: If found in dictionary, return immediately.
    if canonical:
        return {
            "canonical_exercise": canonical,
            "primary_muscle": primary,
            "secondary_muscle": secondary,
            "equipment": equipment
        }
    
    # Step 3: If not found in dictionary, use embedding + LLM fallback
    candidates = embedding_retriever(raw_input)
    candidate_details = []
    for c in candidates:
        c_lower = c.lower()
        details = EXERCISE_DICT.get(c_lower)
        if details:
            candidate_details.append({
                "name": c_lower,
                "primary_muscle": details[0],
                "secondary_muscle": details[1],
                "equipment": details[2]
            })
        else:
            candidate_details.append({
                "name": c_lower,
                "primary_muscle": None,
                "secondary_muscle": None,
                "equipment": None
            })
    llm_result = llm_selector(candidate_details, raw_input)

    canonical_exercise = llm_result["canonical_exercise"].lower() if llm_result["canonical_exercise"] else None
    primary_muscle = llm_result["primary_muscle"].lower() if llm_result["primary_muscle"] else None
    secondary_muscle = llm_result["secondary_muscle"].lower() if llm_result["secondary_muscle"] else None
    equipment = llm_result["equipment"].lower() if llm_result["equipment"] else None
    return {
        "canonical_exercise": canonical_exercise,
        "primary_muscle": primary_muscle,
        "secondary_muscle": secondary_muscle,
        "equipment": equipment
    }

def summarize_stats(stats):
    """Stub for AI-powered natural language recap."""
    # TODO: Integrate with LLM
    return "Summary goes here."

def process_query(query: list, session_date: str, location=None):
    """
    Process a user query containing exercises with sets, normalize exercises, and compute analytics.
    """
    from datetime import date, datetime
    if isinstance(session_date, str):
        session_date_clean = session_date.strip()
        try:
            session_date_obj = datetime.strptime(session_date_clean, "%Y-%m-%d").date()
        except ValueError:
            # Try parsing ISO 8601 with time
            session_date_obj = datetime.fromisoformat(session_date_clean.replace("Z", "")).date()
    else:
        session_date_obj = session_date
    if session_date_obj > date.today():
        raise ValueError("Session date cannot be in the future.")
    
    processed_exercises = []
    for exercise in query:
        norm_result = hybrid_normalize_exercise(exercise.name)
        norm_name = norm_result.get("canonical_exercise")
        primary_muscle = norm_result.get("primary_muscle")
        secondary_muscle = norm_result.get("secondary_muscle")
        equipment = norm_result.get("equipment")
        total_sets = len(exercise.sets)
        total_reps = sum(s.reps or 0 for s in exercise.sets if s.reps is not None)
        max_weight = max((s.weight or 0) for s in exercise.sets if s.weight is not None)
        total_volume = sum((s.weight or 0) * (s.reps or 0) for s in exercise.sets if s.weight is not None and s.reps is not None)
        processed_exercises.append({
            "name": norm_name,
            "date": session_date,
            "location": location,
            "primary_muscle": primary_muscle,
            "secondary_muscle": secondary_muscle,
            "equipment": equipment,
            "total_sets": total_sets,
            "total_reps": total_reps,
            "max_weight": max_weight,
            "total_volume": total_volume,
            "sets": exercise.sets
        })
    return processed_exercises

def submit_workout(processed_exercises: list):
    """Ingest workout, process analytics, and return summary."""
    from app.services.ingestion import ingest_workout
    ingest_workout(processed_exercises)
