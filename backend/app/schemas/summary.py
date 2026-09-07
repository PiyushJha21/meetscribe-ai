from datetime import datetime
from pydantic import BaseModel, ConfigDict


class MeetingSummaryBase(BaseModel):
    overview: str


class MeetingSummaryCreate(MeetingSummaryBase):
    pass


class MeetingSummaryResponse(MeetingSummaryBase):
    id: int
    meeting_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
