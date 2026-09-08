# MeetScribe

**MeetScribe** is an original full-stack Meeting Notes & Transcription Platform engineered with clean, modular, and scalable software architecture.

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Database & ORM**: SQLite with SQLAlchemy 2.0
- **Data Validation**: Pydantic v2
- **Server**: Uvicorn

---

## 📁 Repository Structure

```
meetscribe/
├── frontend/                     # Next.js TypeScript App Router Client
│   ├── src/
│   │   ├── app/                  # Next.js App Router pages and layout
│   │   ├── components/           # UI and Feature Components
│   │   │   ├── layout/           # Shared layout components (Navbar, Sidebar)
│   │   │   ├── ui/               # Reusable primitives (Buttons, Modals, Cards)
│   │   │   └── meetings/         # Meeting-specific feature components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Helper utilities and config
│   │   ├── services/             # API integration client services
│   │   └── types/                # TypeScript interfaces and type definitions
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── backend/                      # FastAPI Python Service
│   ├── app/
│   │   ├── main.py               # FastAPI entrypoint, middleware, health check
│   │   ├── database.py           # SQLAlchemy SQLite connection & session
│   │   ├── models/               # SQLAlchemy ORM models
│   │   ├── schemas/              # Pydantic validation schemas
│   │   ├── routers/              # Modular API route controllers
│   │   ├── services/             # Business logic & transcription engines
│   │   └── seed.py               # Database seed runner
│   ├── requirements.txt          # Python dependencies
│   └── README.md
├── README.md                     # Root project documentation
└── .gitignore
```

---

## 🚀 Getting Started

### 1. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- API Base URL: `http://localhost:8000`
- Health Endpoint: `http://localhost:8000/health`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`

### 2. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

- Web App URL: `http://localhost:3000`

---

## 🔍 Verification & Health Check

The backend provides a dedicated health check route at `/health` (note: the root `/` is not the health check endpoint).

### Production Health Check Endpoint
- **URL**: `https://meetscribe-ai-production.up.railway.app/health`
- **Method**: `GET`
- **Curl Command**:
  ```bash
  curl https://meetscribe-ai-production.up.railway.app/health
  ```
- **Expected Response**:
  ```json
  {"status":"healthy","message":"MeetScribe API is running"}
  ```

### Local Development Health Check
- **URL**: `http://localhost:8000/health`
- **Method**: `GET`
- **Curl Command**:
  ```bash
  curl http://localhost:8000/health
  ```
- **Expected Response**:
  ```json
  {
    "status": "healthy",
    "message": "MeetScribe API is running"
  }
  ```

