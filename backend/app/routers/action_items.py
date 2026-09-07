from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import ActionItem, Meeting
from app.schemas import (
    ActionItemCreate,
    ActionItemResponse,
    ActionItemUpdate,
    GlobalActionItemResponse,
)

router = APIRouter(prefix="/action-items", tags=["Action Items"])


@router.get("", response_model=List[GlobalActionItemResponse])
def list_all_action_items(
    search: Optional[str] = Query(None, description="Search task, assignee, or meeting title"),
    is_completed: Optional[bool] = Query(None, description="Filter by completion status"),
    assignee: Optional[str] = Query(None, description="Filter by assignee name"),
    meeting_id: Optional[int] = Query(None, description="Filter by specific meeting ID"),
    db: Session = Depends(get_db),
):
    """
    Retrieve all action items across meetings with related meeting details.
    Eliminates N+1 queries by eager-loading meeting relationships.
    Supports filtering by status, assignee, meeting, and search text.
    """
    query = (
        db.query(ActionItem)
        .options(joinedload(ActionItem.meeting))
        .join(Meeting, ActionItem.meeting_id == Meeting.id)
    )

    if is_completed is not None:
        query = query.filter(ActionItem.is_completed == is_completed)

    if assignee and assignee.strip() and assignee != "All Assignees":
        query = query.filter(ActionItem.assignee == assignee.strip())

    if meeting_id is not None:
        query = query.filter(ActionItem.meeting_id == meeting_id)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                ActionItem.task.ilike(term),
                ActionItem.assignee.ilike(term),
                Meeting.title.ilike(term),
            )
        )

    # Order by due_date ascending (nulls last) or ID
    items = query.order_by(ActionItem.is_completed.asc(), ActionItem.due_date.asc().nullslast(), ActionItem.id.asc()).all()

    results = []
    for item in items:
        results.append(
            GlobalActionItemResponse(
                id=item.id,
                meeting_id=item.meeting_id,
                task=item.task,
                assignee=item.assignee,
                is_completed=item.is_completed,
                due_date=item.due_date,
                created_at=item.created_at,
                updated_at=item.updated_at,
                meeting_title=item.meeting.title if item.meeting else None,
                meeting_code=item.meeting.meeting_code if item.meeting else None,
                meeting_date=item.meeting.meeting_date if item.meeting else None,
            )
        )

    return results


@router.patch("/{action_item_id}", response_model=ActionItemResponse)
def update_action_item(
    action_item_id: int,
    payload: ActionItemUpdate,
    db: Session = Depends(get_db),
):
    """
    Update an action item partially. Supports toggling completion status,
    modifying task descriptions, changing assignees, or updating due dates.
    """
    action_item = db.query(ActionItem).filter(ActionItem.id == action_item_id).first()

    if not action_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Action item with id {action_item_id} not found",
        )

    update_data = payload.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(action_item, field, value)

    action_item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(action_item)

    return action_item


@router.post("", response_model=ActionItemResponse, status_code=status.HTTP_201_CREATED)
def create_action_item(
    payload: ActionItemCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new action item associated with a meeting.
    """
    meeting = db.query(Meeting.id).filter(Meeting.id == payload.meeting_id).scalar()
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with id {payload.meeting_id} not found",
        )

    if not payload.task.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Action item task description cannot be empty",
        )

    new_item = ActionItem(
        meeting_id=payload.meeting_id,
        task=payload.task.strip(),
        assignee=payload.assignee.strip() if payload.assignee else None,
        is_completed=payload.is_completed,
        due_date=payload.due_date,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


@router.delete("/{action_item_id}")
def delete_action_item(
    action_item_id: int,
    db: Session = Depends(get_db),
):
    """
    Delete an action item.
    """
    action_item = db.query(ActionItem).filter(ActionItem.id == action_item_id).first()
    if not action_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Action item with id {action_item_id} not found",
        )

    db.delete(action_item)
    db.commit()

    return {
        "status": "success",
        "message": f"Action item {action_item_id} deleted successfully",
    }
