import os
from pathlib import Path
from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker

# Base Directory definition
BASE_DIR = Path(__file__).resolve().parent.parent

# Read DATABASE_URL from environment (e.g., Render PostgreSQL, Neon, Supabase)
RAW_DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

if RAW_DATABASE_URL:
    # Render, Neon, Supabase, and Heroku often provide postgres:// which SQLAlchemy 1.4+ deprecated
    if RAW_DATABASE_URL.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URL = RAW_DATABASE_URL.replace("postgres://", "postgresql://", 1)
    else:
        SQLALCHEMY_DATABASE_URL = RAW_DATABASE_URL
else:
    # Default to local SQLite file for development
    DB_FILE = BASE_DIR / "meetscribe.db"
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_FILE}"

# Engine initialization
is_sqlite = SQLALCHEMY_DATABASE_URL.startswith("sqlite")

if is_sqlite:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
    )

    # Enable SQLite foreign key constraint enforcement
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()
else:
    # PostgreSQL production pool configuration with SSL pre-ping & connection recycling
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
        pool_size=10,
        max_overflow=20,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency for providing a transactional database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
