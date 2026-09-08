# MeetScribe Backend

FastAPI backend service for MeetScribe (Meeting Notes & Transcription Platform).

## Architecture

- **Framework**: FastAPI
- **ORM & Database**: SQLAlchemy 2.0 (PostgreSQL in Production / SQLite in Local Development)
- **Validation**: Pydantic v2
- **Structure**:
  - `app/main.py`: Application entrypoint, CORS, startup lifespan, and auto-seeding.
  - `app/database.py`: Database engine supporting `DATABASE_URL` (PostgreSQL / Neon / Render) and fallback SQLite (`meetscribe.db`).
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

### 4. Production Deployment (Render / PostgreSQL)

1. Provision a PostgreSQL instance on **Render** (or **Neon.tech** / **Supabase**).
2. Set the environment variable on your Render Web Service:
   ```bash
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   ```
3. (Optional) Set `FRONTEND_URL` to your Vercel deployment URL:
   ```bash
   FRONTEND_URL=https://your-app.vercel.app
   ```
4. On startup, FastAPI's `lifespan` automatically executes `Base.metadata.create_all(bind=engine)` to create all tables and seeds initial workspace users and sample meetings. All subsequent creations and updates persist permanently across restarts and redeployments.

### 5. Health Check & Swagger UI
- Health: [http://localhost:8000/health](http://localhost:8000/health)
- Interactive Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
