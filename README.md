# 🚀 DebugMate AI

An AI-powered backend API for analyzing software errors, managing error reports, detecting duplicates, and providing intelligent debugging assistance.

Built with **Node.js**, **Express**, **TypeScript**, **Prisma**, **PostgreSQL**, and **Google Gemini AI**.

---

## 📌 Features

### 🔐 Authentication

- JWT Authentication
- User Registration
- User Login
- Protected Routes
- Password Hashing using bcrypt

---

### 🐞 Error Report Management

- Create Error Reports
- View All Reports
- View Single Report
- Update Reports
- Delete Reports
- Status Management
- Severity Levels
- HTTP Method Tracking

---

### 🤖 AI Error Analysis

Powered by **Google Gemini**

Automatically generates:

- Error Summary
- Root Cause Analysis
- Detailed Explanation
- Severity Prediction
- Confidence Score
- Suggested Fixes
- Prevention Tips

---

### 🔍 Smart Search

Search error reports by:

- Title
- Description
- Raw Error
- Programming Language
- Framework

Search history is also stored for every user.

---

### 📊 Analytics Dashboard

Provides project statistics including:

- Total Error Reports
- Open Reports
- Resolved Reports
- Ignored Reports
- AI Analyses Generated
- Search Count
- AI Token Usage
- Processing Time

---

### 🧠 Duplicate Detection

Each report generates a fingerprint to help identify duplicate errors.

---

### 📖 API Documentation

Interactive API documentation using Swagger UI.

---

## 🛠 Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- PostgreSQL
- Prisma ORM
- Neon Database

### AI

- Google Gemini API

### Authentication

- JWT
- bcrypt

### Validation

- Zod

### Documentation

- Swagger UI

---

## 📂 Project Structure

```
prisma/

src/
│
├── ai/
├── config/
├── controllers/
├── middleware/
├── prompts/
├── routes/
├── services/
├── utils/
├── validators/
├── errors/
└── server.ts

```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/debugmate-ai.git
```

Move into the project

```bash
cd debugmate-ai
```

Install dependencies

```bash
pnpm install
```

Generate Prisma Client

```bash
pnpm prisma generate
```

Run database migrations

```bash
pnpm prisma migrate dev
```

Start the development server

```bash
pnpm dev
```

---

## 🔑 Environment Variables

Create a `.env` file.

Example:

```env
DATABASE_URL=

JWT_SECRET=

GEMINI_API_KEY=

PORT=5000

NODE_ENV=development
```

---

## 📚 API Endpoints

### Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| GET | /api/auth/me |

---

### Error Reports

| Method | Endpoint |
|---------|----------|
| POST | /api/errors |
| GET | /api/errors |
| GET | /api/errors/:id |
| PATCH | /api/errors/:id |
| DELETE | /api/errors/:id |

---

### AI

| Method | Endpoint |
|---------|----------|
| POST | /api/errors/:id/analyze |

---

### Search

| Method | Endpoint |
|---------|----------|
| GET | /api/search?q=... |

---

### Analytics

| Method | Endpoint |
|---------|----------|
| GET | /api/analytics |

---

### Swagger

```
/docs
```

---

## 🗄 Database Models

- User
- ErrorReport
- AIAnalysis
- Tag
- SearchHistory
- ApiUsage

---

## 🚀 Deployment

Designed for deployment on:

- Render
- Railway

Database:

- Neon PostgreSQL

---

## 📈 Future Improvements

- Team Workspaces
- API Key Authentication
- Rate Limiting per User
- Email Notifications
- Error Log File Uploads
- OpenAI Support
- Docker Deployment
- CI/CD Pipeline
- Redis Caching
- Background Job Queue
- Vector Search for Similar Errors

---
