# DebugMate AI Backend Architecture

This document explains the backend design for DebugMate AI in a beginner-friendly way. The goal is to teach why each part exists before showing how it fits together.

## 1. High-level Architecture

```text 
                            +----------------------+
                            |  Testing Frontend    |
                            |  or Postman Client   |
                            +----------+-----------+
                                       |
                                       v
                            +----------------------+
                            |   Express Server     |
                            +----------+-----------+
                                       |
                  +--------------------+--------------------+
                  |                    |                    |
                  v                    v                    v
        +------------------+  +------------------+  +------------------+
        |  Middleware      |  |  Swagger Docs    |  |  Request Logger  |
        |  Auth/Zod/CORS   |  |  /api-docs       |  |  Pino            |
        +--------+---------+  +------------------+  +------------------+
                 |
                 v
        +------------------+
        |  Routes          |
        +--------+---------+
                 |
                 v
        +------------------+
        |  Controllers     |
        +--------+---------+
                 |
                 v
        +------------------+        +----------------------+
        |  Services        +------->| AI Provider          |
        |  Business Logic  |        | Gemini or OpenAI     |
        +--------+---------+        +----------------------+
                 |
                 v
        +------------------+
        |  Prisma ORM      |
        +--------+---------+
                 |
                 v
        +------------------+
        |  PostgreSQL      |
        +------------------+
```

### Why This Architecture

Each layer has one job:

- Express receives HTTP requests.
- Middleware handles cross-cutting concerns like auth, validation, security, and logging.
- Routes connect URLs to controller functions.
- Controllers translate HTTP input into service calls.
- Services contain business rules.
- Prisma talks to the database.
- The AI service isolates external LLM provider logic.

### Key Takeaways

- Good architecture separates responsibilities.
- Controllers should not contain all the logic.
- Services make the backend easier to test and maintain.

## 2. Request Flow

Example: creating an error report.

```text
User or Postman
  |
  v
POST /api/error-reports
  |
  v
Express app
  |
  v
Global middleware
  - request ID
  - logging
  - JSON body parsing
  - CORS
  - security headers
  |
  v
Route middleware
  - JWT authentication
  - Zod validation
  |
  v
ErrorReportController.create
  |
  v
ErrorReportService.createReport
  |
  +--> Normalize error input
  |
  +--> Generate fingerprint hash
  |
  +--> Check for existing similar report
  |
  +--> If duplicate exists, reuse analysis
  |
  +--> If new, call AI service
  |
  v
Prisma saves ErrorReport and AIAnalysis
  |
  v
Controller sends JSON response
```

### Explanation of Every Step

1. The user sends the error details.
2. Express receives the HTTP request.
3. Middleware prepares and protects the request.
4. Authentication confirms who the user is.
5. Validation confirms the body has the correct shape.
6. The controller calls the service.
7. The service applies business rules.
8. Prisma stores or reads data.
9. The AI service calls Gemini or OpenAI only when needed.
10. The response is returned in a consistent JSON format.

### Key Takeaways

- The request should pass through predictable layers.
- Validation should happen before business logic.
- AI calls should be treated as slow, expensive, and failure-prone.

## 3. Folder Structure

Recommended project structure:

```text
debugmate-ai/
  prisma/
    schema.prisma
    migrations/
    seed.ts
  src/
    app.ts
    server.ts
    config/
      env.ts
      swagger.ts
      prisma.ts
      logger.ts
    routes/
      auth.routes.ts
      errorReport.routes.ts
      analytics.routes.ts
      search.routes.ts
    controllers/
      auth.controller.ts
      errorReport.controller.ts
      analytics.controller.ts
      search.controller.ts
    services/
      auth.service.ts
      errorReport.service.ts
      aiAnalysis.service.ts
      search.service.ts
      analytics.service.ts
      usage.service.ts
    ai/
      aiClient.ts
      ai.types.ts
      gemini.provider.ts
      openai.provider.ts
    prompts/
      errorAnalysis.prompt.ts
    validators/
      auth.schema.ts
      errorReport.schema.ts
      search.schema.ts
      analytics.schema.ts
    middlewares/
      auth.middleware.ts
      validate.middleware.ts
      error.middleware.ts
      rateLimit.middleware.ts
      requestId.middleware.ts
      logging.middleware.ts
    utils/
      asyncHandler.ts
      hashError.ts
      normalizeError.ts
      apiResponse.ts
      pagination.ts
    errors/
      AppError.ts
      errorCodes.ts
    docs/
      openapi.ts
    tests/
      auth.test.ts
      errorReport.test.ts
      search.test.ts
    logs/
  .env.example
  Dockerfile
  docker-compose.yml
  package.json
  README.md
```

### Folder Responsibilities

`prisma/`  
Holds database schema, migrations, and seed data. Prisma uses this folder to manage PostgreSQL tables.

`src/app.ts`  
Builds the Express app, registers middleware and routes, and exports the app for tests.

`src/server.ts`  
Starts the HTTP server. Keeping this separate from `app.ts` makes testing easier.

`src/config/`  
Centralizes configuration for environment variables, Prisma, logging, and Swagger.

`src/routes/`  
Defines API paths and connects them to controllers.

`src/controllers/`  
Handles HTTP-level concerns: request, response, status codes, and calling services.

`src/services/`  
Contains business logic. This is where most important backend thinking happens.

`src/ai/`  
Contains AI provider integration so the rest of the app does not care whether you use Gemini or OpenAI.

`src/prompts/`  
Stores prompt templates separately so prompts do not clutter service code.

`src/validators/`  
Contains Zod schemas for request body, params, and query validation.

`src/middlewares/`  
Contains reusable Express middleware.

`src/utils/`  
Contains small reusable helper functions.

`src/errors/`  
Contains custom error classes and error codes.

`tests/`  
Contains automated tests.

`logs/`  
Stores local development logs if file logging is enabled. In production, logs usually go to the platform log system.

### Common Beginner Mistake

Do not put database calls, validation, AI prompts, and response formatting all inside one route file. It works for tiny tutorials, but it becomes painful quickly.

### Key Takeaways

- Folder structure should reflect responsibilities.
- A scalable structure helps you know where code belongs.
- Separation is not ceremony; it prevents confusion as the project grows.

## 4. Database Design

The database stores users, submitted errors, AI analyses, tags, searches, and usage data.

### Prisma Models

```prisma
model User {
  id              String          @id @default(uuid())
  name            String
  email           String          @unique
  passwordHash    String
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  errorReports    ErrorReport[]
  searchHistory   SearchHistory[]
  apiUsage        ApiUsage[]
  refreshTokens   RefreshToken[]

  @@index([createdAt])
}

model RefreshToken {
  id          String   @id @default(uuid())
  tokenHash   String   @unique
  userId      String
  expiresAt   DateTime
  revokedAt   DateTime?
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
}

model ErrorReport {
  id             String       @id @default(uuid())
  userId         String
  title          String?
  errorMessage   String
  stackTrace     String?
  httpStatus     Int?
  method         HttpMethod?
  endpoint       String?
  requestBody    Json?
  responseBody   Json?
  environment    String?
  fingerprint    String
  notes          String?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  aiAnalysis     AIAnalysis?
  tags           ErrorReportTag[]

  @@index([userId])
  @@index([fingerprint])
  @@index([endpoint])
  @@index([httpStatus])
  @@index([createdAt])
}

model AIAnalysis {
  id              String          @id @default(uuid())
  errorReportId   String          @unique
  rootCause       String
  explanation     String
  severity        Severity
  confidence      Int
  possibleFix     String
  exampleCode     String?
  relatedTopics   String[]
  provider        AIProvider
  model           String
  promptVersion   String
  rawResponse     Json?
  reusedFromId    String?
  createdAt       DateTime        @default(now())

  errorReport     ErrorReport     @relation(fields: [errorReportId], references: [id], onDelete: Cascade)

  @@index([severity])
  @@index([confidence])
  @@index([createdAt])
}

model Tag {
  id        String           @id @default(uuid())
  name      String           @unique
  createdAt DateTime         @default(now())

  reports   ErrorReportTag[]
}

model ErrorReportTag {
  errorReportId String
  tagId         String

  errorReport   ErrorReport @relation(fields: [errorReportId], references: [id], onDelete: Cascade)
  tag           Tag         @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([errorReportId, tagId])
  @@index([tagId])
}

model SearchHistory {
  id          String   @id @default(uuid())
  userId      String
  query       String?
  filters     Json?
  resultCount Int
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([createdAt])
}

model ApiUsage {
  id              String      @id @default(uuid())
  userId          String
  route           String
  method          String
  statusCode      Int
  durationMs      Int?
  aiProvider      AIProvider?
  aiModel         String?
  promptTokens    Int?
  completionTokens Int?
  totalTokens     Int?
  createdAt       DateTime    @default(now())

  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([route])
  @@index([createdAt])
}

enum HttpMethod {
  GET
  POST
  PUT
  PATCH
  DELETE
}

enum Severity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum AIProvider {
  GEMINI
  OPENAI
}
```

### Table Purposes and Relationships

`User`  
Stores account data. One user has many error reports, searches, usage records, and refresh tokens.

`RefreshToken`  
Stores hashed refresh tokens if you implement refresh-token login. It allows logout and token rotation.

`ErrorReport`  
Stores the submitted API failure. It belongs to one user and has one optional AI analysis.

`AIAnalysis`  
Stores structured AI output. It is separated from `ErrorReport` because an error can exist even if AI analysis fails or is delayed.

`Tag`  
Stores reusable labels such as `prisma`, `auth`, `validation`, or `database`.

`ErrorReportTag`  
Join table for many-to-many relationship between reports and tags.

`SearchHistory`  
Stores searches for analytics and user convenience.

`ApiUsage`  
Tracks API and AI usage for analytics, performance, and cost visibility.

### Index Strategy

Indexes should support common queries:

- `User.email` for login.
- `ErrorReport.userId` for listing a user's reports.
- `ErrorReport.fingerprint` for duplicate detection.
- `ErrorReport.endpoint` for endpoint filtering.
- `ErrorReport.createdAt` for sorting and date filters.
- `AIAnalysis.severity` for severity filtering.
- `SearchHistory.userId` for search history.
- `ApiUsage.createdAt` for analytics over time.

### Common Beginner Mistake

Do not store tags as a comma-separated string if you want real filtering and relationships. Use a `Tag` table and a join table.

### Key Takeaways

- Database design should follow product features.
- Relationships help enforce ownership and structure.
- Indexes should match the queries you expect to run often.

## 5. REST API Design

All protected endpoints require:

```http
Authorization: Bearer <access_token>
```

Recommended base path:

```text
/api
```

### Response Format

Use a consistent response shape:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed"
}
```

Error response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": []
  },
  "requestId": "req_123"
}
```

## 5.1 Authentication APIs

### Register

Purpose: Create a new user account.

Method: `POST`  
URL: `/api/auth/register`  
Authentication required: No

Request body:

```json
{
  "name": "Aisha Khan",
  "email": "aisha@example.com",
  "password": "StrongPassword123!"
}
```

Validation:

- `name`: required, 2 to 80 characters.
- `email`: required, valid email.
- `password`: required, minimum 8 characters.

Success response: `201 Created`

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "name": "Aisha Khan",
      "email": "aisha@example.com"
    }
  },
  "message": "User registered successfully"
}
```

Possible status codes:

- `201`: created.
- `400`: validation error.
- `409`: email already exists.
- `500`: server error.

### Login

Purpose: Authenticate user and return tokens.

Method: `POST`  
URL: `/api/auth/login`  
Authentication required: No

Request body:

```json
{
  "email": "aisha@example.com",
  "password": "StrongPassword123!"
}
```

Success response: `200 OK`

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt-access-token",
    "refreshToken": "refresh-token",
    "user": {
      "id": "user-id",
      "name": "Aisha Khan",
      "email": "aisha@example.com"
    }
  }
}
```

Possible status codes:

- `200`: login successful.
- `400`: validation error.
- `401`: invalid credentials.

### Refresh Token

Purpose: Get a new access token without logging in again.

Method: `POST`  
URL: `/api/auth/refresh`  
Authentication required: No

Request body:

```json
{
  "refreshToken": "refresh-token"
}
```

Possible status codes:

- `200`: new token issued.
- `401`: invalid or expired refresh token.

### Logout

Purpose: Revoke refresh token.

Method: `POST`  
URL: `/api/auth/logout`  
Authentication required: Yes

Request body:

```json
{
  "refreshToken": "refresh-token"
}
```

Possible status codes:

- `200`: logged out.
- `401`: invalid token.

## 5.2 Error Report APIs

### Create Error Report

Purpose: Submit an API failure and receive AI analysis.

Method: `POST`  
URL: `/api/error-reports`  
Authentication required: Yes

Request body:

```json
{
  "title": "Prisma user lookup failed",
  "errorMessage": "Cannot read properties of undefined",
  "stackTrace": "TypeError: Cannot read properties of undefined\n at getUser...",
  "httpStatus": 500,
  "method": "GET",
  "endpoint": "/api/users/123",
  "requestBody": {},
  "responseBody": {
    "message": "Internal server error"
  },
  "environment": "development",
  "tags": ["prisma", "users"]
}
```

Success response: `201 Created`

```json
{
  "success": true,
  "data": {
    "report": {
      "id": "report-id",
      "errorMessage": "Cannot read properties of undefined",
      "endpoint": "/api/users/123",
      "fingerprint": "hash-value",
      "analysis": {
        "rootCause": "The code is likely trying to access a property on an undefined value.",
        "severity": "HIGH",
        "confidence": 90,
        "possibleFix": "Check whether the user object exists before reading its properties."
      }
    },
    "reusedAnalysis": false
  }
}
```

Possible status codes:

- `201`: report created.
- `400`: validation error.
- `401`: not authenticated.
- `429`: rate limited.
- `502`: AI provider failed, if you choose to fail the whole request.

Recommended behavior: save the report even if AI fails, then mark analysis as failed or missing.

### List Error Reports

Purpose: View previous reports.

Method: `GET`  
URL: `/api/error-reports?page=1&limit=20`  
Authentication required: Yes

Query parameters:

- `page`: default `1`.
- `limit`: default `20`, max `100`.
- `severity`: optional.
- `endpoint`: optional.
- `from`: optional ISO date.
- `to`: optional ISO date.

Success response:

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 42,
      "totalPages": 3
    }
  }
}
```

### Get Error Report by ID

Purpose: View one report and its analysis.

Method: `GET`  
URL: `/api/error-reports/:id`  
Authentication required: Yes

Possible status codes:

- `200`: found.
- `401`: not authenticated.
- `403`: report belongs to another user.
- `404`: report not found.

### Update Error Report

Purpose: Update title, notes, or tags.

Method: `PATCH`  
URL: `/api/error-reports/:id`  
Authentication required: Yes

Request body:

```json
{
  "title": "Fixed Prisma null user issue",
  "notes": "The route did not check whether the user existed.",
  "tags": ["prisma", "null-check"]
}
```

### Delete Error Report

Purpose: Delete a report.

Method: `DELETE`  
URL: `/api/error-reports/:id`  
Authentication required: Yes

Success response:

```json
{
  "success": true,
  "message": "Error report deleted"
}
```

## 5.3 Search APIs

### Search Reports

Purpose: Search previous errors.

Method: `GET`  
URL: `/api/search/errors?q=prisma&severity=HIGH&tag=database`  
Authentication required: Yes

Search fields:

- Error message
- Endpoint
- Stack trace
- AI explanation
- Tags
- Date
- Severity

Possible implementation:

- Start with Prisma `contains` filters.
- Later upgrade to PostgreSQL full-text search.

Success response:

```json
{
  "success": true,
  "data": {
    "items": [],
    "resultCount": 12
  }
}
```

## 5.4 Analytics APIs

### Get Overview

Purpose: Show user-level debugging statistics.

Method: `GET`  
URL: `/api/analytics/overview`  
Authentication required: Yes

Success response:

```json
{
  "success": true,
  "data": {
    "totalErrors": 120,
    "totalAnalyses": 115,
    "averageConfidence": 86,
    "mostFailingEndpoint": "/api/auth/login",
    "aiCallsThisMonth": 48
  }
}
```

### Most Common Errors

Method: `GET`  
URL: `/api/analytics/common-errors`  
Authentication required: Yes

Useful query:

```ts
prisma.errorReport.groupBy({
  by: ["fingerprint"],
  where: { userId },
  _count: { fingerprint: true },
  orderBy: { _count: { fingerprint: "desc" } },
  take: 10
})
```

### Most Failing Endpoints

Method: `GET`  
URL: `/api/analytics/failing-endpoints`  
Authentication required: Yes

Useful query:

```ts
prisma.errorReport.groupBy({
  by: ["endpoint"],
  where: { userId, endpoint: { not: null } },
  _count: { endpoint: true },
  orderBy: { _count: { endpoint: "desc" } },
  take: 10
})
```

### Errors Per Day

Method: `GET`  
URL: `/api/analytics/errors-per-day?from=2026-07-01&to=2026-07-31`  
Authentication required: Yes

Beginner-friendly approach:

- Fetch reports in the date range.
- Group by day in JavaScript.
- Later optimize with raw SQL if needed.

### Key Takeaways

- REST APIs should be predictable.
- Every endpoint needs validation and clear error handling.
- Analytics often uses grouped database queries.

## 6. Authentication Design

### How JWT Authentication Works

JWT means JSON Web Token. After login, the server signs a token containing safe user identity data, usually the user ID.

The client sends that token with future requests:

```http
Authorization: Bearer <token>
```

The server verifies the token signature. If valid, it trusts the user ID inside the token.

### Registration Flow

```text
User submits name, email, password
  |
Validate with Zod
  |
Check if email already exists
  |
Hash password with bcrypt
  |
Save user
  |
Return user without passwordHash
```

### Login Flow

```text
User submits email and password
  |
Validate with Zod
  |
Find user by email
  |
Compare password with bcrypt
  |
Generate access token
  |
Generate optional refresh token
  |
Return tokens
```

### Protected Routes

JWT middleware should:

1. Read the `Authorization` header.
2. Confirm it starts with `Bearer`.
3. Verify the token with `JWT_ACCESS_SECRET`.
4. Attach `userId` to the request object.
5. Call `next()`.

### Password Hashing

Use bcrypt because passwords must never be stored directly.

Recommended salt rounds:

```text
10 to 12 for most beginner projects
```

### Logout Strategy

JWT access tokens are stateless, so you usually cannot revoke them immediately unless you keep a denylist. For the MVP:

- Use short-lived access tokens.
- Revoke refresh tokens on logout.
- Let access tokens expire naturally.

### Token Expiration

Recommended:

- Access token: `15m`
- Refresh token: `7d`

### Refresh Tokens

Refresh tokens improve user experience because the user does not need to log in every 15 minutes.

For a beginner MVP, you may first implement only access tokens. Add refresh tokens after the basic protected routes work.

### Common Beginner Mistake

Do not put the user's password or sensitive data inside the JWT payload.

### Key Takeaways

- JWT proves identity after login.
- bcrypt protects passwords.
- Short-lived access tokens reduce risk.
- Refresh tokens add complexity, so add them carefully.

## 7. Middleware Design

### JWT Authentication Middleware

Purpose: Protect private routes.

Why it exists: Without it, users could access private error history.

### Validation Middleware

Purpose: Run Zod schemas before controllers.

Why it exists: Controllers and services should receive clean, expected data.

### Error Handling Middleware

Purpose: Convert thrown errors into consistent JSON responses.

Why it exists: Without centralized handling, every route returns errors differently.

### Logging Middleware

Purpose: Log method, path, status, duration, and request ID.

Why it exists: Logs help debug production behavior.

### Rate Limiting Middleware

Purpose: Limit repeated requests from the same IP or user.

Why it exists: Protects login and AI endpoints from abuse.

Recommended:

- Stricter limit for `/api/auth/login`.
- Stricter limit for `/api/error-reports` because it may call AI.

### CORS Middleware

Purpose: Allow your frontend domain to call the backend.

Why it exists: Browsers block cross-origin requests unless the server allows them.

### Security Headers

Use Helmet.

Purpose: Adds safer default HTTP headers.

### Request ID Middleware

Purpose: Assign one unique ID to each request.

Why it exists: When an error happens, the same ID can appear in the response and logs.

### Key Takeaways

- Middleware handles repeated concerns.
- Good middleware makes controllers smaller.
- Auth, validation, logging, and error handling are production basics.

## 8. AI Integration

### How AI Should Be Used

The AI should not receive random unstructured text. Send a clear prompt and require structured JSON.

The AI service should:

1. Build a prompt from the error report.
2. Call the selected provider.
3. Parse the response.
4. Validate it with Zod.
5. Save it as `AIAnalysis`.

### Prompt Template

```text
You are a senior backend engineer helping debug an API failure.

Analyze the following API error and return ONLY valid JSON.

Context:
- HTTP method: {{method}}
- Endpoint: {{endpoint}}
- HTTP status: {{httpStatus}}
- Environment: {{environment}}

Error message:
{{errorMessage}}

Stack trace:
{{stackTrace}}

Request body:
{{requestBody}}

Response body:
{{responseBody}}

Return JSON with this exact shape:
{
  "rootCause": "string",
  "explanation": "string",
  "severity": "LOW | MEDIUM | HIGH | CRITICAL",
  "confidence": 0,
  "possibleFix": "string",
  "exampleCode": "string or null",
  "relatedTopics": ["string"]
}

Rules:
- Be beginner-friendly.
- Do not invent missing facts.
- If confidence is low, explain what information is missing.
- Keep exampleCode short.
```

### Expected JSON Output

```json
{
  "rootCause": "The route tries to read a property from an undefined user object.",
  "explanation": "The database query may not find a user. When the result is null or undefined, accessing user.email throws a TypeError.",
  "severity": "HIGH",
  "confidence": 92,
  "possibleFix": "Check whether the user exists before reading properties and return 404 when not found.",
  "exampleCode": "if (!user) return res.status(404).json({ message: 'User not found' });",
  "relatedTopics": ["null checks", "Prisma findUnique", "Express error handling"]
}
```

### Why Structured JSON Is Better Than Plain Text

Structured JSON is easier to:

- Store in database columns.
- Validate with Zod.
- Display in UI sections.
- Filter by severity.
- Use in analytics.
- Test automatically.

### Key Takeaways

- AI output should be validated like user input.
- Prompt design is part of backend design.
- Structured output makes the system reliable.

## 9. Similar Error Detection

### Why Avoid Repeated AI Calls

AI calls can be slow and cost money. If the same error appears again, you should reuse the previous analysis.

### Strategy 1: Hashing

Normalize important fields:

- Lowercase error message.
- Remove extra whitespace.
- Remove dynamic IDs, timestamps, and UUIDs where possible.
- Include method and endpoint.

Then create a hash:

```text
hash(normalizedMethod + normalizedEndpoint + normalizedErrorMessage)
```

Pros:

- Fast.
- Cheap.
- Easy to implement.

Cons:

- Only catches exact or near-exact matches.

### Strategy 2: Duplicate Detection

Before calling AI:

1. Generate fingerprint.
2. Search existing reports for same user and fingerprint.
3. If found and it has analysis, reuse analysis.
4. Save the new report with `reusedFromId`.

### Strategy 3: String Similarity

Use a similarity algorithm to compare error messages.

Pros:

- Catches similar errors.

Cons:

- Can create false matches.
- More logic to tune.

### Strategy 4: Embeddings

Convert error text into vectors and search for semantically similar errors.

Pros:

- Best semantic matching.

Cons:

- More expensive.
- Requires vector storage or extension.
- Not necessary for the first MVP.

### Recommended MVP

Use hashing first. Add string similarity second. Save embeddings for future scope.

### Key Takeaways

- Duplicate detection saves money and improves speed.
- Hashing is the best beginner-friendly first step.
- Embeddings are powerful but should not be your first implementation.

## 10. Search System

### MVP Search

Use Prisma filters:

- `errorMessage contains q`
- `endpoint contains q`
- `stackTrace contains q`
- `AIAnalysis.explanation contains q`
- tag name equals selected tag
- severity equals selected severity
- createdAt between date range

### Example Search Logic

```ts
prisma.errorReport.findMany({
  where: {
    userId,
    OR: [
      { errorMessage: { contains: q, mode: "insensitive" } },
      { endpoint: { contains: q, mode: "insensitive" } },
      { stackTrace: { contains: q, mode: "insensitive" } },
      { aiAnalysis: { explanation: { contains: q, mode: "insensitive" } } }
    ]
  },
  include: {
    aiAnalysis: true,
    tags: { include: { tag: true } }
  }
})
```

### Later Upgrade

Use PostgreSQL full-text search for better performance and relevance.

### Key Takeaways

- Start with simple search.
- Add full-text search when simple filters become slow or limited.
- Always scope search by `userId`.

## 11. Analytics Design

Analytics helps the user learn from repeated problems.

### Useful Analytics

- Total errors.
- Most common errors.
- Most failing endpoints.
- AI usage.
- Average confidence.
- Errors per day.
- Severity distribution.

### Implementation Notes

- Use Prisma `count` for totals.
- Use Prisma `groupBy` for common errors and failing endpoints.
- Use date filters for charts.
- For beginner MVP, group daily results in JavaScript if raw SQL feels too advanced.

### Key Takeaways

- Analytics turns stored data into insight.
- Start with simple metrics that answer real user questions.

## 12. Logging Strategy with Pino

### What to Log

- Request ID.
- HTTP method.
- Route.
- Status code.
- Duration.
- User ID when authenticated.
- AI provider name.
- AI call success or failure.
- Error code and stack trace for server errors.

### What Never to Log

- Passwords.
- Password hashes.
- JWTs.
- Refresh tokens.
- API keys.
- Full request bodies that may contain secrets.
- Authorization headers.

### Log Levels

- `trace`: very detailed debugging.
- `debug`: development debugging.
- `info`: normal successful events.
- `warn`: suspicious or recoverable problems.
- `error`: failed operations.
- `fatal`: app cannot continue.

### Key Takeaways

- Logs are for debugging production.
- Never leak secrets into logs.
- Structured logs are easier to search than plain strings.

## 13. Validation with Zod

### Why Validation Exists

APIs receive untrusted input. Zod ensures the request body, params, and query values match what your code expects.

### Validate Every Endpoint

Examples:

- Register body.
- Login body.
- Create error report body.
- Update error report body.
- Pagination query.
- Search filters.
- Analytics date ranges.

### Common Beginner Mistake

Do not validate only in the frontend. Anyone can call your backend directly with Postman or curl.

### Key Takeaways

- Validation protects services from bad input.
- Validation errors should be clear and consistent.

## 14. Centralized Error Handling

### Custom Error Class

Use an `AppError` class with:

- `message`
- `statusCode`
- `code`
- optional `details`

Example codes:

- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `CONFLICT`
- `RATE_LIMITED`
- `AI_PROVIDER_ERROR`
- `INTERNAL_SERVER_ERROR`

### Why Centralized Handling

Without centralized error handling, every controller writes different try/catch responses. That causes inconsistent APIs.

### Key Takeaways

- Throw meaningful errors in services.
- Convert them to HTTP responses in one middleware.
- Include `requestId` in error responses.

## 15. Security Design

### Helmet

Adds secure HTTP headers.

### Rate Limiting

Protects login and AI endpoints from abuse.

### Password Hashing

bcrypt protects users if the database leaks.

### SQL Injection Prevention

Prisma parameterizes queries, which helps prevent SQL injection. Still, avoid unsafe raw SQL.

### JWT Security

- Use strong secrets.
- Keep access tokens short-lived.
- Do not store sensitive data in JWTs.
- Use HTTPS in production.

### Environment Variables

Secrets must not be committed to GitHub.

### Input Sanitization

Validation checks shape. Sanitization cleans or normalizes data when needed, such as trimming email addresses.

### Key Takeaways

- Security is not one package.
- It is many small decisions across auth, validation, logging, secrets, and database access.

## 16. Environment Variables

Recommended `.env.example`:

```env
NODE_ENV=development
PORT=4000

DATABASE_URL=postgresql://user:password@localhost:5432/debugmate_ai

JWT_ACCESS_SECRET=replace-with-long-random-secret
JWT_REFRESH_SECRET=replace-with-another-long-random-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=12

AI_PROVIDER=gemini
GEMINI_API_KEY=replace-me
GEMINI_MODEL=gemini-1.5-pro
OPENAI_API_KEY=replace-me
OPENAI_MODEL=gpt-4o-mini

CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
AI_RATE_LIMIT_MAX=20

LOG_LEVEL=info
```

### Key Takeaways

- `.env` stores machine-specific configuration.
- `.env.example` documents required variables without exposing real secrets.

## 17. Swagger/OpenAPI

### Why Swagger

Swagger creates interactive API documentation. It helps you and other developers test endpoints without guessing request shapes.

### What to Document

For every endpoint:

- Method.
- URL.
- Auth requirement.
- Request body.
- Query params.
- Path params.
- Success response.
- Error responses.

### Recommended Route

```text
GET /api-docs
```

### Key Takeaways

- Swagger turns your backend into a self-documenting API.
- Good docs make your portfolio project look professional.

## 18. Deployment

### Docker

Use Docker to package the backend consistently.

Basic deployment pieces:

- `Dockerfile` for the Node app.
- `docker-compose.yml` for local app plus PostgreSQL.
- Environment variables for secrets.
- Prisma migration command.

### Railway or Render

Deployment flow:

1. Push code to GitHub.
2. Create a new Railway or Render service.
3. Connect the GitHub repo.
4. Add PostgreSQL.
5. Set production environment variables.
6. Run Prisma migrations.
7. Deploy.

### Production Environment Variables

Use platform settings, not committed files, for:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- AI API keys
- CORS origin

### Key Takeaways

- Deployment is part of backend engineering.
- Never commit production secrets.
- Production should use migrations, not manual database changes.

## 19. Testing Strategy

### Authentication

Test:

- Register success.
- Duplicate email.
- Login success.
- Wrong password.
- Protected route without token.
- Protected route with invalid token.

### CRUD

Test:

- Create report.
- List own reports.
- Cannot view another user's report.
- Update notes and tags.
- Delete report.

### AI Integration

Test:

- AI service receives valid prompt input.
- AI output is parsed.
- Invalid AI JSON is handled.
- Duplicate report reuses old analysis.

For automated tests, mock the AI provider. Do not call the real AI API in every test.

### Validation

Test invalid request bodies:

- Missing email.
- Weak password.
- Invalid HTTP method.
- Invalid severity.
- Bad date range.

### Error Handling

Test:

- `404` for missing resources.
- `403` for another user's report.
- Consistent error response shape.

### Postman Collection

Create folders:

- Auth
- Error Reports
- Search
- Analytics
- Negative Tests

Use Postman variables:

- `baseUrl`
- `accessToken`
- `refreshToken`
- `reportId`

### Key Takeaways

- Tests prove behavior.
- Mock external AI calls.
- Negative tests are as important as happy-path tests.

## 20. Resume Value and Interview Prep

### Backend Concepts Demonstrated

- REST API design.
- Authentication and authorization.
- JWT.
- Password hashing.
- PostgreSQL schema design.
- Prisma ORM relationships.
- Validation with Zod.
- Centralized error handling.
- Logging with Pino.
- AI provider integration.
- Duplicate detection and caching.
- Search and filtering.
- Analytics queries.
- Swagger documentation.
- Docker deployment.

### Interview Questions This Project Helps Answer

- How do you design a REST API?
- How does JWT authentication work?
- How do you protect user data?
- How do you design relational database models?
- How do you handle errors consistently?
- How do you validate API input?
- How do you integrate with an external API?
- How do you avoid unnecessary third-party API calls?
- How do you structure an Express project?
- How do you deploy a Node.js backend?

### Key Takeaways

- This is a strong portfolio project because it combines product thinking, database design, security, AI integration, and deployment.
- You should be able to explain every design decision in interviews.
