from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class MeetingParticipant(Base):
    __tablename__ = "meeting_participants"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=True)
    role = Column(String(50), nullable=True)

    # Belongs to one Meeting
    meeting = relationship("Meeting", back_populates="participants")

    def __repr__(self) -> str:
        return f"<MeetingParticipant(id={self.id}, name='{self.name}', role='{self.role}')>"
