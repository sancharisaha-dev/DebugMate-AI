# DebugMate AI API Reference

This is the planned REST API contract for the MVP. It is intentionally written before implementation so you know what you are building and why.

## 1. API Conventions

### Base URL

```text
http://localhost:4000/api
```

### Authentication Header

Protected routes require:

```http
Authorization: Bearer <accessToken>
```

### Success Response Shape

```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

### Error Response Shape

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

### Common Status Codes

- `200 OK`: Request succeeded.
- `201 Created`: Resource created.
- `400 Bad Request`: Invalid input.
- `401 Unauthorized`: Missing or invalid authentication.
- `403 Forbidden`: Authenticated but not allowed to access the resource.
- `404 Not Found`: Resource does not exist.
- `409 Conflict`: Duplicate resource, such as existing email.
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Server Error`: Unexpected server error.
- `502 Bad Gateway`: External AI provider failed.

## 2. Health

### Health Check

Purpose: Confirm the API server is running.

Method: `GET`  
URL: `/health`  
Authentication required: No

Example response:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "uptime": 123.45
  }
}
```

Status codes:

- `200`: Server is healthy.

Validation:

- No body, params, or query validation needed.

## 3. Authentication

### Register

Purpose: Create a user account.

Method: `POST`  
URL: `/auth/register`  
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

- `name`: string, required, 2 to 80 characters.
- `email`: string, required, valid email format, lowercase after normalization.
- `password`: string, required, minimum 8 characters.

Example response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "Aisha Khan",
      "email": "aisha@example.com"
    }
  },
  "message": "User registered successfully"
}
```

Status codes:

- `201`: User created.
- `400`: Validation failed.
- `409`: Email already exists.

Error handling:

- Never return `passwordHash`.
- Return a generic duplicate-email message.

### Login

Purpose: Authenticate a user and issue tokens.

Method: `POST`  
URL: `/auth/login`  
Authentication required: No

Request body:

```json
{
  "email": "aisha@example.com",
  "password": "StrongPassword123!"
}
```

Validation:

- `email`: valid email.
- `password`: required string.

Example response:

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt-access-token",
    "refreshToken": "refresh-token",
    "user": {
      "id": "user_123",
      "name": "Aisha Khan",
      "email": "aisha@example.com"
    }
  }
}
```

Status codes:

- `200`: Login successful.
- `400`: Validation failed.
- `401`: Invalid credentials.
- `429`: Too many login attempts.

Error handling:

- Use the same message for wrong email and wrong password: `Invalid credentials`.

### Refresh Access Token

Purpose: Issue a new access token using a refresh token.

Method: `POST`  
URL: `/auth/refresh`  
Authentication required: No

Request body:

```json
{
  "refreshToken": "refresh-token"
}
```

Validation:

- `refreshToken`: required string.

Example response:

```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-access-token"
  }
}
```

Status codes:

- `200`: Token refreshed.
- `400`: Validation failed.
- `401`: Refresh token invalid, expired, or revoked.

### Logout

Purpose: Revoke the refresh token.

Method: `POST`  
URL: `/auth/logout`  
Authentication required: Yes

Request body:

```json
{
  "refreshToken": "refresh-token"
}
```

Validation:

- `refreshToken`: required string.

Example response:

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

Status codes:

- `200`: Logged out.
- `400`: Validation failed.
- `401`: Missing or invalid access token.

## 4. Error Reports

### Create Error Report

Purpose: Store an API failure and generate or reuse AI analysis.

Method: `POST`  
URL: `/error-reports`  
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

Validation:

- `title`: optional string, max 120 characters.
- `errorMessage`: required string, max 5000 characters.
- `stackTrace`: optional string, max 20000 characters.
- `httpStatus`: optional integer, 100 to 599.
- `method`: optional enum: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- `endpoint`: optional string, max 300 characters.
- `requestBody`: optional JSON.
- `responseBody`: optional JSON.
- `environment`: optional string, max 80 characters.
- `tags`: optional array of strings, max 10 tags.

Example response:

```json
{
  "success": true,
  "data": {
    "report": {
      "id": "report_123",
      "errorMessage": "Cannot read properties of undefined",
      "httpStatus": 500,
      "method": "GET",
      "endpoint": "/api/users/123",
      "fingerprint": "d9f2b2...",
      "analysis": {
        "rootCause": "The route is likely reading a property from an undefined value.",
        "explanation": "The database lookup may return null or undefined. The code should check the result before reading properties.",
        "severity": "HIGH",
        "confidence": 90,
        "possibleFix": "Check whether the user exists and return 404 before using the object.",
        "exampleCode": "if (!user) return res.status(404).json({ message: 'User not found' });",
        "relatedTopics": ["null checks", "Prisma findUnique", "Express error handling"]
      }
    },
    "reusedAnalysis": false
  }
}
```

Status codes:

- `201`: Report created.
- `400`: Validation failed.
- `401`: Missing or invalid token.
- `429`: AI endpoint rate limit exceeded.
- `502`: AI provider failed.

Error handling:

- Recommended MVP behavior: save the report even if AI fails, then return the report with `analysis: null` and an AI failure message.

### List Error Reports

Purpose: Return paginated reports for the authenticated user.

Method: `GET`  
URL: `/error-reports?page=1&limit=20&severity=HIGH`  
Authentication required: Yes

Query validation:

- `page`: optional positive integer, default `1`.
- `limit`: optional integer, default `20`, max `100`.
- `severity`: optional enum.
- `endpoint`: optional string.
- `from`: optional ISO date.
- `to`: optional ISO date.

Example response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "report_123",
        "errorMessage": "Cannot read properties of undefined",
        "endpoint": "/api/users/123",
        "severity": "HIGH",
        "createdAt": "2026-07-10T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

Status codes:

- `200`: Reports returned.
- `400`: Invalid query params.
- `401`: Missing or invalid token.

### Get Error Report

Purpose: Return one report with AI analysis and tags.

Method: `GET`  
URL: `/error-reports/:id`  
Authentication required: Yes

Path validation:

- `id`: required UUID.

Example response:

```json
{
  "success": true,
  "data": {
    "id": "report_123",
    "errorMessage": "Cannot read properties of undefined",
    "stackTrace": "TypeError...",
    "analysis": {
      "severity": "HIGH",
      "confidence": 90
    },
    "tags": ["prisma", "users"]
  }
}
```

Status codes:

- `200`: Report found.
- `400`: Invalid ID.
- `401`: Missing or invalid token.
- `403`: Report belongs to another user.
- `404`: Report not found.

### Update Error Report

Purpose: Update user-editable report fields.

Method: `PATCH`  
URL: `/error-reports/:id`  
Authentication required: Yes

Request body:

```json
{
  "title": "Fixed Prisma user null check",
  "notes": "The query returned null and the controller did not handle it.",
  "tags": ["prisma", "null-check"]
}
```

Validation:

- `id`: required UUID path param.
- `title`: optional string, max 120 characters.
- `notes`: optional string, max 5000 characters.
- `tags`: optional array of strings, max 10 tags.

Example response:

```json
{
  "success": true,
  "data": {
    "id": "report_123",
    "title": "Fixed Prisma user null check",
    "notes": "The query returned null and the controller did not handle it.",
    "tags": ["prisma", "null-check"]
  }
}
```

Status codes:

- `200`: Report updated.
- `400`: Validation failed.
- `401`: Missing or invalid token.
- `403`: Report belongs to another user.
- `404`: Report not found.

### Delete Error Report

Purpose: Delete a report owned by the authenticated user.

Method: `DELETE`  
URL: `/error-reports/:id`  
Authentication required: Yes

Path validation:

- `id`: required UUID.

Example response:

```json
{
  "success": true,
  "message": "Error report deleted"
}
```

Status codes:

- `200`: Report deleted.
- `400`: Invalid ID.
- `401`: Missing or invalid token.
- `403`: Report belongs to another user.
- `404`: Report not found.

## 5. Search

### Search Error Reports

Purpose: Search previous debugging history.

Method: `GET`  
URL: `/search/errors?q=prisma&severity=HIGH&tag=database&page=1&limit=20`  
Authentication required: Yes

Query validation:

- `q`: optional string, max 300 characters.
- `severity`: optional enum.
- `tag`: optional string.
- `endpoint`: optional string.
- `from`: optional ISO date.
- `to`: optional ISO date.
- `page`: optional positive integer.
- `limit`: optional integer, max `100`.

Example response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "report_123",
        "errorMessage": "Cannot read properties of undefined",
        "endpoint": "/api/users/123",
        "severity": "HIGH",
        "tags": ["prisma"]
      }
    ],
    "resultCount": 1
  }
}
```

Status codes:

- `200`: Search completed.
- `400`: Invalid filters.
- `401`: Missing or invalid token.

Error handling:

- Always scope results to the authenticated `userId`.
- Save search history after successful search.

## 6. Analytics

### Analytics Overview

Purpose: Show summary statistics for the authenticated user.

Method: `GET`  
URL: `/analytics/overview`  
Authentication required: Yes

Example response:

```json
{
  "success": true,
  "data": {
    "totalErrors": 120,
    "totalAnalyses": 115,
    "averageConfidence": 86,
    "aiCallsThisMonth": 48
  }
}
```

Status codes:

- `200`: Analytics returned.
- `401`: Missing or invalid token.

### Most Common Errors

Purpose: Group errors by fingerprint.

Method: `GET`  
URL: `/analytics/common-errors?limit=10`  
Authentication required: Yes

Query validation:

- `limit`: optional integer, default `10`, max `50`.

Example response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "fingerprint": "d9f2b2...",
        "count": 8,
        "latestErrorMessage": "Cannot read properties of undefined"
      }
    ]
  }
}
```

Status codes:

- `200`: Results returned.
- `400`: Invalid query params.
- `401`: Missing or invalid token.

### Most Failing Endpoints

Purpose: Find endpoints with the highest error count.

Method: `GET`  
URL: `/analytics/failing-endpoints?limit=10`  
Authentication required: Yes

Query validation:

- `limit`: optional integer, default `10`, max `50`.

Example response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "endpoint": "/api/auth/login",
        "count": 14
      }
    ]
  }
}
```

Status codes:

- `200`: Results returned.
- `400`: Invalid query params.
- `401`: Missing or invalid token.

### Errors Per Day

Purpose: Return daily error counts for a date range.

Method: `GET`  
URL: `/analytics/errors-per-day?from=2026-07-01&to=2026-07-10`  
Authentication required: Yes

Query validation:

- `from`: optional ISO date.
- `to`: optional ISO date.
- `to` must be after `from`.

Example response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "date": "2026-07-10",
        "count": 5
      }
    ]
  }
}
```

Status codes:

- `200`: Results returned.
- `400`: Invalid date range.
- `401`: Missing or invalid token.

## 7. Swagger Documentation Checklist

Document each endpoint with:

- Tags, such as `Auth`, `Error Reports`, `Search`, and `Analytics`.
- Request body schema.
- Query parameter schema.
- Path parameter schema.
- Auth requirement.
- Example success response.
- Example error responses.

## Key Takeaways

- API design should happen before coding.
- Clear contracts make implementation easier.
- Good validation rules protect your service layer from messy inputs.
