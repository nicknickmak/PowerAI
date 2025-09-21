from fastapi import FastAPI

from app import endpoints
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# Allow requests from localhost:3000 (React dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://power-ai-chi.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(endpoints.router)

@app.get("/")
def read_root():
    return {"message": "Lifting Analytics API is running."}