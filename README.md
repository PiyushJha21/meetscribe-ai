# MeetScribe

**MeetScribe** is an intelligent full-stack Meeting Intelligence, Transcription, and Action Item Workspace engineered with a modern Next.js 16 (App Router) TypeScript frontend, a FastAPI Python backend, and a production-grade PostgreSQL database with SQLAlchemy 2.0 ORM and Alembic migrations.

---

## 🏗️ Architecture & Tech Stack

### Frontend Client
- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: Bearer Token Auth Context & Protected Route Guards
- **Interactive Tour**: Global `TourProvider` with element-level spotlight highlighting and auto-step synchronization

### Backend Service
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.9+)
- **Database & ORM**: PostgreSQL 16 via SQLAlchemy 2.0 (with connection pooling)
- **Database Driver**: `psycopg2-binary`
- **Schema Migrations**: Alembic
- **Validation**: Pydantic v2 & Pydantic-Settings
- **Authentication**: PBKDF2-HMAC-SHA256 password hashing & HMAC-SHA256 signed bearer tokens
- **Server**: Uvicorn

---

## 🔐 Demo Credentials & Authentication

MeetScribe enforces backend token validation and protected routes. Unauthenticated requests to workspace pages (`/dashboard`, `/meetings`, `/meetings/[id]`, `/new-meeting`, `/action-items`, `/settings`) are intercepted and redirected to `/login`.

### Pre-Configured Demo Account
- **Email**: `piyush.jha@syncspace.in`
- **Password**: `MeetScribe2026!`
- **Role**: Workspace Owner (`USR-IND-001`, Piyush Kumar Jha)

### Key Authentication & Navigation Behaviors
1. **1-Click Auto-Fill**: On `/login`, click **Auto-Fill Demo** to populate mock credentials instantly.
2. **Backend Validation**: Submitting invalid credentials returns `401 Unauthorized` with an error banner.
3. **Session Persistence**: Sessions persist via Bearer tokens in `localStorage` and re-verify against `GET /api/auth/me` on reload.
4. **Sign Out**: Visible **Sign Out** buttons in both Topbar and Sidebar clear auth state and redirect to `/login`.
5. **Sign Up Status**: Sign Up displays a "Coming Soon" modal without navigating to broken pages.
6. **Guided Product Tour**: Clicking **Request Demo** on the landing page launches a 7-step guided walkthrough beginning with login guidance and navigating through all live workspace features.

---

## ⚙️ Environment Variables

### Backend (`backend/.env` or deployment settings)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Full PostgreSQL connection URL | `postgresql://meetscribe_user:meetscribe_password@localhost:5432/meetscribe` |
| `POSTGRES_HOST` | PostgreSQL host (fallback if `DATABASE_URL` unset) | `localhost` |
| `POSTGRES_PORT` | PostgreSQL port | `5432` |
| `POSTGRES_DB` | PostgreSQL database name | `meetscribe` |
| `POSTGRES_USER` | PostgreSQL user | `meetscribe_user` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `meetscribe_password` |
| `AUTH_SECRET_KEY` | Secret key for signing tokens | *(Random secure string)* |
| `TOKEN_EXPIRE_DAYS` | Token expiration in days | `7` |
| `AUTO_SEED` | Seed initial data on fresh database | `true` |
| `FRONTEND_URL` | Allowed frontend origin for CORS | `http://localhost:3000` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |

---

## 🚀 Quick Start & Local Setup

### 1. Start PostgreSQL (Docker)

```bash
docker run -d \
  --name meetscribe-postgres \
  -e POSTGRES_DB=meetscribe \
  -e POSTGRES_USER=meetscribe_user \
  -e POSTGRES_PASSWORD=meetscribe_password \
  -p 5432:5432 \
  postgres:16-alpine
```

### 2. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run Alembic migrations
DATABASE_URL="postgresql://meetscribe_user:meetscribe_password@localhost:5432/meetscribe" alembic upgrade head

# Start FastAPI backend
DATABASE_URL="postgresql://meetscribe_user:meetscribe_password@localhost:5432/meetscribe" uvicorn app.main:app --reload --port 8000
```

- **Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

- **Web Application**: [http://localhost:3000](http://localhost:3000)
- **Login Page**: [http://localhost:3000/login](http://localhost:3000/login)

---

## 🗄️ Database Migrations & Data Transfer

### Run Schema Migrations
```bash
# Apply migrations
alembic upgrade head

# Generate a new migration after model edits
alembic revision --autogenerate -m "add_new_feature"
```

### SQLite to PostgreSQL Data Migration Tool
```bash
# Migrate existing records with sequence synchronization
python app/migrate_data.py \
  --sqlite-path ./meetscribe.db \
  --pg-url "postgresql://meetscribe_user:meetscribe_password@localhost:5432/meetscribe" \
  --clean
```

---

## 🧪 Testing

### Backend Test Suite (Pytest)
```bash
cd backend
pytest -v
```

### Frontend Typecheck & Build
```bash
cd frontend
npx tsc --noEmit
npm run build
```

---

## 📁 Repository Structure

```
meetscribe/
├── frontend/                     # Next.js 16 TypeScript App Router Client
│   ├── src/
│   │   ├── app/                  # Application routes (/, /login, /dashboard, /meetings, /action-items)
│   │   ├── components/           # UI components, layout, auth guards, guided tour overlay
│   │   ├── context/              # React AuthContext and TourContext
│   │   ├── services/             # API client & token storage
│   │   └── types/                # TypeScript data models
│   ├── package.json
│   └── tsconfig.json
├── backend/                      # FastAPI Python Backend
│   ├── app/
│   │   ├── main.py               # FastAPI entrypoint, CORS, health checks
│   │   ├── database.py           # PostgreSQL connection pooling & session management
│   │   ├── models/               # SQLAlchemy ORM models (User, Meeting, Transcript, etc.)
│   │   ├── schemas/              # Pydantic validation schemas
│   │   ├── routers/              # API endpoints (/auth, /meetings, /users, /action-items)
│   │   ├── services/             # Authentication & transcription business logic
│   │   ├── migrate_data.py       # SQLite -> PostgreSQL migration utility
│   │   └── seed.py               # Database seeder with demo accounts
│   ├── alembic/                  # Alembic migration scripts
│   ├── tests/                    # Pytest test suite
│   ├── requirements.txt          # Python dependencies
│   └── .env.example              # Documented environment template
├── README.md                     # Root project documentation
└── .gitignore                    # Git exclusion rules
```
