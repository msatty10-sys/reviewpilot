# ReviewPilot 🚀

Automate getting more Google and Facebook reviews for local service businesses. More reviews = higher local SEO rankings = more customers.

## Quick Start

### Local Development

**Backend:**
```bash
cd reviewpilot-backend
cp ../.env.example .env
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd reviewpilot-frontend
cp ../.env.example .env
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and the API at `http://localhost:8000`.

### Docker (Production)

```bash
docker compose -f reviewpilot-backend/docker-compose.yml up --build
```

This starts:
- **PostgreSQL** on port 5432
- **Redis** on port 6379
- **Backend API** on port 8000
- **Frontend** on port 3000

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Frontend   │────▶│  FastAPI     │────▶│  PostgreSQL  │
│  React/Vite │     │  Backend     │     │  / SQLite    │
│  Nginx      │     │  Port 8000   │     └─────────────┘
└─────────────┘     │              │     ┌─────────────┐
                    │  Services:   │────▶│  Redis       │
                    │  - Auth      │     └─────────────┘
                    │  - SMS       │     ┌─────────────┐
                    │  - Email     │────▶│  Stripe      │
                    │  - Stripe    │     └─────────────┘
                    │  - Analytics │
                    └──────────────┘
```

## Project Structure

### Backend (`reviewpilot-backend/`)
```
app/
├── api/api_v1/endpoints/   # Route handlers
│   ├── login.py            # Auth (JWT)
│   ├── businesses.py       # Business profile
│   ├── customers.py        # Customer CRUD
│   ├── templates.py        # Review templates
│   ├── review_requests.py  # Review request flow
│   ├── analytics.py        # Dashboard analytics
│   └── subscriptions.py    # Stripe billing
├── core/                   # Config, security
├── crud/                   # Database operations
├── models/                 # SQLAlchemy models
├── schemas/                # Pydantic schemas
└── services/               # Business logic
    ├── email.py            # SendGrid
    ├── sms.py              # Twilio
    └── stripe_service.py   # Stripe
```

### Frontend (`reviewpilot-frontend/`)
```
src/
├── api/client.ts         # Axios HTTP client
├── components/           # Reusable UI components
├── contexts/             # Auth context
├── hooks/                # Data fetching hooks
│   ├── useStats.ts
│   ├── useCustomers.ts
│   ├── useTemplates.ts
│   └── useReviewRequests.ts
├── pages/                # Route pages
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx     # Charts + metrics
│   ├── Customers.tsx     # CRUD table
│   ├── Templates.tsx     # Template management
│   ├── ReviewRequests.tsx # Status tracking
│   ├── Settings.tsx      # Profile + subscription
│   └── ReviewLanding.tsx # Public review page
└── types/                # TypeScript interfaces
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/register` | Register business |
| POST | `/api/v1/login/access-token` | Login (JWT) |
| POST | `/api/v1/login/refresh-token` | Refresh JWT |
| GET | `/api/v1/businesses/me` | Get profile |
| PUT | `/api/v1/businesses/me` | Update profile |
| GET/POST | `/api/v1/customers/` | List/Create customers |
| GET/PUT/DELETE | `/api/v1/customers/{id}` | Customer CRUD |
| GET/POST | `/api/v1/templates/` | List/Create templates |
| GET/PUT/DELETE | `/api/v1/templates/{id}` | Template CRUD |
| GET/POST | `/api/v1/review-requests/` | List/Create requests |
| POST | `/api/v1/review-requests/{id}/remind` | Send reminder |
| GET | `/api/v1/analytics/dashboard` | Dashboard stats |
| POST | `/api/v1/subscriptions/create-checkout-session` | Start checkout |
| GET | `/api/v1/subscriptions/me` | Current subscription |

## Subscription Tiers

| Plan | Price | Requests/Month | Features |
|------|-------|----------------|----------|
| Starter | $29/mo | 50 | Basic dashboard, SMS/Email templates |
| Growth | $79/mo | 200 | Review response tools, analytics, multi-location |
| Pro | $149/mo | Unlimited | Team access, white-label, API access |

## Tech Stack

- **Backend**: Python 3.12, FastAPI, SQLAlchemy, Alembic
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts
- **Infrastructure**: Docker, Docker Compose, Nginx
- **Services**: Twilio (SMS), SendGrid (Email), Stripe (Billing)