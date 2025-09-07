from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import endpoints

app = FastAPI()

# Allow requests from localhost:3001 (React dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(endpoints.router)

@app.get("/")
def read_root():
    return {"message": "Lifting Analytics API is running."}
