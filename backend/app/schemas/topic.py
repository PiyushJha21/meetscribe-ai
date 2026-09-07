from typing import Optional
from pydantic import BaseModel, ConfigDict


class KeyTopicBase(BaseModel):
    title: str
    description: Optional[str] = None
    sequence_number: int = 1


class KeyTopicCreate(KeyTopicBase):
    pass


class KeyTopicResponse(KeyTopicBase):
    id: int
    meeting_id: int

    model_config = ConfigDict(from_attributes=True)
