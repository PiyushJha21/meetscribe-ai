# MeetScribe Backend

FastAPI backend service for MeetScribe (Meeting Notes & Transcription Platform).

## Architecture

- **Framework**: FastAPI
- **ORM & Database**: SQLAlchemy 2.0 with SQLite (`meetscribe.db`)
- **Validation**: Pydantic v2
- **Structure**:
  - `app/main.py`: Application entrypoint, CORS, startup lifespan, and auto-seeding.
  - `app/database.py`: SQLite engine with configurable `SQLITE_DB_PATH` for persistent disk mounts.
  - `app/models/`: SQLAlchemy ORM database models.
  - `app/schemas/`: Pydantic request & response schemas.
  - `app/routers/`: Modular API route handlers (`/api/meetings`, `/api/users`, `/api/action-items`).
  - `app/services/`: AI intelligence extraction, summary generation, transcript parsing.
  - `app/seed.py`: Idempotent database seeding utility.

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

### 4. Production Deployment with Persistent Storage

For production environments (Render Disks, Fly.io Volumes, Railway, Docker Volumes):

1. Attach a persistent disk mount to your service (e.g. at `/data` or `/var/data`).
2. Set the environment variable:
   ```bash
   SQLITE_DB_PATH=/data/meetscribe.db
   ```
   *(If not set, it defaults to `./meetscribe.db` in the backend directory).*
3. (Optional) Set `FRONTEND_URL` to your Vercel frontend URL:
   ```bash
   FRONTEND_URL=https://your-app.vercel.app
   ```
4. On startup, FastAPI's `lifespan` automatically executes `Base.metadata.create_all(bind=engine)` and verifies/seeds default users and initial sample meetings if the database is fresh. All meeting records, transcripts, summaries, and action items will persist permanently across restarts.

### 5. Health Check & Swagger UI
- Health: [http://localhost:8000/health](http://localhost:8000/health)
- Interactive Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
