from contextlib import asynccontextmanager
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.database import Base, SessionLocal, engine
import app.models  # Ensures all SQLAlchemy models are registered
from app.routers import action_items_router, auth_router, meetings_router, users_router
from app.seed import seed_database, seed_default_users


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure all database tables exist on application startup
    Base.metadata.create_all(bind=engine)

    # Dialect-agnostic check to ensure all columns exist
    db = SessionLocal()
    try:
        inspector = inspect(engine)
        if "users" in inspector.get_table_names():
            columns = [c["name"] for c in inspector.get_columns("users")]
            if "password_hash" not in columns:
                print("Adding missing password_hash column to users table...")
                db.execute(text("ALTER TABLE users ADD COLUMN password_hash VARCHAR(255)"))
                db.commit()

        from app.models import Meeting
        seed_default_users(db)

        # If database has zero meetings, automatically seed sample workspace meetings
        auto_seed = os.getenv("AUTO_SEED", "true").lower() in ("true", "1", "yes")
        if auto_seed and db.query(Meeting).count() == 0:
            print("Fresh database detected. Automatically seeding sample meetings and transcripts...")
            seed_database(db)
    except Exception as e:
        print(f"Warning: Startup database initialization error: {e}")
    finally:
        db.close()

    yield


app = FastAPI(
    title="MeetScribe API",
    description="Backend REST API for MeetScribe - Meeting Notes & Transcription Platform",
    version="0.1.0",
    lifespan=lifespan,
)

# Configure CORS for Next.js frontend communication (local, Vercel, and custom domains)
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
frontend_url_env = os.getenv("FRONTEND_URL")
if frontend_url_env:
    allowed_origins.append(frontend_url_env.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers under /api
app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(meetings_router, prefix="/api")
app.include_router(action_items_router, prefix="/api")


@app.get("/health", tags=["Health"])
@app.get("/api/health", tags=["Health"])
async def health_check():
    """Health check endpoint confirming API status and database dialect."""
    dialect_name = engine.dialect.name
    return {
        "status": "healthy",
        "message": "MeetScribe API is running",
        "database": dialect_name,
    }
