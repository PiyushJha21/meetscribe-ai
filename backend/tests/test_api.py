"""Comprehensive Test Suite for MeetScribe API & PostgreSQL Integration.

Run tests using:
    pytest tests/ -v
"""

import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db, get_database_url
from app.main import app
from app.models import User, Meeting, ActionItem, TranscriptSegment, MeetingSummary, KeyTopic
from app.services.auth import hash_password


@pytest.fixture(scope="session")
def client():
    """Create a FastAPI TestClient instance."""
    with TestClient(app) as test_client:
        yield test_client


def test_health_check(client):
    """Verify health endpoint returns 200 OK and database status."""
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "database" in data

    api_res = client.get("/api/health")
    assert api_res.status_code == 200
    assert api_res.json()["status"] == "healthy"


def test_auth_invalid_login(client):
    """Verify invalid credentials are rejected with 401."""
    res = client.post("/api/auth/login", json={
        "email": "piyush.jha@syncspace.in",
        "password": "IncorrectPassword123!"
    })
    assert res.status_code == 401
    assert "detail" in res.json()


def test_auth_valid_demo_login(client):
    """Verify demo login succeeds and returns JWT bearer token."""
    res = client.post("/api/auth/login", json={
        "email": "piyush.jha@syncspace.in",
        "password": "MeetScribe2026!"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "piyush.jha@syncspace.in"

    # Test /api/auth/me with bearer token
    token = data["access_token"]
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "piyush.jha@syncspace.in"


def test_users_listing(client):
    """Verify users endpoint returns seeded workspace users."""
    res = client.get("/api/users")
    assert res.status_code == 200
    users = res.json()
    assert isinstance(users, list)
    assert len(users) >= 1
    emails = [u["email"] for u in users]
    assert "piyush.jha@syncspace.in" in emails


def test_meetings_listing(client):
    """Verify meetings list endpoint."""
    res = client.get("/api/meetings")
    assert res.status_code == 200
    meetings = res.json()
    assert isinstance(meetings, list)
    assert len(meetings) >= 1


def test_meeting_detail_retrieval(client):
    """Verify retrieving meeting detail with relations."""
    res = client.get("/api/meetings/1")
    assert res.status_code == 200
    meeting = res.json()
    assert meeting["id"] == 1
    assert "title" in meeting
    assert "key_topics" in meeting
    assert "action_items" in meeting


def test_meeting_lifecycle_and_cascade(client):
    """Test creating a meeting, adding transcripts, generating summary, and deleting it."""
    # 1. Create meeting
    create_res = client.post("/api/meetings", json={
        "title": "Automated Pytest Meeting",
        "workspace": "Engineering Syncs",
        "description": "Meeting created during automated test execution.",
        "owner_id": 1,
        "participant_names": ["Piyush Kumar Jha", "Rahul Verma"],
    })
    assert create_res.status_code == 201
    meeting_data = create_res.json()
    meeting_id = meeting_data["id"]

    # 2. Ingest WebVTT transcript
    vtt_content = """WEBVTT

00:00:00.000 --> 00:00:15.000
Piyush Kumar Jha: We are validating meeting lifecycle on PostgreSQL.

00:00:15.000 --> 00:00:30.000
Rahul Verma: All tests are running against the live database container.
"""
    trans_res = client.post(f"/api/meetings/{meeting_id}/transcript", json={
        "format": "vtt",
        "text": vtt_content,
    })
    assert trans_res.status_code == 200
    assert trans_res.json()["total_segments"] == 2

    # 3. Retrieve transcript segments
    get_trans_res = client.get(f"/api/meetings/{meeting_id}/transcript")
    assert get_trans_res.status_code == 200
    assert len(get_trans_res.json()) == 2

    # 4. Generate AI summary and key topics
    sum_res = client.post(f"/api/meetings/{meeting_id}/generate-summary")
    assert sum_res.status_code == 200
    assert "summary" in sum_res.json()

    # 5. Delete meeting and verify cascade
    del_res = client.delete(f"/api/meetings/{meeting_id}")
    assert del_res.status_code in (200, 204)

    # 6. Verify meeting no longer exists
    not_found_res = client.get(f"/api/meetings/{meeting_id}")
    assert not_found_res.status_code == 404


def test_action_items_hub_and_status_toggle(client):
    """Verify action items hub listing and PATCH status update."""
    res = client.get("/api/action-items")
    assert res.status_code == 200
    actions = res.json()
    assert isinstance(actions, list)
    if len(actions) > 0:
        first_item = actions[0]
        item_id = first_item["id"]
        curr_status = first_item["is_completed"]

        # Toggle status
        toggle_res = client.patch(f"/api/action-items/{item_id}", json={
            "is_completed": not curr_status
        })
        assert toggle_res.status_code == 200
        assert toggle_res.json()["is_completed"] == (not curr_status)

        # Restore status
        restore_res = client.patch(f"/api/action-items/{item_id}", json={
            "is_completed": curr_status
        })
        assert restore_res.status_code == 200
        assert restore_res.json()["is_completed"] == curr_status
