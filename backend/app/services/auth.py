"""
Authentication Service for MeetScribe.
Provides cryptographically secure PBKDF2-HMAC password hashing,
token creation, verification, and authentication dependencies.
"""

import base64
from datetime import datetime, timedelta
import hashlib
import hmac
import json
import os
import secrets
from typing import Any, Dict, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

# Secret key for signing tokens (configurable via environment variable)
AUTH_SECRET_KEY = os.getenv("AUTH_SECRET_KEY", "meetscribe-secure-signing-key-2026-production")
ACCESS_TOKEN_EXPIRE_HOURS = 24 * 7  # 7 days session

# Default Mock / Demo account credentials
DEFAULT_DEMO_EMAIL = "piyush.jha@syncspace.in"
DEFAULT_DEMO_PASSWORD = "MeetScribe2026!"

security_scheme = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    """Hash a plaintext password using PBKDF2-HMAC-SHA256 with cryptographic salt."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100_000,
    )
    return f"{salt}${key.hex()}"


def verify_password(plain_password: str, password_hash: Optional[str]) -> bool:
    """Verify a plaintext password against a stored PBKDF2 hash or default fallback."""
    if not password_hash:
        # If no hash is stored yet, check if it matches the default demo password
        return plain_password == DEFAULT_DEMO_PASSWORD

    try:
        parts = password_hash.split("$")
        if len(parts) != 2:
            return False
        salt, stored_hex = parts
        key = hashlib.pbkdf2_hmac(
            "sha256",
            plain_password.encode("utf-8"),
            salt.encode("utf-8"),
            100_000,
        )
        return hmac.compare_digest(key.hex(), stored_hex)
    except Exception:
        return False


def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def _base64url_decode(data: str) -> bytes:
    padding = "=" * (4 - (len(data) % 4)) if len(data) % 4 != 0 else ""
    return base64.urlsafe_b64decode((data + padding).encode("utf-8"))


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed bearer access token with expiration timestamp."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)

    to_encode.update({"exp": int(expire.timestamp())})

    # Header
    header = {"alg": "HS256", "typ": "JWT"}
    header_bytes = json.dumps(header, separators=(",", ":")).encode("utf-8")
    header_b64 = _base64url_encode(header_bytes)

    # Payload
    payload_bytes = json.dumps(to_encode, separators=(",", ":")).encode("utf-8")
    payload_b64 = _base64url_encode(payload_bytes)

    # Signature
    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    signature = hmac.new(AUTH_SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
    sig_b64 = _base64url_encode(signature)

    return f"{header_b64}.{payload_b64}.{sig_b64}"


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify and decode a signed bearer access token."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts

        # Verify signature
        signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
        expected_sig = hmac.new(AUTH_SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
        provided_sig = _base64url_decode(sig_b64)

        if not hmac.compare_digest(expected_sig, provided_sig):
            return None

        # Decode payload
        payload_bytes = _base64url_decode(payload_b64)
        payload = json.loads(payload_bytes.decode("utf-8"))

        # Check expiration
        exp = payload.get("exp")
        if not exp or datetime.utcnow().timestamp() > exp:
            return None

        return payload
    except Exception:
        return None


def get_current_user_optional(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """Optional authentication dependency: returns User if valid token is supplied, else None."""
    if not auth or not auth.credentials:
        return None

    payload = decode_access_token(auth.credentials)
    if not payload:
        return None

    user_id = payload.get("sub") or payload.get("user_id")
    if not user_id:
        return None

    return db.query(User).filter(User.id == int(user_id)).first()


def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Strict authentication dependency: raises 401 Unauthorized if invalid or missing token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate authentication credentials. Please log in.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not auth or not auth.credentials:
        raise credentials_exception

    payload = decode_access_token(auth.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid token. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub") or payload.get("user_id")
    if not user_id:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User associated with this token does not exist.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
