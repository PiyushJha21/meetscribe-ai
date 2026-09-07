from sqlalchemy import Column, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class TranscriptSegment(Base):
    __tablename__ = "transcript_segments"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, index=True)
    speaker_name = Column(String(100), nullable=False)
    start_time = Column(Integer, nullable=False)  # in seconds
    end_time = Column(Integer, nullable=False)    # in seconds
    content = Column(Text, nullable=False)
    sequence_number = Column(Integer, nullable=False)

    # Belongs to one Meeting
    meeting = relationship("Meeting", back_populates="transcript_segments")

    # Composite index for fast chronological segment lookups per meeting
    __table_args__ = (
        Index("ix_transcript_meeting_seq", "meeting_id", "sequence_number"),
    )

    def __repr__(self) -> str:
        return f"<TranscriptSegment(id={self.id}, seq={self.sequence_number}, speaker='{self.speaker_name}')>"
