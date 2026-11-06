# Cloud Access Portal — Day 4 & Day 5

React + Vite frontend and Express + MongoDB backend for authentication and access request review.

## Features included

- Registration and email OTP verification
- Password login with login OTP
- Short-lived JWT access token and HttpOnly refresh cookie rotation
- Session restoration, automatic access-token refresh, and logout
- Protected Catalog and manager/admin Inbox routes
- Application catalog backed by MongoDB
- Access request creation with duration and business justification validation
- Requester-owned request list endpoint
- Manager/admin inbox and approve/reject decisions
- Role authorization middleware and unit tests

## Folder structure

- `src/` — React application
- `Backend/src/` — Express API, models, routes and middleware
- `Backend/test/` — Node test runner tests

## Setup

### Frontend

```powershell
npm install
Copy-Item .env.example .env
# Set VITE_API_URL in .env if the backend API is not at localhost:3000/api
npm run dev
```

### Backend

```powershell
cd Backend
npm install
Copy-Item .env.example .env
# Fill MONGO_URI, JWT_ACCESS_SECRET, FRONTEND_ORIGIN and email settings in Backend/.env
npm test
npm run dev
```

Use `PORT=3000` for local backend if frontend API URL uses `http://localhost:3000/api`.

### Seed applications

In a second backend terminal after MongoDB is configured:

```powershell
node seedApplications.js
```

The seed script upserts the sample application catalogue and sets its risk classifications.

## API overview

- `POST /api/auth/register` — register account
- `POST /api/auth/verify-registration` — verify registration OTP
- `POST /api/auth/login` — password validation and login OTP issue
- `POST /api/auth/login/verify-otp` — verify login OTP and establish session
- `POST /api/auth/refresh` — rotate refresh session
- `POST /api/auth/logout` — revoke current refresh session
- `GET /api/auth/me` — authenticated profile
- `GET /api/applications` — active catalog
- `POST /api/access-requests` — create access request (authenticated)
- `GET /api/access-requests/mine` — own requests (authenticated)
- `GET /api/access-requests` — manager/admin inbox
- `PATCH /api/access-requests/:id/decision` — manager/admin decision

## Role setup for local testing

Registration defaults to the `requester` role. For local development, after creating a separate manager account and verifying it, update its role directly in your MongoDB database using Atlas or Compass. Do not add a public role-change endpoint.

```javascript
db.users.updateOne(
  { email: "manager@example.com" },
  { $set: { role: "manager" } }
)
```

Sign out and sign back in after the role change so a new access token reflects the updated role.

## Security reminders

- Never commit `.env` files or credentials. `.env.example` contains placeholders only.
- Refresh tokens are HttpOnly cookies; frontend requests use credentials.
- Manager/admin decisions are checked server-side.
- This is a development portfolio project; review concurrency, rate limiting, audit logging, deployment cookie settings, and operational security before production use.
