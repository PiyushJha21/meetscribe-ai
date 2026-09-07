"""
Database Seeding Script for MeetScribe.
Populates realistic workspace owner, meetings, participants, transcripts,
summaries, key topics, and action items with idempotent execution.
"""

import os
import sys
from datetime import datetime
from typing import Any, Dict, List

# Ensure backend directory is in python search path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import Base, SessionLocal, engine
from app.models import (
    ActionItem,
    KeyTopic,
    Meeting,
    MeetingParticipant,
    MeetingSummary,
    TranscriptSegment,
    User,
)

# Seed Data Definition
SEED_USERS = [
    {
        "display_id": "USR-IND-001",
        "name": "Piyush Kumar Jha",
        "email": "piyush.jha@syncspace.in",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Piyush",
    },
    {
        "display_id": "USR-IND-002",
        "name": "Anshu Kumar",
        "email": "anshu.kumar@syncspace.in",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Anshu",
    },
    {
        "display_id": "USR-IND-003",
        "name": "Rahul Verma",
        "email": "rahul.verma@syncspace.in",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    },
    {
        "display_id": "USR-IND-004",
        "name": "Priya Singh",
        "email": "priya.singh@syncspace.in",
        "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    },
]

# Legacy alias for backward compatibility
SEED_USER = SEED_USERS[0]

SEED_MEETINGS: List[Dict[str, Any]] = [
    # 1. Engineering Sprint Planning
    {
        "meeting_code": "MTG-IND-2026-001",
        "title": "Engineering Sprint Planning",
        "workspace": "Engineering Syncs",
        "meeting_date": datetime(2026, 9, 3, 10, 0, 0),
        "duration_seconds": 68 * 60,  # 4080s
        "participants": [
            {"name": "Piyush Kumar Jha", "email": "piyush.jha@syncspace.in", "role": "Software Engineer"},
            {"name": "Rahul Verma", "email": "rahul.verma@syncspace.in", "role": "Backend Engineer"},
            {"name": "Priya Singh", "email": "priya.singh@syncspace.in", "role": "Frontend Engineer"},
            {"name": "Aman Mishra", "email": "aman.mishra@syncspace.in", "role": "Engineering Manager"},
        ],
        "summary": (
            "The engineering team aligned on Sprint 14 deliverables focusing on the core audio transcription "
            "pipeline and Next.js frontend integration. Rahul presented the FastAPI audio chunking service and "
            "confirmed SQLite concurrency tests passed. Priya reported that the meeting detail UI with Tailwind "
            "is ready for API hookup. Piyush agreed to implement the unified audio streaming websocket endpoint "
            "and assist Priya with optimistic UI updates. Aman emphasized strict testing deadlines for staging "
            "deployment by next Thursday."
        ),
        "topics": [
            {"title": "Sprint goals", "description": "Reviewing story points and prioritizing transcription sync features.", "sequence_number": 1},
            {"title": "API development", "description": "Defining REST and WebSocket contract for live audio transcript streaming.", "sequence_number": 2},
            {"title": "Database integration", "description": "Optimizing SQLite indexing for transcript sequence retrieval.", "sequence_number": 3},
            {"title": "Deployment planning", "description": "Setting up staging container builds and automated health tests.", "sequence_number": 4},
        ],
        "action_items": [
            {"task": "Finalize WebSocket audio streaming endpoint specification in FastAPI", "assignee": "Piyush Kumar Jha", "is_completed": True, "due_date": datetime(2026, 9, 5)},
            {"task": "Implement database migrations and composite indexing for transcript segments", "assignee": "Rahul Verma", "is_completed": True, "due_date": datetime(2026, 9, 6)},
            {"task": "Connect meeting overview dashboard with real-time transcript viewer in Next.js", "assignee": "Priya Singh", "is_completed": False, "due_date": datetime(2026, 9, 8)},
            {"task": "Configure staging deployment pipeline and run end-to-end integration tests", "assignee": "Aman Mishra", "is_completed": False, "due_date": datetime(2026, 9, 10)},
        ],
        "transcripts": [
            {"speaker_name": "Aman Mishra", "start_time": 0, "end_time": 18, "content": "Good morning everyone. Let's kick off our Sprint 14 planning. Our primary objective is finalizing the real-time transcription engine.", "sequence_number": 1},
            {"speaker_name": "Piyush Kumar Jha", "start_time": 19, "end_time": 42, "content": "Thanks Aman. I've mapped out the websocket protocol for bidirectional audio streaming. We will accept 16kHz PCM chunks and broadcast live transcript segments.", "sequence_number": 2},
            {"speaker_name": "Rahul Verma", "start_time": 43, "end_time": 68, "content": "On the backend side, I verified our SQLite configuration with WAL mode and composite indexing on meeting_id and sequence_number. Segment inserts take under 2ms.", "sequence_number": 3},
            {"speaker_name": "Priya Singh", "start_time": 69, "end_time": 95, "content": "From the frontend perspective, the transcript auto-scroll and speaker badge components in Tailwind are complete. I just need the API client models.", "sequence_number": 4},
            {"speaker_name": "Aman Mishra", "start_time": 96, "end_time": 115, "content": "Excellent. What is our estimated velocity for this two-week sprint? Are there any dependencies on external speech-to-text models?", "sequence_number": 5},
            {"speaker_name": "Piyush Kumar Jha", "start_time": 116, "end_time": 145, "content": "We have 42 story points allocated. We are abstracting the transcription engine behind a clean service layer, so we can swap local Whisper with cloud APIs seamlessly.", "sequence_number": 6},
            {"speaker_name": "Rahul Verma", "start_time": 146, "end_time": 170, "content": "I'll also ensure our database cascading rules are tested thoroughly so deleting a meeting cleanly removes participants, topics, and action items.", "sequence_number": 7},
            {"speaker_name": "Priya Singh", "start_time": 171, "end_time": 195, "content": "Can we also add optimistic updates when toggling action item checkboxes in the meeting detail page?", "sequence_number": 8},
            {"speaker_name": "Piyush Kumar Jha", "start_time": 196, "end_time": 220, "content": "Yes, absolutely. We can provide standard PATCH endpoints for action items with instantaneous React state updates.", "sequence_number": 9},
            {"speaker_name": "Aman Mishra", "start_time": 221, "end_time": 245, "content": "Let's review the risk register. What happens if network disconnects occur during an active meeting recording?", "sequence_number": 10},
            {"speaker_name": "Rahul Verma", "start_time": 246, "end_time": 272, "content": "We buffer audio chunks in local browser IndexedDB and perform exponential backoff retries when the connection restores.", "sequence_number": 11},
            {"speaker_name": "Priya Singh", "start_time": 273, "end_time": 298, "content": "I'll add a visual connection status indicator in the top navbar: green for connected, amber for reconnecting.", "sequence_number": 12},
            {"speaker_name": "Piyush Kumar Jha", "start_time": 299, "end_time": 325, "content": "That sounds great. I will draft the Swagger OpenAPI schema today so Priya can start generating typed API client hooks.", "sequence_number": 13},
            {"speaker_name": "Aman Mishra", "start_time": 326, "end_time": 350, "content": "Great initiative. Staging deployment freeze is next Thursday at 5 PM. Let's make sure all PRs have unit test coverage.", "sequence_number": 14},
            {"speaker_name": "Rahul Verma", "start_time": 351, "end_time": 375, "content": "Agreed. I have pytest suites ready for all database CRUD and cascade scenarios.", "sequence_number": 15},
            {"speaker_name": "Priya Singh", "start_time": 376, "end_time": 400, "content": "And Next.js linting and typechecking will run in our CI workflow on every push.", "sequence_number": 16},
        ],
    },

    # 2. Product Roadmap Planning
    {
        "meeting_code": "MTG-IND-2026-002",
        "title": "Product Roadmap Planning",
        "workspace": "Product & Design",
        "meeting_date": datetime(2026, 9, 2, 14, 30, 0),
        "duration_seconds": 52 * 60,  # 3120s
        "participants": [
            {"name": "Ananya Sharma", "email": "ananya.sharma@syncspace.in", "role": "Product Manager"},
            {"name": "Aman Mishra", "email": "aman.mishra@syncspace.in", "role": "Engineering Manager"},
            {"name": "Sneha Gupta", "email": "sneha.gupta@syncspace.in", "role": "UI/UX Designer"},
            {"name": "Piyush Kumar Jha", "email": "piyush.jha@syncspace.in", "role": "Software Engineer"},
        ],
        "summary": (
            "Ananya outlined the Q4 product roadmap for MeetScribe, prioritizing automated AI summaries, "
            "smart action-item extraction, and multi-speaker diarization. Sneha presented user journey mockups "
            "highlighting positive feedback on the clean timeline view. Piyush confirmed technical feasibility "
            "for client-side audio visualizers and server-side summary generation. Aman committed engineering "
            "resources to deliver the MVP beta test with 5 pilot enterprise customers by mid-October."
        ),
        "topics": [
            {"title": "Q4 roadmap", "description": "Defining milestone targets and release schedule for MeetScribe enterprise beta.", "sequence_number": 1},
            {"title": "AI features", "description": "Evaluating LLM prompt architectures for meeting summaries and action extraction.", "sequence_number": 2},
            {"title": "User feedback", "description": "Analyzing pain points from usability test sessions on audio playback.", "sequence_number": 3},
            {"title": "Product priorities", "description": "Ranking core feature requests: speaker tags vs export integrations.", "sequence_number": 4},
        ],
        "action_items": [
            {"task": "Prepare PRD document for AI summary and key topic extraction engine", "assignee": "Ananya Sharma", "is_completed": True, "due_date": datetime(2026, 9, 7)},
            {"task": "Deliver high-fidelity Figma components for audio waveforms and speaker badges", "assignee": "Sneha Gupta", "is_completed": True, "due_date": datetime(2026, 9, 9)},
            {"task": "Benchmark latency and token cost across OpenAI, Anthropic, and open-source models", "assignee": "Piyush Kumar Jha", "is_completed": False, "due_date": datetime(2026, 9, 12)},
            {"task": "Draft Q4 resource capacity plan and sprint allocation breakdown", "assignee": "Aman Mishra", "is_completed": False, "due_date": datetime(2026, 9, 14)},
        ],
        "transcripts": [
            {"speaker_name": "Ananya Sharma", "start_time": 0, "end_time": 25, "content": "Welcome team. Today we are setting the product direction for Q4. Our top value proposition is turning messy meeting recordings into concise, actionable summaries.", "sequence_number": 1},
            {"speaker_name": "Sneha Gupta", "start_time": 26, "end_time": 50, "content": "From our user research with 15 engineering leads, users don't want to read 10-page transcripts; they want 3-bullet executive overviews and clear action item ownership.", "sequence_number": 2},
            {"speaker_name": "Piyush Kumar Jha", "start_time": 51, "end_time": 80, "content": "That aligns perfectly with our technical design. Our database schema already separates MeetingSummary, KeyTopics, and ActionItems with structured relations.", "sequence_number": 3},
            {"speaker_name": "Aman Mishra", "start_time": 81, "end_time": 105, "content": "How are we handling transcription accuracy for Indian accents and technical engineering jargon like Kubernetes and GraphQL?", "sequence_number": 4},
            {"speaker_name": "Ananya Sharma", "start_time": 106, "end_time": 130, "content": "We are adding custom domain vocabulary lists to the transcription prompt payload to drastically reduce phonetic errors.", "sequence_number": 5},
            {"speaker_name": "Sneha Gupta", "start_time": 131, "end_time": 158, "content": "I've also designed a quick inline edit capability in the transcript viewer so users can correct any speaker name or misinterpreted word in one click.", "sequence_number": 6},
            {"speaker_name": "Piyush Kumar Jha", "start_time": 159, "end_time": 185, "content": "That is very clean. We can implement optimistic updates with debounce saving back to SQLite.", "sequence_number": 7},
            {"speaker_name": "Aman Mishra", "start_time": 186, "end_time": 210, "content": "What about export formats? Customers will definitely ask for Markdown, PDF, and Slack sync.", "sequence_number": 8},
            {"speaker_name": "Ananya Sharma", "start_time": 211, "end_time": 235, "content": "Phase 1 will provide copyable Markdown and JSON export. Phase 2 in November will add Webhook triggers for Slack and Notion.", "sequence_number": 9},
            {"speaker_name": "Sneha Gupta", "start_time": 236, "end_time": 260, "content": "I'll prepare the export modal designs with format toggles and preview panes.", "sequence_number": 10},
            {"speaker_name": "Piyush Kumar Jha", "start_time": 261, "end_time": 288, "content": "I can build the markdown generator service in FastAPI; it's straightforward using Jinja2 templates or pure string formatters.", "sequence_number": 11},
            {"speaker_name": "Aman Mishra", "start_time": 289, "end_time": 312, "content": "What is our target date for the closed pilot with our first enterprise customer batch?", "sequence_number": 12},
            {"speaker_name": "Ananya Sharma", "start_time": 313, "end_time": 338, "content": "October 15th is our launch target. We will start with 5 companies and iterate on daily active usage.", "sequence_number": 13},
            {"speaker_name": "Piyush Kumar Jha", "start_time": 339, "end_time": 362, "content": "The backend and database architecture will easily handle that volume. We are in solid shape.", "sequence_number": 14},
            {"speaker_name": "Aman Mishra", "start_time": 363, "end_time": 385, "content": "Great meeting everyone. Let's document all action items and review progress on Friday.", "sequence_number": 15},
        ],
    },

    # 3. UI/UX Design Review
    {
        "meeting_code": "MTG-IND-2026-003",
        "title": "UI/UX Design Review",
        "workspace": "Product & Design",
        "meeting_date": datetime(2026, 9, 4, 11, 0, 0),
        "duration_seconds": 43 * 60,  # 2580s
        "participants": [
            {"name": "Sneha Gupta", "email": "sneha.gupta@syncspace.in", "role": "UI/UX Designer"},
            {"name": "Priya Singh", "email": "priya.singh@syncspace.in", "role": "Frontend Engineer"},
            {"name": "Ananya Sharma", "email": "ananya.sharma@syncspace.in", "role": "Product Manager"},
        ],
        "summary": (
            "Sneha walked through the updated design system and component hierarchy for MeetScribe. "
            "Priya validated Tailwind CSS tokens, typography scales with Inter, and dark mode color contrast. "
            "Ananya confirmed the layout improvements on the meeting detail screen, specifically the side-by-side "
            "transcript and summary panels. The team approved the responsive mobile breakpoint specs and "
            "micro-interaction states for audio playback controls."
        ),
        "topics": [
            {"title": "Dashboard experience", "description": "Reviewing meeting list cards, metrics badges, and search filtering.", "sequence_number": 1},
            {"title": "Meeting workspace", "description": "Fine-tuning split layout for transcript stream and AI summary drawer.", "sequence_number": 2},
            {"title": "Responsive design", "description": "Testing mobile drawer collapse and responsive tablet navigation.", "sequence_number": 3},
            {"title": "Design system", "description": "Standardizing Lucide icons, badge status variants, and button states.", "sequence_number": 4},
        ],
        "action_items": [
            {"task": "Publish updated Tailwind theme configuration and CSS variables to frontend repository", "assignee": "Sneha Gupta", "is_completed": True, "due_date": datetime(2026, 9, 6)},
            {"task": "Implement Lucide icon consistency across meeting cards and action item badges", "assignee": "Priya Singh", "is_completed": True, "due_date": datetime(2026, 9, 7)},
            {"task": "Build accessible keyboard navigation for timestamped transcript jumping", "assignee": "Priya Singh", "is_completed": False, "due_date": datetime(2026, 9, 10)},
            {"task": "Review accessibility contrast ratios (WCAG AAA) on dark mode slate palette", "assignee": "Ananya Sharma", "is_completed": False, "due_date": datetime(2026, 9, 11)},
        ],
        "transcripts": [
            {"speaker_name": "Sneha Gupta", "start_time": 0, "end_time": 22, "content": "Hi Priya and Ananya. Today we're reviewing the MeetScribe design tokens, dark theme color harmony, and workspace layout.", "sequence_number": 1},
            {"speaker_name": "Priya Singh", "start_time": 23, "end_time": 45, "content": "The slate and indigo palette looks incredible. I especially love the subtle radial background glow and glassmorphism cards.", "sequence_number": 2},
            {"speaker_name": "Ananya Sharma", "start_time": 46, "end_time": 72, "content": "How does the layout adapt when users view a long 90-minute transcript on smaller 13-inch laptop screens?", "sequence_number": 3},
            {"speaker_name": "Sneha Gupta", "start_time": 73, "end_time": 100, "content": "We use an independent scroll container for the transcript segment list while keeping the summary, key topics, and action items pinned on the right.", "sequence_number": 4},
            {"speaker_name": "Priya Singh", "start_time": 101, "end_time": 128, "content": "That works cleanly with CSS grid (`grid-cols-12`) and sticky top positioning. It prevents full page scroll fatigue.", "sequence_number": 5},
            {"speaker_name": "Sneha Gupta", "start_time": 129, "end_time": 154, "content": "For mobile screens, we collapse the summary into a swipeable bottom drawer or tab switcher between Transcript and Insights.", "sequence_number": 6},
            {"speaker_name": "Ananya Sharma", "start_time": 155, "end_time": 180, "content": "That will make the mobile experience feel like a native mobile app. Are all Lucide icons finalized?", "sequence_number": 7},
            {"speaker_name": "Sneha Gupta", "start_time": 181, "end_time": 205, "content": "Yes, we are using `Mic`, `Sparkles`, `Clock`, `Calendar`, `Users`, `CheckCircle2`, and `FileText` consistently.", "sequence_number": 8},
            {"speaker_name": "Priya Singh", "start_time": 206, "end_time": 230, "content": "I've already organized our components into `src/components/ui/`, `components/layout/`, and `components/meetings/`.", "sequence_number": 9},
            {"speaker_name": "Sneha Gupta", "start_time": 231, "end_time": 255, "content": "Awesome structure! Let's ensure hover micro-animations on meeting cards have smooth 200ms ease-in-out transitions.", "sequence_number": 10},
            {"speaker_name": "Priya Singh", "start_time": 256, "end_time": 280, "content": "Definitely. I'll also add subtle pulse animations to the active audio playback seeker.", "sequence_number": 11},
            {"speaker_name": "Ananya Sharma", "start_time": 281, "end_time": 305, "content": "Everything looks approved. Great work team, let's start implementing the React components.", "sequence_number": 12},
        ],
    },

    # 4. Weekly Project Review
    {
        "meeting_code": "MTG-IND-2026-004",
        "title": "Weekly Project Review",
        "workspace": "Engineering Syncs",
        "meeting_date": datetime(2026, 9, 5, 16, 0, 0),
        "duration_seconds": 36 * 60,  # 2160s
        "participants": [
            {"name": "Aman Mishra", "email": "aman.mishra@syncspace.in", "role": "Engineering Manager"},
            {"name": "Piyush Kumar Jha", "email": "piyush.jha@syncspace.in", "role": "Software Engineer"},
            {"name": "Rahul Verma", "email": "rahul.verma@syncspace.in", "role": "Backend Engineer"},
            {"name": "Priya Singh", "email": "priya.singh@syncspace.in", "role": "Frontend Engineer"},
        ],
        "summary": (
            "Aman conducted the weekly status review to evaluate engineering velocity and unblock team members. "
            "Piyush demonstrated the newly structured SQLite database layer with all seven SQLAlchemy models "
            "and cascade deletion support. Rahul confirmed FastAPI performance benchmarks, showing 200 req/sec "
            "with zero latency degradation. Priya confirmed frontend folder structure readiness. The project "
            "is ahead of schedule with zero critical blockers."
        ),
        "topics": [
            {"title": "Project progress", "description": "Review of milestone checklist across database, backend, and frontend.", "sequence_number": 1},
            {"title": "Technical blockers", "description": "Addressing SQLite concurrent write locks and async connection pool.", "sequence_number": 2},
            {"title": "Deadlines", "description": "Tracking upcoming deliverable dates for API CRUD controllers.", "sequence_number": 3},
            {"title": "Deliverables", "description": "Validating full-stack build integrity and documentation completeness.", "sequence_number": 4},
        ],
        "action_items": [
            {"task": "Document database relationship diagrams in repository README", "assignee": "Piyush Kumar Jha", "is_completed": True, "due_date": datetime(2026, 9, 6)},
            {"task": "Prepare seed data script with idempotent execution for all 8 standard meetings", "assignee": "Rahul Verma", "is_completed": True, "due_date": datetime(2026, 9, 7)},
            {"task": "Validate CORS headers and frontend proxy configuration", "assignee": "Priya Singh", "is_completed": False, "due_date": datetime(2026, 9, 8)},
            {"task": "Schedule technical walkthrough presentation for stakeholders", "assignee": "Aman Mishra", "is_completed": False, "due_date": datetime(2026, 9, 9)},
        ],
        "transcripts": [
            {"speaker_name": "Aman Mishra", "start_time": 0, "end_time": 20, "content": "Welcome everyone to our Friday sync. Let's do a quick round of status updates and check if anyone has blockers.", "sequence_number": 1},
            {"speaker_name": "Piyush Kumar Jha", "start_time": 21, "end_time": 48, "content": "Database foundation is 100% complete. All seven models—User, Meeting, Participant, TranscriptSegment, MeetingSummary, KeyTopic, and ActionItem—are verified.", "sequence_number": 2},
            {"speaker_name": "Rahul Verma", "start_time": 49, "end_time": 74, "content": "I verified foreign key enforcement and cascade deletes with SQLite PRAGMA. Deleting a test meeting cleanly cleans up all related records.", "sequence_number": 3},
            {"speaker_name": "Priya Singh", "start_time": 75, "end_time": 98, "content": "Frontend setup is also verified. Next.js 16 build is passing, Tailwind CSS is configured, and directory structures are in place.", "sequence_number": 4},
            {"speaker_name": "Aman Mishra", "start_time": 99, "end_time": 122, "content": "That is tremendous progress for week one. Are there any concurrency concerns with SQLite if multiple transcripts write simultaneously?", "sequence_number": 5},
            {"speaker_name": "Piyush Kumar Jha", "start_time": 123, "end_time": 150, "content": "We set `check_same_thread=False` and use transactional sessions per request. For single-server deployment, it is rock solid and blisteringly fast.", "sequence_number": 6},
            {"speaker_name": "Rahul Verma", "start_time": 151, "end_time": 175, "content": "And we will prepare an idempotent seed script so developers can populate rich demo data with one command.", "sequence_number": 7},
            {"speaker_name": "Priya Singh", "start_time": 176, "end_time": 200, "content": "That will make building and testing the frontend UI components so much faster with realistic meeting topics.", "sequence_number": 8},
            {"speaker_name": "Aman Mishra", "start_time": 201, "end_time": 224, "content": "What is our plan for Monday? We will start implementing the REST API endpoints, correct?", "sequence_number": 9},
            {"speaker_name": "Piyush Kumar Jha", "start_time": 225, "end_time": 250, "content": "Yes, we will create Pydantic schemas first, followed by clean router modules for meetings, transcripts, and action items.", "sequence_number": 10},
            {"speaker_name": "Aman Mishra", "start_time": 251, "end_time": 270, "content": "Sounds like a solid game plan. Enjoy the weekend team, outstanding work this week.", "sequence_number": 11},
            {"speaker_name": "Priya Singh", "start_time": 271, "end_time": 290, "content": "Thanks Aman! Have a great weekend everyone.", "sequence_number": 12},
        ],
    },

    # 5. Client Requirements Discussion
    {
        "meeting_code": "MTG-IND-2026-005",
        "title": "Client Requirements Discussion",
        "workspace": "Client Reviews",
        "meeting_date": datetime(2026, 8, 30, 15, 0, 0),
        "duration_seconds": 75 * 60,  # 4500s
        "participants": [
            {"name": "Ananya Sharma", "email": "ananya.sharma@syncspace.in", "role": "Product Manager"},
            {"name": "Aman Mishra", "email": "aman.mishra@syncspace.in", "role": "Engineering Manager"},
            {"name": "Rohan Kapoor", "email": "rohan.kapoor@clientcorp.in", "role": "Client Representative"},
            {"name": "Neha Agarwal", "email": "neha.agarwal@syncspace.in", "role": "Business Analyst"},
        ],
        "summary": (
            "Rohan Kapoor from ClientCorp shared their enterprise requirements for adopting MeetScribe across "
            "their 250-person consulting division. Key client demands include sub-second keyword search across "
            "historical transcripts, strict data privacy isolation, and automated meeting action-item sync with "
            "Jira and Notion. Ananya confirmed feature alignment with our Q4 roadmap. Aman provided architecture "
            "guarantees on zero external data retention without user consent, satisfying compliance requirements."
        ),
        "topics": [
            {"title": "Client requirements", "description": "Reviewing security compliance, transcription latency SLA, and user seat tiers.", "sequence_number": 1},
            {"title": "Feature priorities", "description": "Prioritizing full-text search and automated action item assignment.", "sequence_number": 2},
            {"title": "Timeline", "description": "Establishing 6-week pilot schedule starting mid-September.", "sequence_number": 3},
            {"title": "Budget", "description": "Discussing annual enterprise license terms and dedicated support tiers.", "sequence_number": 4},
        ],
        "action_items": [
            {"task": "Draft detailed Statement of Work (SOW) reflecting enterprise SLA terms", "assignee": "Neha Agarwal", "is_completed": True, "due_date": datetime(2026, 9, 3)},
            {"task": "Provide SOC2 and GDPR compliance data sheet to ClientCorp legal team", "assignee": "Aman Mishra", "is_completed": True, "due_date": datetime(2026, 9, 4)},
            {"task": "Configure sandboxed demonstration environment with custom domain", "assignee": "Ananya Sharma", "is_completed": False, "due_date": datetime(2026, 9, 8)},
            {"task": "Finalize enterprise pricing quote and payment milestone schedule", "assignee": "Rohan Kapoor", "is_completed": False, "due_date": datetime(2026, 9, 12)},
        ],
        "transcripts": [
            {"speaker_name": "Ananya Sharma", "start_time": 0, "end_time": 25, "content": "Good afternoon Rohan. We are excited to walk you through MeetScribe and understand ClientCorp's specific requirements.", "sequence_number": 1},
            {"speaker_name": "Rohan Kapoor", "start_time": 26, "end_time": 58, "content": "Thank you Ananya. Our consulting teams conduct over 40 client calls daily. Our biggest bottleneck is losing track of agreements, action items, and decision rationale.", "sequence_number": 2},
            {"speaker_name": "Neha Agarwal", "start_time": 59, "end_time": 88, "content": "That is exactly what MeetScribe solves. We structure every recorded session into executive overviews, key discussion topics, and assigned action items.", "sequence_number": 3},
            {"speaker_name": "Rohan Kapoor", "start_time": 89, "end_time": 120, "content": "Data privacy is our number one priority. Our client NDAs forbid sharing proprietary discussions with third-party model training datasets.", "sequence_number": 4},
            {"speaker_name": "Aman Mishra", "start_time": 121, "end_time": 150, "content": "We operate with zero data retention on LLM API endpoints and can deploy local models inside your private virtual cloud if desired.", "sequence_number": 5},
            {"speaker_name": "Rohan Kapoor", "start_time": 151, "end_time": 178, "content": "That is fantastic to hear. What is your search capability when an account manager wants to find when a client mentioned 'contract renewal' last month?", "sequence_number": 6},
            {"speaker_name": "Ananya Sharma", "start_time": 179, "end_time": 208, "content": "Every transcript segment is indexed with timestamp coordinates. A single search query will highlight the exact audio second and sentence.", "sequence_number": 7},
            {"speaker_name": "Neha Agarwal", "start_time": 209, "end_time": 235, "content": "And action items can be filtered across all meetings by assignee, completion status, or due date.", "sequence_number": 8},
            {"speaker_name": "Rohan Kapoor", "start_time": 236, "end_time": 262, "content": "Can action items be exported to Jira or CSV for our weekly PMO audits?", "sequence_number": 9},
            {"speaker_name": "Aman Mishra", "start_time": 263, "end_time": 288, "content": "Yes, we support structured JSON, CSV, and formatted Markdown exports out of the box.", "sequence_number": 10},
            {"speaker_name": "Rohan Kapoor", "start_time": 289, "end_time": 315, "content": "What is the expected rollout timeline for a 50-user pilot group?", "sequence_number": 11},
            {"speaker_name": "Ananya Sharma", "start_time": 316, "end_time": 342, "content": "We can have your pilot sandbox provisioned within 10 business days after SOW execution.", "sequence_number": 12},
            {"speaker_name": "Neha Agarwal", "start_time": 343, "end_time": 368, "content": "I will prepare the SOW and feature matrix by Thursday for your review.", "sequence_number": 13},
            {"speaker_name": "Rohan Kapoor", "start_time": 369, "end_time": 395, "content": "Terrific. If the pilot succeeds, we will look at enterprise licensing for all 250 consultants across India and Singapore.", "sequence_number": 14},
            {"speaker_name": "Aman Mishra", "start_time": 396, "end_time": 420, "content": "We look forward to partnering with ClientCorp. Thank you for your time today, Rohan.", "sequence_number": 15},
        ],
    },

    # 6. Daily Engineering Standup
    {
        "meeting_code": "MTG-IND-2026-006",
        "title": "Daily Engineering Standup",
        "workspace": "Engineering Syncs",
        "meeting_date": datetime(2026, 9, 6, 9, 30, 0),
        "duration_seconds": 24 * 60,  # 1440s
        "participants": [
            {"name": "Piyush Kumar Jha", "email": "piyush.jha@syncspace.in", "role": "Software Engineer"},
            {"name": "Rahul Verma", "email": "rahul.verma@syncspace.in", "role": "Backend Engineer"},
            {"name": "Priya Singh", "email": "priya.singh@syncspace.in", "role": "Frontend Engineer"},
        ],
        "summary": (
            "The engineering team conducted their daily morning standup. Piyush finalized the database schema "
            "and cascade verification scripts. Rahul finished the idempotent seed data architecture with realistic "
            "Indian enterprise context. Priya completed the UI wireframe mapping and Lucide icon integrations. "
            "No active blockers were reported, and the team is aligned for Step 4 API endpoint implementation."
        ),
        "topics": [
            {"title": "Yesterday's work", "description": "Reviewing database model implementation, test client checks, and folder architecture.", "sequence_number": 1},
            {"title": "Today's tasks", "description": "Executing database seed script, testing data integrity, and preparing API contracts.", "sequence_number": 2},
            {"title": "Blockers", "description": "Confirming zero technical blockers across frontend and backend environments.", "sequence_number": 3},
        ],
        "action_items": [
            {"task": "Run database seed script and verify record counts across all 7 SQLite tables", "assignee": "Piyush Kumar Jha", "is_completed": True, "due_date": datetime(2026, 9, 6)},
            {"task": "Draft Pydantic request/response schemas for Meeting and Transcript endpoints", "assignee": "Rahul Verma", "is_completed": False, "due_date": datetime(2026, 9, 7)},
            {"task": "Build mock meeting card feed component in Next.js frontend", "assignee": "Priya Singh", "is_completed": False, "due_date": datetime(2026, 9, 7)},
        ],
        "transcripts": [
            {"speaker_name": "Piyush Kumar Jha", "start_time": 0, "end_time": 18, "content": "Good morning team! Let's do a quick standup. Yesterday I completed the SQLAlchemy database layer and verified SQLite foreign key cascades.", "sequence_number": 1},
            {"speaker_name": "Piyush Kumar Jha", "start_time": 19, "end_time": 35, "content": "Today I'm implementing the comprehensive seed script with 8 realistic meetings and full conversational transcripts. No blockers.", "sequence_number": 2},
            {"speaker_name": "Rahul Verma", "start_time": 36, "end_time": 60, "content": "Morning! Yesterday I validated SQLite performance and composite indexing. Today I'm drafting Pydantic v2 schemas for meetings and nested relationships.", "sequence_number": 3},
            {"speaker_name": "Rahul Verma", "start_time": 61, "end_time": 78, "content": "I will make sure schemas support full nested serialization for the meeting detail view. Zero blockers.", "sequence_number": 4},
            {"speaker_name": "Priya Singh", "start_time": 79, "end_time": 105, "content": "Good morning! Yesterday I configured Tailwind CSS tokens, Lucide icons, and verified the Next.js production build.", "sequence_number": 5},
            {"speaker_name": "Priya Singh", "start_time": 106, "end_time": 128, "content": "Today I'm building out the reusable UI primitives like badges, buttons, and card containers so we can rapidly plug in the API data.", "sequence_number": 6},
            {"speaker_name": "Piyush Kumar Jha", "start_time": 129, "end_time": 150, "content": "Sounds great. Once the seed script finishes running, we will have 8 complete meetings with rich data ready for frontend testing.", "sequence_number": 7},
            {"speaker_name": "Rahul Verma", "start_time": 151, "end_time": 170, "content": "Awesome. That will give us a very smooth transition to Step 4. Let's get to it!", "sequence_number": 8},
            {"speaker_name": "Priya Singh", "start_time": 171, "end_time": 190, "content": "Let's do it. Have a productive day everyone!", "sequence_number": 9},
            {"speaker_name": "Piyush Kumar Jha", "start_time": 191, "end_time": 210, "content": "Thanks team, talk soon.", "sequence_number": 10},
        ],
    },

    # 7. Backend Architecture Discussion
    {
        "meeting_code": "MTG-IND-2026-007",
        "title": "Backend Architecture Discussion",
        "workspace": "Engineering Syncs",
        "meeting_date": datetime(2026, 9, 1, 16, 30, 0),
        "duration_seconds": 58 * 60,  # 3480s
        "participants": [
            {"name": "Rahul Verma", "email": "rahul.verma@syncspace.in", "role": "Backend Engineer"},
            {"name": "Piyush Kumar Jha", "email": "piyush.jha@syncspace.in", "role": "Software Engineer"},
            {"name": "Aman Mishra", "email": "aman.mishra@syncspace.in", "role": "Engineering Manager"},
        ],
        "summary": (
            "Deep-dive technical session focused on backend architectural patterns, error handling conventions, "
            "and SQLAlchemy relationship cascades. Piyush detailed why strict 1-to-1 unique constraints on MeetingSummary "
            "prevent orphan summaries. Rahul outlined the Pydantic schema validation strategy with explicit "
            "request/response DTO separation. Aman approved the modular router design isolating meetings, transcripts, "
            "and action item controllers."
        ),
        "topics": [
            {"title": "API architecture", "description": "Designing clean separation between routers, services, and repository layers.", "sequence_number": 1},
            {"title": "Database relationships", "description": "Configuring 1-to-many and 1-to-1 cascades with SQLite PRAGMA enforcement.", "sequence_number": 2},
            {"title": "Scalability", "description": "Planning query optimization, eager loading (`joinedload`), and pagination.", "sequence_number": 3},
            {"title": "Error handling", "description": "Standardizing HTTPException responses and custom exception handlers.", "sequence_number": 4},
        ],
        "action_items": [
            {"task": "Configure global FastAPI exception handlers for validation and not-found errors", "assignee": "Rahul Verma", "is_completed": True, "due_date": datetime(2026, 9, 3)},
            {"task": "Implement SQLAlchemy `joinedload` queries to eliminate N+1 query patterns", "assignee": "Piyush Kumar Jha", "is_completed": True, "due_date": datetime(2026, 9, 4)},
            {"task": "Write OpenAPI docstrings and example payloads for all REST routes", "assignee": "Rahul Verma", "is_completed": False, "due_date": datetime(2026, 9, 7)},
            {"task": "Review API security guidelines including rate limiting and input sanitization", "assignee": "Aman Mishra", "is_completed": False, "due_date": datetime(2026, 9, 8)},
        ],
        "transcripts": [
            {"speaker_name": "Aman Mishra", "start_time": 0, "end_time": 22, "content": "Let's dive into our backend architecture review. Piyush and Rahul, walk us through the core design decisions for MeetScribe.", "sequence_number": 1},
            {"speaker_name": "Piyush Kumar Jha", "start_time": 23, "end_time": 52, "content": "Our goal is clean, modular, interview-ready architecture. We separated models, schemas, routers, and services so each layer has a single responsibility.", "sequence_number": 2},
            {"speaker_name": "Rahul Verma", "start_time": 53, "end_time": 80, "content": "In `database.py`, we explicitly configure SQLite with `check_same_thread=False` and attach an event listener for `PRAGMA foreign_keys=ON;`.", "sequence_number": 3},
            {"speaker_name": "Aman Mishra", "start_time": 81, "end_time": 105, "content": "Why is the PRAGMA listener necessary if SQLAlchemy ORM already has `cascade='all, delete-orphan'`?", "sequence_number": 4},
            {"speaker_name": "Piyush Kumar Jha", "start_time": 106, "end_time": 138, "content": "Great question. SQLAlchemy ORM cascade works when objects are loaded in python memory. The SQLite PRAGMA guarantees that raw SQL queries or bulk deletes also enforce cascading at the database engine level.", "sequence_number": 5},
            {"speaker_name": "Aman Mishra", "start_time": 139, "end_time": 158, "content": "Excellent answer. That shows deep understanding of both ORM and database engine semantics.", "sequence_number": 6},
            {"speaker_name": "Rahul Verma", "start_time": 159, "end_time": 185, "content": "For MeetingSummary, we enforced `unique=True` on `meeting_id`. That guarantees a strict 1-to-1 relationship and prevents duplicate summaries.", "sequence_number": 7},
            {"speaker_name": "Piyush Kumar Jha", "start_time": 186, "end_time": 215, "content": "For TranscriptSegment, we added a composite index on `(meeting_id, sequence_number)`. This ensures chronologically sorted transcripts are fetched with index seek rather than full table scan.", "sequence_number": 8},
            {"speaker_name": "Aman Mishra", "start_time": 216, "end_time": 240, "content": "How do we prevent N+1 queries when fetching a meeting and its participants, topics, and action items?", "sequence_number": 9},
            {"speaker_name": "Rahul Verma", "start_time": 241, "end_time": 268, "content": "We use SQLAlchemy's `joinedload` or `selectinload` in our repository query so all child entities load in a single optimized query.", "sequence_number": 10},
            {"speaker_name": "Piyush Kumar Jha", "start_time": 269, "end_time": 296, "content": "And on the schema side, Pydantic v2 `from_attributes = True` allows automatic serialization directly from SQLAlchemy ORM instances.", "sequence_number": 11},
            {"speaker_name": "Aman Mishra", "start_time": 297, "end_time": 320, "content": "What is our standardized error response format when an entity is not found?", "sequence_number": 12},
            {"speaker_name": "Rahul Verma", "start_time": 321, "end_time": 348, "content": "FastAPI `HTTPException(status_code=404, detail='Meeting with code {code} not found')` providing clear human-readable messages.", "sequence_number": 13},
            {"speaker_name": "Piyush Kumar Jha", "start_time": 349, "end_time": 372, "content": "And CORS is configured specifically for `http://localhost:3000` to allow seamless local development with Next.js.", "sequence_number": 14},
            {"speaker_name": "Aman Mishra", "start_time": 373, "end_time": 395, "content": "Architectural review is fully approved. Let's document these decisions in our technical README.", "sequence_number": 15},
        ],
    },

    # 8. Quarterly Team Retrospective
    {
        "meeting_code": "MTG-IND-2026-008",
        "title": "Quarterly Team Retrospective",
        "workspace": "Client Reviews",
        "meeting_date": datetime(2026, 8, 28, 17, 0, 0),
        "duration_seconds": 65 * 60,  # 3900s
        "participants": [
            {"name": "Aman Mishra", "email": "aman.mishra@syncspace.in", "role": "Engineering Manager"},
            {"name": "Ananya Sharma", "email": "ananya.sharma@syncspace.in", "role": "Product Manager"},
            {"name": "Piyush Kumar Jha", "email": "piyush.jha@syncspace.in", "role": "Software Engineer"},
            {"name": "Priya Singh", "email": "priya.singh@syncspace.in", "role": "Frontend Engineer"},
            {"name": "Rahul Verma", "email": "rahul.verma@syncspace.in", "role": "Backend Engineer"},
            {"name": "Sneha Gupta", "email": "sneha.gupta@syncspace.in", "role": "UI/UX Designer"},
        ],
        "summary": (
            "The full product and engineering team celebrated the successful completion of Q3 deliverables, "
            "including the initial prototype of MeetScribe. Retrospective highlights included high frontend-backend "
            "synergy and rapid UI prototyping. Key areas for improvement centered around earlier API contract "
            "freezes and automated end-to-end testing. Next quarter goals prioritize enterprise feature readiness, "
            "live audio transcription, and SOC2 compliance."
        ),
        "topics": [
            {"title": "What went well", "description": "Strong cross-functional collaboration, clean architectural foundations, and fast iteration.", "sequence_number": 1},
            {"title": "Challenges", "description": "Managing scope adjustments and mock data synchronization across time zones.", "sequence_number": 2},
            {"title": "Process improvements", "description": "Adopting OpenAPI-first contracts and automated GitHub CI testing.", "sequence_number": 3},
            {"title": "Next quarter goals", "description": "Targeting 99.9% uptime SLA, sub-2s summary generation, and enterprise pilot launches.", "sequence_number": 4},
        ],
        "action_items": [
            {"task": "Set up automated PR preview environments and GitHub Actions CI workflow", "assignee": "Aman Mishra", "is_completed": True, "due_date": datetime(2026, 9, 2)},
            {"task": "Establish weekly design-engineering office hours for rapid component reviews", "assignee": "Sneha Gupta", "is_completed": True, "due_date": datetime(2026, 9, 3)},
            {"task": "Create end-to-end mock data generator for performance load testing", "assignee": "Piyush Kumar Jha", "is_completed": True, "due_date": datetime(2026, 9, 5)},
            {"task": "Draft Q4 product OKRs and circulate for executive alignment", "assignee": "Ananya Sharma", "is_completed": False, "due_date": datetime(2026, 9, 8)},
        ],
        "transcripts": [
            {"speaker_name": "Aman Mishra", "start_time": 0, "end_time": 25, "content": "Welcome everyone to our Q3 team retrospective! Let's celebrate our achievements and openly discuss how we can improve our engineering processes.", "sequence_number": 1},
            {"speaker_name": "Ananya Sharma", "start_time": 341, "end_time": 368, "content": "Deliver our 5-client enterprise pilot, achieve sub-2 second summary generation, and launch our public beta.", "sequence_number": 14},
            {"speaker_name": "Aman Mishra", "start_time": 369, "end_time": 395, "content": "Incredible energy everyone. Thank you for your hard work and dedication. Let's make Q4 our best quarter yet!", "sequence_number": 15},
        ],
    },
]


def seed_default_users(db: Session) -> List[User]:
    """
    Idempotently seed default workspace users.
    Ensures Piyush Kumar Jha (owner) and Anshu Kumar exist.
    """
    seeded_users = []
    for user_data in SEED_USERS:
        existing = db.query(User).filter(
            (User.email == user_data["email"]) | (User.display_id == user_data["display_id"])
        ).first()

        if not existing:
            user = User(
                display_id=user_data["display_id"],
                name=user_data["name"],
                email=user_data["email"],
                avatar_url=user_data["avatar_url"],
                created_at=datetime(2026, 8, 1, 9, 0, 0),
            )
            db.add(user)
            db.flush()
            seeded_users.append(user)
            print(f"✓ Created sample user (ID={user.id}): {user.name} ({user.email})")
        else:
            seeded_users.append(existing)
            print(f"ℹ Sample user already exists (ID={existing.id}): {existing.name} ({existing.email})")

    db.commit()
    return seeded_users


def seed_database(db: Session) -> Dict[str, Any]:
    """
    Idempotent database seeder.
    Creates default users and realistic meetings with participants,
    transcripts, summaries, topics, and action items.
    """
    results: Dict[str, Any] = {
        "users_seeded": 0,
        "meetings_created": 0,
        "meetings_skipped": 0,
    }

    # 1. Idempotently seed default users
    users = seed_default_users(db)
    owner = users[0]
    results["users_seeded"] = len(users)

    # 2. Idempotently seed each meeting
    for mtg_data in SEED_MEETINGS:
        code = mtg_data["meeting_code"]
        existing_meeting = db.query(Meeting).filter(Meeting.meeting_code == code).first()

        if existing_meeting:
            if "workspace" in mtg_data and existing_meeting.workspace != mtg_data["workspace"]:
                existing_meeting.workspace = mtg_data["workspace"]
            results["meetings_skipped"] += 1
            print(f"ℹ Meeting '{code}' ({mtg_data['title']}) already exists. Synced workspace.")
            continue

        # Create Meeting
        meeting = Meeting(
            meeting_code=code,
            title=mtg_data["title"],
            workspace=mtg_data.get("workspace", "Engineering Syncs"),
            meeting_date=mtg_data["meeting_date"],
            duration_seconds=mtg_data["duration_seconds"],
            created_at=mtg_data["meeting_date"],
            updated_at=mtg_data["meeting_date"],
            owner_id=owner.id,
        )
        db.add(meeting)
        db.flush()  # Obtain meeting.id for child records

        # Create Participants
        for p in mtg_data["participants"]:
            participant = MeetingParticipant(
                meeting_id=meeting.id,
                name=p["name"],
                email=p["email"],
                role=p["role"],
            )
            db.add(participant)

        # Create Meeting Summary (1-to-1)
        summary = MeetingSummary(
            meeting_id=meeting.id,
            overview=mtg_data["summary"],
            created_at=mtg_data["meeting_date"],
            updated_at=mtg_data["meeting_date"],
        )
        db.add(summary)

        # Create Key Topics
        for t in mtg_data["topics"]:
            topic = KeyTopic(
                meeting_id=meeting.id,
                title=t["title"],
                description=t["description"],
                sequence_number=t["sequence_number"],
            )
            db.add(topic)

        # Create Action Items
        for a in mtg_data["action_items"]:
            action_item = ActionItem(
                meeting_id=meeting.id,
                task=a["task"],
                assignee=a["assignee"],
                is_completed=a["is_completed"],
                due_date=a.get("due_date"),
                created_at=mtg_data["meeting_date"],
                updated_at=mtg_data["meeting_date"],
            )
            db.add(action_item)

        # Create Transcript Segments
        for seg in mtg_data["transcripts"]:
            transcript_seg = TranscriptSegment(
                meeting_id=meeting.id,
                speaker_name=seg["speaker_name"],
                start_time=seg["start_time"],
                end_time=seg["end_time"],
                content=seg["content"],
                sequence_number=seg["sequence_number"],
            )
            db.add(transcript_seg)

        results["meetings_created"] += 1
        print(f"✓ Seeded Meeting '{code}': {mtg_data['title']} ({len(mtg_data['transcripts'])} transcripts, {len(mtg_data['action_items'])} actions)")

    db.commit()
    return results


def run_seed():
    """CLI execution entrypoint for seeding."""
    print("=" * 60)
    print("MeetScribe Database Seeder - Initializing...")
    print("=" * 60)

    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        results = seed_database(db)
        print("-" * 60)
        print(f"Seeding Complete! Created {results['meetings_created']} meetings, Skipped {results['meetings_skipped']} existing.")
        print("=" * 60)
    except Exception as e:
        db.rollback()
        print(f"❌ Error during database seeding: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
