from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    meeting_code = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    workspace = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    audio_path = Column(String(500), nullable=True)
    processing_status = Column(String(50), default="completed", nullable=False)
    meeting_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    duration_seconds = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    owner = relationship("User", back_populates="meetings")
    participants = relationship(
        "MeetingParticipant",
        back_populates="meeting",
        cascade="all, delete-orphan",
    )
    transcript_segments = relationship(
        "TranscriptSegment",
        back_populates="meeting",
        cascade="all, delete-orphan",
        order_by="TranscriptSegment.sequence_number",
    )
    summary = relationship(
        "MeetingSummary",
        back_populates="meeting",
        cascade="all, delete-orphan",
        uselist=False,
    )
    key_topics = relationship(
        "KeyTopic",
        back_populates="meeting",
        cascade="all, delete-orphan",
        order_by="KeyTopic.sequence_number",
    )
    action_items = relationship(
        "ActionItem",
        back_populates="meeting",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Meeting(id={self.id}, code='{self.meeting_code}', title='{self.title}')>"
