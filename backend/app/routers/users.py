from datetime import datetime
from typing import List
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get("", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    """
    Retrieve all users registered in the MeetScribe workspace.
    """
    users = db.query(User).order_by(User.id.asc()).all()
    return users


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user with unique email and display identifier.
    """
    # Check if email is already in use
    existing_user = db.query(User).filter(User.email.ilike(payload.email.strip())).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with email '{payload.email}' already exists",
        )

    # Generate display_id if omitted
    display_id = payload.display_id
    if not display_id or not display_id.strip():
        display_id = f"USR-IND-{uuid.uuid4().hex[:6].upper()}"
    else:
        display_id = display_id.strip()
        existing_display_id = db.query(User).filter(User.display_id == display_id).first()
        if existing_display_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"User with display_id '{display_id}' already exists",
            )

    new_user = User(
        display_id=display_id,
        name=payload.name.strip(),
        email=payload.email.strip().lower(),
        avatar_url=payload.avatar_url or f"https://api.dicebear.com/7.x/avataaars/svg?seed={payload.name.strip()}",
        created_at=datetime.utcnow(),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.get("/{user_id}", response_model=UserResponse)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    """
    Retrieve user details by user ID.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found",
        )
    return user
