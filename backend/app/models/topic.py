from sqlalchemy import Column, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class KeyTopic(Base):
    __tablename__ = "key_topics"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    sequence_number = Column(Integer, nullable=False, default=1)

    # Belongs to one Meeting
    meeting = relationship("Meeting", back_populates="key_topics")

    # Composite index for ordered retrieval per meeting
    __table_args__ = (
        Index("ix_topic_meeting_seq", "meeting_id", "sequence_number"),
    )

    def __repr__(self) -> str:
        return f"<KeyTopic(id={self.id}, title='{self.title}', seq={self.sequence_number})>"
