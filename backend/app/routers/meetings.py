from datetime import datetime
from pathlib import Path
import shutil
from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload, selectinload

from app.database import BASE_DIR, get_db
from app.models import (
    ActionItem,
    KeyTopic,
    Meeting,
    MeetingParticipant,
    MeetingSummary,
    TranscriptSegment,
    User,
)
from app.schemas import (
    ActionItemResponse,
    MeetingCreate,
    MeetingDetailResponse,
    MeetingListItem,
    MeetingSummaryResponse,
    MeetingUpdate,
    TranscriptImportRequest,
    TranscriptImportResponse,
    TranscriptSegmentResponse,
)
from app.services import (
    ParsedSegment,
    generate_and_save_meeting_intelligence,
    parse_json_transcript,
    parse_plain_text,
    parse_vtt,
)

router = APIRouter(prefix="/meetings", tags=["Meetings"])

# Upload directory configuration
UPLOAD_DIR = BASE_DIR / "uploads" / "audio"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_AUDIO_TYPES = {
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/x-wav",
    "audio/mp4",
    "audio/webm",
    "audio/ogg",
    "audio/aac",
    "audio/m4a",
    "audio/x-m4a",
    "video/webm",  # Some browser MediaRecorder save as video/webm audio
}


@router.get("", response_model=List[MeetingListItem])
def list_meetings(
    search: Optional[str] = Query(None, description="Search meetings by title, code, or participant"),
    sort: Optional[str] = Query("newest", description="Sort order: newest, oldest, longest, shortest"),
    workspace: Optional[str] = Query(None, description="Filter by workspace category"),
    db: Session = Depends(get_db),
):
    """
    Retrieve all meetings with participant count, action item count, and summary preview.
    Supports search across title, meeting code, and participant names.
    Supports workspace filtering and sorting by date and duration.
    """
    query = (
        db.query(Meeting)
        .options(
            selectinload(Meeting.participants),
            selectinload(Meeting.action_items),
            joinedload(Meeting.summary),
        )
    )

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Meeting.title.ilike(term),
                Meeting.meeting_code.ilike(term),
                Meeting.participants.any(MeetingParticipant.name.ilike(term)),
            )
        )

    if workspace and workspace.strip() and workspace.strip().lower() not in ("all", "all workspaces"):
        ws_clean = workspace.strip()
        if "&" in ws_clean or "and" in ws_clean.lower():
            ws_alt1 = ws_clean.replace("&", "and")
            ws_alt2 = ws_clean.replace("and", "&").replace("AND", "&")
            query = query.filter(
                or_(
                    Meeting.workspace.ilike(f"%{ws_clean}%"),
                    Meeting.workspace.ilike(f"%{ws_alt1}%"),
                    Meeting.workspace.ilike(f"%{ws_alt2}%"),
                )
            )
        else:
            query = query.filter(Meeting.workspace.ilike(f"%{ws_clean}%"))

    # Sort ordering
    if sort == "oldest":
        query = query.order_by(Meeting.meeting_date.asc())
    elif sort == "longest":
        query = query.order_by(Meeting.duration_seconds.desc())
    elif sort == "shortest":
        query = query.order_by(Meeting.duration_seconds.asc())
    else:  # newest default
        query = query.order_by(Meeting.meeting_date.desc())

    meetings = query.all()

    results = []
    for m in meetings:
        summary_preview = None
        if m.summary and m.summary.overview:
            overview_text = m.summary.overview
            summary_preview = (
                overview_text[:180] + "..." if len(overview_text) > 180 else overview_text
            )

        results.append(
            MeetingListItem(
                id=m.id,
                meeting_code=m.meeting_code,
                title=m.title,
                workspace=m.workspace or "Engineering Syncs",
                description=m.description,
                meeting_date=m.meeting_date,
                duration_seconds=m.duration_seconds,
                participant_count=len(m.participants),
                action_item_count=len(m.action_items),
                processing_status=m.processing_status or "completed",
                summary_preview=summary_preview,
                created_at=m.created_at,
                updated_at=m.updated_at,
            )
        )

    return results


@router.get("/{meeting_id}", response_model=MeetingDetailResponse)
def get_meeting(
    meeting_id: int,
    db: Session = Depends(get_db),
):
    """
    Retrieve complete meeting details including owner, participants,
    summary, key topics, and action items.
    """
    meeting = (
        db.query(Meeting)
        .options(
            joinedload(Meeting.owner),
            selectinload(Meeting.participants),
            joinedload(Meeting.summary),
            selectinload(Meeting.key_topics),
            selectinload(Meeting.action_items),
        )
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with id {meeting_id} not found",
        )

    return meeting


@router.post("", response_model=MeetingDetailResponse, status_code=status.HTTP_201_CREATED)
def create_meeting(
    payload: MeetingCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new meeting with dynamic participant list and automated code generation.
    """
    # Determine owner
    owner_id = payload.owner_id
    if not owner_id:
        first_user = db.query(User).first()
        if not first_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No default user found in workspace. Please seed database first.",
            )
        owner_id = first_user.id
    else:
        owner = db.query(User).filter(User.id == owner_id).first()
        if not owner:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Owner user with id {owner_id} does not exist",
            )

    # Generate unique meeting code if omitted
    meeting_code = payload.meeting_code
    if not meeting_code:
        meeting_code = f"MTG-IND-{datetime.utcnow().year}-{uuid.uuid4().hex[:6].upper()}"

    code_exists = db.query(Meeting.id).filter(Meeting.meeting_code == meeting_code).scalar()
    if code_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Meeting with code '{meeting_code}' already exists",
        )

    meeting_date = payload.meeting_date or datetime.utcnow()

    new_meeting = Meeting(
        meeting_code=meeting_code,
        title=payload.title,
        workspace=payload.workspace or "Engineering Syncs",
        description=payload.description,
        processing_status="draft",
        meeting_date=meeting_date,
        duration_seconds=payload.duration_seconds or 0,
        owner_id=owner_id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    db.add(new_meeting)
    db.flush()

    # Add participants if provided
    if payload.participants:
        for p in payload.participants:
            if p.name and p.name.strip():
                participant = MeetingParticipant(
                    meeting_id=new_meeting.id,
                    name=p.name.strip(),
                    email=p.email.strip() if p.email else None,
                    role=p.role.strip() if p.role else "Attendee",
                )
                db.add(participant)

    db.commit()

    # Re-query with all relations
    return get_meeting(new_meeting.id, db)


@router.post("/{meeting_id}/audio", response_model=MeetingDetailResponse)
async def upload_meeting_audio(
    meeting_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload and store an audio recording for a meeting.
    Validates audio file type and updates meeting processing status.
    """
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with id {meeting_id} not found",
        )

    # Validate content type
    content_type = file.content_type or ""
    if content_type not in ALLOWED_AUDIO_TYPES and not any(ext in file.filename.lower() for ext in [".mp3", ".wav", ".m4a", ".webm", ".mp4", ".ogg"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{content_type}'. Please upload an audio file (MP3, WAV, M4A, WebM, AAC, OGG).",
        )

    # Determine extension
    ext = Path(file.filename).suffix if file.filename else ".webm"
    if not ext:
        ext = ".webm"

    safe_filename = f"meeting_{meeting_id}_{uuid.uuid4().hex[:8]}{ext}"
    destination_path = UPLOAD_DIR / safe_filename

    # Save to disk
    with destination_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Update meeting record
    meeting.audio_path = f"uploads/audio/{safe_filename}"
    meeting.processing_status = "uploaded"
    meeting.updated_at = datetime.utcnow()

    db.commit()

    return get_meeting(meeting_id, db)


@router.patch("/{meeting_id}", response_model=MeetingDetailResponse)
def update_meeting(
    meeting_id: int,
    payload: MeetingUpdate,
    db: Session = Depends(get_db),
):
    """
    Update meeting details partially (title, workspace, description, date, duration, participants).
    """
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()

    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with id {meeting_id} not found",
        )

    update_data = payload.model_dump(exclude_unset=True)

    if "meeting_code" in update_data and update_data["meeting_code"] != meeting.meeting_code:
        duplicate = (
            db.query(Meeting.id)
            .filter(
                Meeting.meeting_code == update_data["meeting_code"],
                Meeting.id != meeting_id,
            )
            .scalar()
        )
        if duplicate:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Meeting code '{update_data['meeting_code']}' is already in use",
            )

    # Handle dynamic participants replacement if provided in payload
    if "participants" in update_data:
        participants_data = update_data.pop("participants")
        if participants_data is not None:
            db.query(MeetingParticipant).filter(
                MeetingParticipant.meeting_id == meeting_id
            ).delete()

            for p in participants_data:
                p_name = p.get("name", "").strip() if isinstance(p, dict) else (p.name or "").strip()
                if p_name:
                    p_email = p.get("email") if isinstance(p, dict) else p.email
                    p_role = p.get("role") if isinstance(p, dict) else p.role
                    new_participant = MeetingParticipant(
                        meeting_id=meeting_id,
                        name=p_name,
                        email=p_email.strip() if p_email else None,
                        role=p_role.strip() if p_role else "Attendee",
                    )
                    db.add(new_participant)

    # Update remaining scalar attributes
    for field, value in update_data.items():
        setattr(meeting, field, value)

    meeting.updated_at = datetime.utcnow()
    db.commit()

    return get_meeting(meeting_id, db)


@router.delete("/{meeting_id}")
def delete_meeting(
    meeting_id: int,
    db: Session = Depends(get_db),
):
    """
    Delete a meeting and automatically cascade deletion to all dependent records
    (participants, transcripts, summary, key topics, action items, audio files).
    """
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()

    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with id {meeting_id} not found",
        )

    # Clean up uploaded audio file if present
    if meeting.audio_path:
        audio_file_path = BASE_DIR / meeting.audio_path
        try:
            if audio_file_path.exists() and audio_file_path.is_file():
                audio_file_path.unlink()
        except Exception:
            pass  # Best effort audio file removal

    db.delete(meeting)
    db.commit()

    return {
        "status": "success",
        "message": f"Meeting {meeting_id} and all associated records deleted successfully",
    }


def _process_and_save_transcript(
    meeting_id: int,
    parsed_segments: List[ParsedSegment],
    db: Session,
) -> TranscriptImportResponse:
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with id {meeting_id} not found",
        )

    if not parsed_segments:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transcript contains no valid segments or text content.",
        )

    # 1. Clean existing transcript segments to avoid duplicates
    db.query(TranscriptSegment).filter(
        TranscriptSegment.meeting_id == meeting_id
    ).delete()

    # 2. Insert new segments
    new_records = []
    max_end_time = 0
    for idx, seg in enumerate(parsed_segments, 1):
        if seg.end_time > max_end_time:
            max_end_time = seg.end_time

        segment_record = TranscriptSegment(
            meeting_id=meeting_id,
            speaker_name=seg.speaker_name or "Unknown Speaker",
            start_time=seg.start_time,
            end_time=seg.end_time,
            content=seg.content,
            sequence_number=idx,
        )
        new_records.append(segment_record)
        db.add(segment_record)

    # 3. Update meeting metadata & processing status
    if meeting.duration_seconds < max_end_time or meeting.duration_seconds == 0:
        meeting.duration_seconds = max_end_time

    meeting.processing_status = "completed"
    meeting.updated_at = datetime.utcnow()

    db.commit()

    # Automatically generate/update AI Executive Summary, Key Topics & Action Items
    try:
        generate_and_save_meeting_intelligence(meeting_id, db)
    except Exception as e:
        print(f"Warning: Auto-intelligence generation failed: {e}")

    # 4. Fetch stored segments
    stored_segments = (
        db.query(TranscriptSegment)
        .filter(TranscriptSegment.meeting_id == meeting_id)
        .order_by(TranscriptSegment.sequence_number.asc())
        .all()
    )

    return TranscriptImportResponse(
        meeting_id=meeting_id,
        total_segments=len(stored_segments),
        duration_seconds=meeting.duration_seconds,
        processing_status=meeting.processing_status,
        segments=[
            TranscriptSegmentResponse.model_validate(s) for s in stored_segments
        ],
        message=f"Successfully imported {len(stored_segments)} transcript segments.",
    )


@router.get("/{meeting_id}/transcript", response_model=List[TranscriptSegmentResponse])
def get_meeting_transcripts(
    meeting_id: int,
    search: Optional[str] = Query(None, description="Search transcript text content"),
    db: Session = Depends(get_db),
):
    """
    Retrieve transcript segments for a meeting ordered by sequence_number.
    """
    meeting_exists = db.query(Meeting.id).filter(Meeting.id == meeting_id).scalar()
    if not meeting_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with id {meeting_id} not found",
        )

    query = db.query(TranscriptSegment).filter(
        TranscriptSegment.meeting_id == meeting_id
    )

    if search:
        query = query.filter(TranscriptSegment.content.ilike(f"%{search.strip()}%"))

    transcripts = query.order_by(TranscriptSegment.sequence_number.asc()).all()
    return transcripts


@router.post("/{meeting_id}/transcript", response_model=TranscriptImportResponse)
def import_meeting_transcript(
    meeting_id: int,
    payload: TranscriptImportRequest,
    db: Session = Depends(get_db),
):
    """
    Import transcript from pasted text, WebVTT, or JSON payload.
    Replaces existing transcript segments for this meeting.
    """
    meeting_exists = db.query(Meeting.id).filter(Meeting.id == meeting_id).scalar()
    if not meeting_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with id {meeting_id} not found",
        )

    parsed_segments: List[ParsedSegment] = []

    # 1. Direct JSON segments array provided
    if payload.segments is not None:
        try:
            parsed_segments = parse_json_transcript(payload.segments)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to parse transcript JSON: {str(e)}",
            )
    else:
        text_content = payload.text or payload.raw_text or ""
        text_content = text_content.strip()
        if not text_content:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No transcript text provided. Please provide text or segments.",
            )

        fmt = (payload.format or "auto").lower()

        if fmt == "json" or (fmt == "auto" and (text_content.startswith("[") or text_content.startswith("{"))):
            try:
                parsed_segments = parse_json_transcript(text_content)
            except Exception as e:
                if fmt == "json":
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Invalid JSON transcript: {str(e)}",
                    )
                parsed_segments = parse_plain_text(text_content)
        elif fmt == "vtt" or (fmt == "auto" and ("-->" in text_content or "WEBVTT" in text_content)):
            parsed_segments = parse_vtt(text_content)
        else:
            parsed_segments = parse_plain_text(text_content)

    return _process_and_save_transcript(meeting_id, parsed_segments, db)


@router.post("/{meeting_id}/transcript/upload", response_model=TranscriptImportResponse)
async def upload_meeting_transcript_file(
    meeting_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload and parse a transcript file (.txt, .vtt, .json).
    Replaces existing transcript segments for this meeting.
    """
    meeting_exists = db.query(Meeting.id).filter(Meeting.id == meeting_id).scalar()
    if not meeting_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with id {meeting_id} not found",
        )

    filename = file.filename or ""
    ext = Path(filename).suffix.lower()

    if ext not in [".txt", ".vtt", ".json"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{ext}'. Supported formats: .txt, .vtt, .json",
        )

    try:
        content_bytes = await file.read()
        content_str = content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        try:
            content_str = content_bytes.decode("latin-1")
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to decode file as text.",
            )

    if not content_str.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is empty.",
        )

    parsed_segments: List[ParsedSegment] = []

    if ext == ".json":
        try:
            parsed_segments = parse_json_transcript(content_str)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid JSON transcript file: {str(e)}",
            )
    elif ext == ".vtt":
        parsed_segments = parse_vtt(content_str)
        if not parsed_segments:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not parse any valid WebVTT cues or timestamps from file.",
            )
    else:  # .txt
        parsed_segments = parse_plain_text(content_str)

    return _process_and_save_transcript(meeting_id, parsed_segments, db)


@router.get("/{meeting_id}/summary", response_model=MeetingSummaryResponse)
def get_meeting_summary(
    meeting_id: int,
    db: Session = Depends(get_db),
):
    """
    Retrieve the meeting summary for a specific meeting.
    """
    meeting_exists = db.query(Meeting.id).filter(Meeting.id == meeting_id).scalar()
    if not meeting_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with id {meeting_id} not found",
        )

    summary = (
        db.query(MeetingSummary)
        .filter(MeetingSummary.meeting_id == meeting_id)
        .first()
    )

    if not summary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Summary for meeting {meeting_id} not found",
        )

    return summary


@router.get("/{meeting_id}/action-items", response_model=List[ActionItemResponse])
def get_meeting_action_items(
    meeting_id: int,
    db: Session = Depends(get_db),
):
    """
    Retrieve all action items belonging to a specific meeting.
    """
    meeting_exists = db.query(Meeting.id).filter(Meeting.id == meeting_id).scalar()
    if not meeting_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with id {meeting_id} not found",
        )

    action_items = (
        db.query(ActionItem)
        .filter(ActionItem.meeting_id == meeting_id)
        .order_by(ActionItem.id.asc())
        .all()
    )
    return action_items


@router.post("/{meeting_id}/generate-summary", response_model=MeetingDetailResponse)
@router.post("/{meeting_id}/ai-insights", response_model=MeetingDetailResponse)
def generate_meeting_ai_insights(
    meeting_id: int,
    db: Session = Depends(get_db),
):
    """
    Analyze all transcript segments for the meeting, and generate/save:
    1. AI Executive Summary (MeetingSummary)
    2. Key Discussion Topics (KeyTopic)
    3. Action Items (ActionItem)
    """
    try:
        generate_and_save_meeting_intelligence(meeting_id, db)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    return get_meeting(meeting_id, db)

