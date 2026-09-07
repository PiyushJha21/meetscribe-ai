from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class ActionItemBase(BaseModel):
    task: str
    assignee: Optional[str] = None
    is_completed: bool = False
    due_date: Optional[datetime] = None


class ActionItemCreate(ActionItemBase):
    meeting_id: int


class ActionItemUpdate(BaseModel):
    task: Optional[str] = None
    assignee: Optional[str] = None
    is_completed: Optional[bool] = None
    due_date: Optional[datetime] = None


class ActionItemResponse(ActionItemBase):
    id: int
    meeting_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GlobalActionItemResponse(ActionItemResponse):
    meeting_title: Optional[str] = None
    meeting_code: Optional[str] = None
    meeting_date: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
