"""Data migration utility to migrate data from SQLite to PostgreSQL.

Usage:
    python -m app.migrate_data
    python app/migrate_data.py --sqlite-path ./meetscribe.db --pg-url postgresql://meetscribe_user:meetscribe_password@localhost:5432/meetscribe
"""

import argparse
import os
import sys
from pathlib import Path
from sqlalchemy import create_engine, func, text
from sqlalchemy.orm import sessionmaker

# Ensure backend root is on sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app.models import (
    ActionItem,
    KeyTopic,
    Meeting,
    MeetingParticipant,
    MeetingSummary,
    TranscriptSegment,
    User,
)


def migrate_sqlite_to_postgres(sqlite_path: str, pg_url: str, clean_target: bool = False):
    """Safely migrate all records from SQLite to PostgreSQL with sequence synchronization."""
    print(f"--- Starting MeetScribe Database Migration ---")
    print(f"Source SQLite:     {sqlite_path}")
    # Mask password for logging
    safe_pg_url = pg_url.split("@")[-1] if "@" in pg_url else pg_url
    print(f"Target PostgreSQL: ...@{safe_pg_url}")

    if not os.path.exists(sqlite_path):
        print(f"Error: SQLite source database not found at '{sqlite_path}'.")
        return False

    # Connect to SQLite
    sqlite_engine = create_engine(f"sqlite:///{sqlite_path}")
    SqliteSession = sessionmaker(bind=sqlite_engine)
    sqlite_db = SqliteSession()

    # Connect to PostgreSQL
    if pg_url.startswith("postgres://"):
        pg_url = pg_url.replace("postgres://", "postgresql+psycopg2://", 1)
    elif pg_url.startswith("postgresql+psycopg://"):
        pg_url = pg_url.replace("postgresql+psycopg://", "postgresql+psycopg2://", 1)
    elif pg_url.startswith("postgresql://"):
        pg_url = pg_url.replace("postgresql://", "postgresql+psycopg2://", 1)
    pg_engine = create_engine(pg_url)
    PgSession = sessionmaker(bind=pg_engine)
    pg_db = PgSession()

    try:
        if clean_target:
            print("\nCleaning target PostgreSQL tables in reverse dependency order...")
            pg_db.execute(text("TRUNCATE TABLE action_items, key_topics, meeting_summaries, transcript_segments, meeting_participants, meetings, users CASCADE;"))
            pg_db.commit()

        # 1. Migrate Users
        sqlite_users = sqlite_db.query(User).order_by(User.id).all()
        print(f"\n1. Migrating Users ({len(sqlite_users)} records)...")
        for u in sqlite_users:
            existing = pg_db.query(User).filter(User.id == u.id).first()
            if not existing:
                new_u = User(
                    id=u.id,
                    display_id=u.display_id,
                    name=u.name,
                    email=u.email,
                    avatar_url=u.avatar_url,
                    password_hash=u.password_hash,
                    created_at=u.created_at,
                )
                pg_db.add(new_u)
            else:
                existing.display_id = u.display_id
                existing.name = u.name
                existing.email = u.email
                existing.avatar_url = u.avatar_url
                existing.password_hash = u.password_hash
        pg_db.commit()

        # 2. Migrate Meetings
        sqlite_meetings = sqlite_db.query(Meeting).order_by(Meeting.id).all()
        print(f"2. Migrating Meetings ({len(sqlite_meetings)} records)...")
        for m in sqlite_meetings:
            existing = pg_db.query(Meeting).filter(Meeting.id == m.id).first()
            if not existing:
                new_m = Meeting(
                    id=m.id,
                    meeting_code=m.meeting_code,
                    title=m.title,
                    workspace=m.workspace,
                    description=m.description,
                    audio_path=m.audio_path,
                    processing_status=m.processing_status,
                    meeting_date=m.meeting_date,
                    duration_seconds=m.duration_seconds,
                    created_at=m.created_at,
                    updated_at=m.updated_at,
                    owner_id=m.owner_id,
                )
                pg_db.add(new_m)
            else:
                existing.meeting_code = m.meeting_code
                existing.title = m.title
                existing.workspace = m.workspace
                existing.description = m.description
                existing.audio_path = m.audio_path
                existing.processing_status = m.processing_status
                existing.meeting_date = m.meeting_date
                existing.duration_seconds = m.duration_seconds
                existing.owner_id = m.owner_id
        pg_db.commit()

        # 3. Migrate Meeting Participants
        sqlite_participants = sqlite_db.query(MeetingParticipant).order_by(MeetingParticipant.id).all()
        print(f"3. Migrating Meeting Participants ({len(sqlite_participants)} records)...")
        for p in sqlite_participants:
            existing = pg_db.query(MeetingParticipant).filter(MeetingParticipant.id == p.id).first()
            if not existing:
                new_p = MeetingParticipant(
                    id=p.id,
                    meeting_id=p.meeting_id,
                    name=p.name,
                    email=p.email,
                    role=p.role,
                )
                pg_db.add(new_p)
        pg_db.commit()

        # 4. Migrate Transcript Segments
        sqlite_transcripts = sqlite_db.query(TranscriptSegment).order_by(TranscriptSegment.id).all()
        print(f"4. Migrating Transcript Segments ({len(sqlite_transcripts)} records)...")
        for t in sqlite_transcripts:
            existing = pg_db.query(TranscriptSegment).filter(TranscriptSegment.id == t.id).first()
            if not existing:
                new_t = TranscriptSegment(
                    id=t.id,
                    meeting_id=t.meeting_id,
                    speaker_name=t.speaker_name,
                    start_time=t.start_time,
                    end_time=t.end_time,
                    content=t.content,
                    sequence_number=t.sequence_number,
                )
                pg_db.add(new_t)
        pg_db.commit()

        # 5. Migrate Meeting Summaries
        sqlite_summaries = sqlite_db.query(MeetingSummary).order_by(MeetingSummary.id).all()
        print(f"5. Migrating Meeting Summaries ({len(sqlite_summaries)} records)...")
        for s in sqlite_summaries:
            existing = pg_db.query(MeetingSummary).filter(MeetingSummary.id == s.id).first()
            if not existing:
                new_s = MeetingSummary(
                    id=s.id,
                    meeting_id=s.meeting_id,
                    overview=s.overview,
                    created_at=s.created_at,
                    updated_at=s.updated_at,
                )
                pg_db.add(new_s)
        pg_db.commit()

        # 6. Migrate Key Topics
        sqlite_topics = sqlite_db.query(KeyTopic).order_by(KeyTopic.id).all()
        print(f"6. Migrating Key Topics ({len(sqlite_topics)} records)...")
        for top in sqlite_topics:
            existing = pg_db.query(KeyTopic).filter(KeyTopic.id == top.id).first()
            if not existing:
                new_top = KeyTopic(
                    id=top.id,
                    meeting_id=top.meeting_id,
                    title=top.title,
                    description=top.description,
                    sequence_number=top.sequence_number,
                )
                pg_db.add(new_top)
        pg_db.commit()

        # 7. Migrate Action Items
        sqlite_actions = sqlite_db.query(ActionItem).order_by(ActionItem.id).all()
        print(f"7. Migrating Action Items ({len(sqlite_actions)} records)...")
        for a in sqlite_actions:
            existing = pg_db.query(ActionItem).filter(ActionItem.id == a.id).first()
            if not existing:
                new_a = ActionItem(
                    id=a.id,
                    meeting_id=a.meeting_id,
                    task=a.task,
                    assignee=a.assignee,
                    is_completed=a.is_completed,
                    due_date=a.due_date,
                    created_at=a.created_at,
                    updated_at=a.updated_at,
                )
                pg_db.add(new_a)
        pg_db.commit()

        # Synchronize PostgreSQL Auto-Increment Sequences
        print("\nSynchronizing PostgreSQL auto-increment sequences...")
        tables = [
            "users",
            "meetings",
            "meeting_participants",
            "transcript_segments",
            "meeting_summaries",
            "key_topics",
            "action_items",
        ]
        for tbl in tables:
            seq_sql = f"SELECT setval(pg_get_serial_sequence('{tbl}', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM {tbl};"
            pg_db.execute(text(seq_sql))
        pg_db.commit()

        # Verification report
        print("\n=== Verification Report ===")
        print(f"Users:               SQLite={sqlite_db.query(User).count()}  --> PostgreSQL={pg_db.query(User).count()}")
        print(f"Meetings:            SQLite={sqlite_db.query(Meeting).count()}  --> PostgreSQL={pg_db.query(Meeting).count()}")
        print(f"Participants:        SQLite={sqlite_db.query(MeetingParticipant).count()}  --> PostgreSQL={pg_db.query(MeetingParticipant).count()}")
        print(f"Transcript Segments: SQLite={sqlite_db.query(TranscriptSegment).count()}  --> PostgreSQL={pg_db.query(TranscriptSegment).count()}")
        print(f"Meeting Summaries:   SQLite={sqlite_db.query(MeetingSummary).count()}  --> PostgreSQL={pg_db.query(MeetingSummary).count()}")
        print(f"Key Topics:          SQLite={sqlite_db.query(KeyTopic).count()}  --> PostgreSQL={pg_db.query(KeyTopic).count()}")
        print(f"Action Items:        SQLite={sqlite_db.query(ActionItem).count()}  --> PostgreSQL={pg_db.query(ActionItem).count()}")
        print("\n✅ Migration completed successfully!")
        return True

    except Exception as e:
        pg_db.rollback()
        print(f"\n❌ Migration failed with error: {e}")
        raise e
    finally:
        sqlite_db.close()
        pg_db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Migrate MeetScribe SQLite database to PostgreSQL.")
    parser.add_argument(
        "--sqlite-path",
        default=os.getenv("SQLITE_DB_PATH", str(BASE_DIR / "meetscribe.db")),
        help="Path to source SQLite .db file",
    )
    parser.add_argument(
        "--pg-url",
        default=os.getenv("DATABASE_URL", "postgresql://meetscribe_user:meetscribe_password@localhost:5432/meetscribe"),
        help="Target PostgreSQL database URL",
    )
    parser.add_argument(
        "--clean",
        action="store_true",
        help="Clean target PostgreSQL tables before importing",
    )
    args = parser.parse_args()

    success = migrate_sqlite_to_postgres(args.sqlite_path, args.pg_url, clean_target=args.clean)
    sys.exit(0 if success else 1)
