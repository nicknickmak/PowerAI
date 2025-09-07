# Lifting Analytics App Backend

This backend powers PowerAI, a lifting analytics app. It is built with FastAPI, SQLAlchemy (Postgres), Pydantic schemas, and includes modular services for ingestion, analytics, and AI.

## Features

- Workout log ingestion (CSV/JSON, API)
- Exercise normalization (AI-powered)
- Analytics: PRs, volume, trends, weekly summaries
- AI-powered summaries and query translation
- RESTful API endpoints for frontend integration
- Alembic migrations for database schema management

## Project Structure

- `app/` - FastAPI app code
  - `api/` - API endpoints
  - `models.py` - SQLAlchemy models
  - `schemas.py` - Pydantic schemas
  - `services/` - Ingestion, analytics, and AI logic
  - `db.py` - Database session and engine
- `alembic/` - Database migrations
- `requirements.txt` - Python dependencies
- `.github/copilot-instructions.md` - Copilot custom instructions

## Setup Instructions

1. Create and activate a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure Postgres connection in `app/db.py` or via environment variable `DATABASE_URL`.
4. Run Alembic migrations:
   ```bash
   alembic upgrade head
   ```
5. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

## API Endpoints

- `/exercises` - List exercises with muscle groups, last session, and sets
- `/exercises/{id}/prs` - Get personal records for an exercise
- `/exercises/{id}/last` - Get last session for an exercise
- `/summary/weekly` - Get weekly workout summary
- `/query` - Ingest and analyze a workout (AI-powered)

## Development Notes

- All backend code is in the `app/` folder for modularity
- Alembic is used for all schema changes
- See `alembic/README` for migration instructions
- Frontend integration is via REST API (see `/exercises` endpoint for example)

## Next Steps

- Expand ingestion and analytics services
- Add more AI-powered features
- Build out frontend and connect to backend
