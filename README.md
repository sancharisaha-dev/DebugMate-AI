# 🚀 DebugMate AI

An AI-powered backend service for analyzing software errors, managing debugging history, detecting duplicate issues, and providing intelligent insights using Google Gemini AI.

Built with **Node.js**, **Express.js**, **TypeScript**, **Prisma ORM**, **PostgreSQL**, and **Google Gemini AI**.

---

# 🌐 Live Demo

**API Base URL**

https://debugmate-ai-zvlz.onrender.com

**Swagger Documentation**

https://debugmate-ai-zvlz.onrender.com/docs

---

# 📌 Features

## 🔐 Authentication

- JWT Authentication
- User Registration
- User Login
- Protected Routes
- Password Hashing using bcrypt

---

## 🐞 Error Report Management

- Create Error Reports
- Retrieve All Reports
- Retrieve Single Report
- Update Reports
- Delete Reports
- Report Status Management
- Severity Classification
- HTTP Method Tracking

---

## 🤖 AI Error Analysis

Powered by **Google Gemini AI**

Automatically generates:

- Error Summary
- Root Cause Analysis
- Detailed Explanation
- Severity Prediction
- Confidence Score
- Suggested Fixes
- Prevention Recommendations

---

## 🔍 Smart Search

Search reports by:

- Title
- Description
- Raw Error
- Programming Language
- Framework

Additional features:

- Stores user search history
- Fast keyword-based search

---

## 📊 Analytics Dashboard

Provides insights including:

- Total Error Reports
- Open Reports
- Resolved Reports
- Ignored Reports
- Total AI Analyses
- Search Count
- AI Token Usage
- AI Processing Time

---

## 🧠 Duplicate Detection

Each error report generates a unique fingerprint to help identify duplicate issues.

---

## 📖 Interactive API Documentation

Comprehensive Swagger UI documentation with support for:

- Request bodies
- Authentication
- Endpoint testing
- Response examples

Available at:

https://debugmate-ai-zvlz.onrender.com/docs

---

# 🛠 Tech Stack

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- PostgreSQL
- Prisma ORM
- Neon Database

## AI

- Google Gemini AI

## Authentication

- JWT
- bcrypt

## Validation

- Zod

## Documentation

- Swagger UI

---

# 📂 Project Structure

```text
prisma/

src/
├── ai/
├── config/
├── controllers/
├── errors/
├── middleware/
├── prompts/
├── routes/
├── services/
├── utils/
├── validators/
└── server.ts
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/sancharisaha-dev/DebugMate-AI.git
```

Move into the project

```bash
cd DebugMate-AI
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

# 🔑 Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL=

JWT_ACCESS_SECRET=

JWT_ACCESS_EXPIRES_IN=7d

GEMINI_API_KEY=

PORT=5000

NODE_ENV=development
```

---

# 📚 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| GET | `/api/auth/me` |

---

## Error Reports

| Method | Endpoint |
|---------|----------|
| POST | `/api/errors` |
| GET | `/api/errors` |
| GET | `/api/errors/:id` |
| PUT | `/api/errors/:id` |
| DELETE | `/api/errors/:id` |

---

## AI Analysis

| Method | Endpoint |
|---------|----------|
| POST | `/api/errors/:id/analyze` |

---

## Search

| Method | Endpoint |
|---------|----------|
| GET | `/api/search?query=TypeError` |

---

## Analytics

| Method | Endpoint |
|---------|----------|
| GET | `/api/analytics` |

---

# 🗄 Database Models

- User
- ErrorReport
- AIAnalysis
- Tag
- SearchHistory
- ApiUsage

---

# 🚀 Deployment

## Backend

- Render

## Database

- Neon PostgreSQL

---

# Built With

- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Google Gemini AI
- JWT Authentication
- Swagger UI

---

# 📈 Future Improvements

- Team Workspaces
- API Key Authentication
- User-based Rate Limiting
- Email Notifications
- Error Log File Uploads
- OpenAI Support
- Docker Support
- CI/CD Pipeline
- Redis Caching
- Background Job Queue
- Semantic Vector Search
- Real-time Collaboration

---

# Author

**Sanchari Saha**

GitHub: https://github.com/sancharisaha-dev

---

# 📄 License

This project is licensed under the MIT License.- Suggested Fixes
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
