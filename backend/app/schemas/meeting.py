from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

from app.schemas.action_item import ActionItemResponse
from app.schemas.participant import ParticipantCreate, ParticipantResponse
from app.schemas.summary import MeetingSummaryResponse
from app.schemas.topic import KeyTopicResponse
from app.schemas.user import UserResponse


class MeetingBase(BaseModel):
    title: str
    workspace: Optional[str] = "Engineering Syncs"
    description: Optional[str] = None
    meeting_date: datetime = Field(default_factory=datetime.utcnow)
    duration_seconds: int = 0


class MeetingCreate(BaseModel):
    title: str
    workspace: Optional[str] = "Engineering Syncs"
    description: Optional[str] = None
    meeting_date: Optional[datetime] = None
    duration_seconds: Optional[int] = 0
    owner_id: Optional[int] = None
    meeting_code: Optional[str] = None
    participants: Optional[List[ParticipantCreate]] = None


class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    workspace: Optional[str] = None
    description: Optional[str] = None
    meeting_date: Optional[datetime] = None
    duration_seconds: Optional[int] = None
    meeting_code: Optional[str] = None
    processing_status: Optional[str] = None
    participants: Optional[List[ParticipantCreate]] = None


class MeetingListItem(BaseModel):
    id: int
    meeting_code: str
    title: str
    workspace: Optional[str] = None
    description: Optional[str] = None
    meeting_date: datetime
    duration_seconds: int
    participant_count: int
    action_item_count: int = 0
    processing_status: str = "completed"
    summary_preview: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MeetingDetailResponse(BaseModel):
    id: int
    meeting_code: str
    title: str
    workspace: Optional[str] = None
    description: Optional[str] = None
    audio_path: Optional[str] = None
    processing_status: str = "completed"
    meeting_date: datetime
    duration_seconds: int
    created_at: datetime
    updated_at: datetime
    owner_id: int
    owner: Optional[UserResponse] = None
    participants: List[ParticipantResponse] = Field(default_factory=list)
    summary: Optional[MeetingSummaryResponse] = None
    key_topics: List[KeyTopicResponse] = Field(default_factory=list)
    action_items: List[ActionItemResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)
