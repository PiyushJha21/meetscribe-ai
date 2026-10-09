import os
from pathlib import Path
from urllib.parse import quote_plus
from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker

# Base Directory definition
BASE_DIR = Path(__file__).resolve().parent.parent


def get_database_url() -> str:
    """Resolve the SQLAlchemy Database URL from environment variables.
    
    Priority:
    1. DATABASE_URL (Standard format across PaaS / Docker / Cloud providers)
    2. Component PostgreSQL variables (POSTGRES_HOST, POSTGRES_PORT, etc.)
    3. SQLITE_DB_PATH / DB_PATH (SQLite fallback)
    4. Local backend/meetscribe.db (Default development fallback)
    """
    db_url = os.getenv("DATABASE_URL", "").strip()

    if db_url:
        # Normalize postgres / psycopg connection schemes to postgresql+psycopg2://
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql+psycopg2://", 1)
        elif db_url.startswith("postgresql+psycopg://"):
            db_url = db_url.replace("postgresql+psycopg://", "postgresql+psycopg2://", 1)
        elif db_url.startswith("postgresql://"):
            db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)
        return db_url

    # Check for individual PostgreSQL environment variables
    pg_host = os.getenv("POSTGRES_HOST", "").strip()
    pg_db = os.getenv("POSTGRES_DB", "").strip()
    if pg_host and pg_db:
        pg_user = os.getenv("POSTGRES_USER", "postgres").strip()
        pg_password = os.getenv("POSTGRES_PASSWORD", "").strip()
        pg_port = os.getenv("POSTGRES_PORT", "5432").strip()

        encoded_user = quote_plus(pg_user)
        encoded_pass = quote_plus(pg_password)
        auth_part = f"{encoded_user}:{encoded_pass}@" if pg_password else f"{encoded_user}@"
        return f"postgresql+psycopg2://{auth_part}{pg_host}:{pg_port}/{pg_db}"

    # Fallback to SQLite
    sqlite_env_path = os.getenv("SQLITE_DB_PATH", "").strip() or os.getenv("DB_PATH", "").strip()
    if sqlite_env_path:
        db_path = Path(sqlite_env_path)
    else:
        db_path = BASE_DIR / "meetscribe.db"

    # Ensure parent directory for persistent SQLite database exists
    db_path.parent.mkdir(parents=True, exist_ok=True)
    return f"sqlite:///{db_path}"


SQLALCHEMY_DATABASE_URL = get_database_url()

# Engine creation with dialect-specific optimizations
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
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
    # PostgreSQL Engine with robust connection pooling and pre-ping health checks
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_size=int(os.getenv("DB_POOL_SIZE", "10")),
        max_overflow=int(os.getenv("DB_MAX_OVERFLOW", "20")),
        pool_pre_ping=True,
        pool_recycle=int(os.getenv("DB_POOL_RECYCLE", "300")),
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
