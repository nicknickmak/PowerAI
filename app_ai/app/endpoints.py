
from pydantic import BaseModel
from typing import List, Optional, Any
from fastapi import HTTPException, APIRouter
import app.ai as ai


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
    date: str

class QueryResponse(BaseModel):
    result: Any

class ExerciseSet(BaseModel):
    reps: Optional[int]
    weight: Optional[float]

class ExerciseInput(BaseModel):
    name: str
    sets: List[ExerciseSet]

@router.get("/embed")
def embed(text: str):
    embedding = ai.embed_text(text)
    return {"embedding": embedding.tolist()}

@router.get("/retrieve")
def retrieve(query: str, top_k: int = 5):
    results = ai.embedding_retriever(query, top_k)
    return {"results": results}

@router.post("/normalize")
def normalize(raw_input: str):
    result = ai.hybrid_normalize_exercise(raw_input)
    return result

@router.post("/query", response_model=QueryResponse)
def query_endpoint(request: QueryRequest):
    try:
        location = "Unknown"  # Replace with actual location if available in request
        result = ai.process_query(request.query, request.date, location=location)
        return QueryResponse(result=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
