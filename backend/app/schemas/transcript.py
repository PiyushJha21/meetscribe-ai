from typing import Any, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class TranscriptSegmentBase(BaseModel):
    speaker_name: str
    start_time: int
    end_time: int
    content: str
    sequence_number: int


class TranscriptSegmentCreate(TranscriptSegmentBase):
    pass


class TranscriptSegmentResponse(TranscriptSegmentBase):
    id: int
    meeting_id: int

    model_config = ConfigDict(from_attributes=True)


class TranscriptImportRequest(BaseModel):
    text: Optional[str] = Field(None, description="Pasted plain text or WebVTT transcript content")
    raw_text: Optional[str] = Field(None, description="Alternative field for raw transcript text")
    format: Optional[str] = Field("auto", description="Format hint: 'auto', 'text', 'vtt', 'json'")
    segments: Optional[List[dict]] = Field(None, description="Direct structured segments JSON array")


class TranscriptImportResponse(BaseModel):
    meeting_id: int
    total_segments: int
    duration_seconds: int
    processing_status: str
    segments: List[TranscriptSegmentResponse]
    message: str
