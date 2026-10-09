# MeetScribe Backend

FastAPI backend service for MeetScribe (Meeting Notes & Transcription Platform).

## Architecture

- **Framework**: FastAPI (Python 3.9+)
- **Database & ORM**: PostgreSQL (Production) / SQLite (Local Fallback) via SQLAlchemy 2.0
- **Database Migrations**: Alembic
- **Driver**: `psycopg2-binary`
- **Validation**: Pydantic v2 & Pydantic-Settings
- **Structure**:
  - `app/main.py`: Application entrypoint, CORS, startup lifespan, health endpoints (`/health` & `/api/health`).
  - `app/database.py`: Dynamic database engine resolution with PostgreSQL connection pooling and SQLite fallback.
  - `app/models/`: SQLAlchemy ORM database models (`User`, `Meeting`, `MeetingParticipant`, `TranscriptSegment`, `MeetingSummary`, `KeyTopic`, `ActionItem`).
  - `app/schemas/`: Pydantic request & response schemas with attribute mapping.
  - `app/routers/`: Modular REST API route handlers (`/api/auth`, `/api/meetings`, `/api/users`, `/api/action-items`).
  - `app/services/`: AI summary extraction, token authentication, and transcript parsing.
  - `app/migrate_data.py`: CLI tool for migrating data from SQLite to PostgreSQL with sequence synchronization.
  - `app/seed.py`: Idempotent database seeding utility.
  - `alembic/`: Schema migration version scripts.

---

## Database Configuration & Environment Variables

MeetScribe connects to PostgreSQL via `DATABASE_URL` (or individual PostgreSQL environment variables). If no PostgreSQL connection is provided, it automatically falls back to SQLite for zero-configuration local development.

### Environment Variables

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | Full connection URI for PostgreSQL or SQLite | `postgresql://user:password@localhost:5432/meetscribe` |
| `POSTGRES_HOST` | PostgreSQL host (used if `DATABASE_URL` is unset) | `localhost` |
| `POSTGRES_PORT` | PostgreSQL port | `5432` |
| `POSTGRES_DB` | PostgreSQL database name | `meetscribe` |
| `POSTGRES_USER` | PostgreSQL user | `meetscribe_user` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `meetscribe_password` |
| `SQLITE_DB_PATH` | Path for SQLite database fallback | `./meetscribe.db` |
| `AUTH_SECRET_KEY` | Secret key for signing bearer session tokens | *(Random secure string)* |
| `TOKEN_EXPIRE_DAYS`| Token expiration in days | `7` |
| `AUTO_SEED` | Seed sample meetings if database is fresh | `true` |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:3000` |

Copy the example file to configure your local environment:
```bash
cp .env.example .env
```

---

## Running PostgreSQL with Docker

To start a local PostgreSQL container:

```bash
docker run -d \
  --name meetscribe-postgres \
  -e POSTGRES_DB=meetscribe \
  -e POSTGRES_USER=meetscribe_user \
  -e POSTGRES_PASSWORD=meetscribe_password \
  -p 5432:5432 \
  postgres:16-alpine
```

---

## Schema Migrations with Alembic

Run database migrations against PostgreSQL:

```bash
# Apply all migrations to the latest revision
DATABASE_URL="postgresql://meetscribe_user:meetscribe_password@localhost:5432/meetscribe" alembic upgrade head

# Generate a new migration after modifying ORM models
alembic revision --autogenerate -m "describe_changes"

# Rollback one migration step
alembic downgrade -1
```

---

## Data Migration: SQLite to PostgreSQL

To export and migrate existing SQLite data (`meetscribe.db`) into PostgreSQL:

```bash
# Migrate from default SQLite to PostgreSQL
python -m app.migrate_data \
  --sqlite-path ./meetscribe.db \
  --pg-url postgresql://meetscribe_user:meetscribe_password@localhost:5432/meetscribe

# Migrate with target table cleanup
python app/migrate_data.py \
  --sqlite-path ./meetscribe.db \
  --pg-url postgresql://meetscribe_user:meetscribe_password@localhost:5432/meetscribe \
  --clean
```

The migration utility:
1. Copies all 7 models in dependency order (`User` → `Meeting` → `MeetingParticipant` → `TranscriptSegment` → `MeetingSummary` → `KeyTopic` → `ActionItem`).
2. Preserves existing primary keys and foreign key relationships.
3. Automatically resynchronizes PostgreSQL auto-increment sequences (`users_id_seq`, `meetings_id_seq`, etc.) to prevent ID collisions on subsequent inserts.
4. Outputs a verification report comparing source SQLite and target PostgreSQL record counts.

---

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

### 3. Run Alembic Migrations
```bash
alembic upgrade head
```

### 4. Start the Development Server
```bash
# With PostgreSQL
DATABASE_URL="postgresql://meetscribe_user:meetscribe_password@localhost:5432/meetscribe" uvicorn app.main:app --reload --port 8000

# Or with SQLite fallback
uvicorn app.main:app --reload --port 8000
```

---

## Health Check & API Documentation

- **Health Endpoint**: [http://localhost:8000/api/health](http://localhost:8000/api/health) & [http://localhost:8000/health](http://localhost:8000/health)
  - Returns: `{"status": "healthy", "message": "MeetScribe API is running", "database": "postgresql"}`
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc UI**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
