# MeetScribe Backend

FastAPI backend service for MeetScribe (Meeting Notes & Transcription Platform).

## Architecture

- **Framework**: FastAPI
- **ORM & Database**: SQLAlchemy with SQLite (`meetscribe.db`)
- **Validation**: Pydantic v2
- **Structure**:
  - `app/main.py`: Application entrypoint and middleware configuration.
  - `app/database.py`: Database engine, SessionLocal, and declarative base.
  - `app/models/`: SQLAlchemy ORM database models.
  - `app/schemas/`: Pydantic request & response schemas.
  - `app/routers/`: Modular API route handlers.
  - `app/services/`: Business logic, transcription, AI processing.
  - `app/seed.py`: Database seeding utility.

## Getting Started

### 1. Setup Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Development Server
```bash
uvicorn app.main:app --reload --port 8000
```

### 4. Health Check
Navigate to [http://localhost:8000/health](http://localhost:8000/health) or check the OpenAPI docs at [http://localhost:8000/docs](http://localhost:8000/docs).
