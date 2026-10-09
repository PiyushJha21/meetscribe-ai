from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse
from app.schemas.user import UserResponse
from app.services.auth import (
    DEFAULT_DEMO_EMAIL,
    DEFAULT_DEMO_PASSWORD,
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user with email and password.
    Validates credentials on the backend and returns a signed bearer access token.
    """
    clean_email = payload.email.strip().lower()
    clean_password = payload.password.strip()

    if not clean_email or not clean_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required.",
        )

    # Find user by email
    user = db.query(User).filter(User.email.ilike(clean_email)).first()

    # Handle demo account fallback if user isn't in db yet
    if not user and clean_email == DEFAULT_DEMO_EMAIL.lower():
        if clean_password == DEFAULT_DEMO_PASSWORD:
            # Auto-provision default demo user
            user = User(
                display_id="USR-IND-001",
                name="Piyush Kumar Jha",
                email=DEFAULT_DEMO_EMAIL,
                avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=Piyush",
                password_hash=hash_password(DEFAULT_DEMO_PASSWORD),
                created_at=datetime.utcnow(),
            )
            db.add(user)
            db.commit()
            db.refresh(user)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify password
    if not verify_password(clean_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create signed access token
    access_token = create_access_token(
        data={"sub": str(user.id), "user_id": user.id, "email": user.email}
    )

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse)
def get_current_authenticated_user(current_user: User = Depends(get_current_user)):
    """
    Retrieve current authenticated user session details.
    Protects authenticated endpoints by verifying the bearer token.
    """
    return current_user


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    """
    Invalidate session confirmation for authenticated user.
    """
    return {
        "status": "success",
        "message": f"User {current_user.email} logged out successfully.",
    }
