from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class UserBase(BaseModel):
    display_id: str
    name: str
    email: str
    avatar_url: Optional[str] = None


class UserCreate(BaseModel):
    display_id: Optional[str] = None
    name: str
    email: str
    avatar_url: Optional[str] = None


class UserResponse(UserBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
