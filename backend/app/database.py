import os
from pathlib import Path
from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker

# Base Directory definition
BASE_DIR = Path(__file__).resolve().parent.parent

# Configurable SQLite database file path (e.g., /data/meetscribe.db on persistent disk mount)
sqlite_env_path = os.getenv("SQLITE_DB_PATH", "").strip() or os.getenv("DB_PATH", "").strip()

if sqlite_env_path:
    db_path = Path(sqlite_env_path)
else:
    # Default to local ./meetscribe.db inside backend directory
    db_path = BASE_DIR / "meetscribe.db"

# Ensure parent directory for persistent SQLite database exists
db_path.parent.mkdir(parents=True, exist_ok=True)

SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_path}"

# SQLite Engine configuration with thread safety and foreign keys
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)


@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    """Enable SQLite foreign key constraint enforcement."""
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency for providing a transactional database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
