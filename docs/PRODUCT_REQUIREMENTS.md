# DebugMate AI Product Requirement Document

## 1. Product Vision

DebugMate AI is an AI-powered backend service that helps developers understand API failures faster.

Instead of copying an error into Google, StackOverflow, or an AI chat window manually, a developer can submit the full error context to DebugMate AI. The system stores the error, asks an LLM for a structured explanation, saves the result, and lets the developer search or reuse previous debugging knowledge later.

### Why This Matters

Most backend bugs are not solved by the error message alone. A useful diagnosis usually needs:

- The error message
- The stack trace
- The failing endpoint
- The request body
- The response body
- The HTTP status code
- Historical context from similar failures

DebugMate AI turns that information into a reusable debugging history.

### Key Takeaways

- The product is backend-focused.
- The frontend is only a testing and visualization layer.
- The real value is stored debugging knowledge, not only one-time AI answers.

## 2. Problem Statement

Developers spend too much time debugging backend API errors because error context is scattered across logs, terminal output, API clients, documentation, and search results.

DebugMate AI solves this by accepting structured error reports, generating AI analysis, storing the result, and making past debugging history searchable.

### Key Takeaways

- The problem is not just "call AI".
- The product must organize error data, history, search, and reuse.
- A good backend design is more important than a fancy frontend.

## 3. Goals

1. Allow authenticated users to submit API error reports.
2. Store error details in PostgreSQL.
3. Send relevant error context to an LLM provider such as Gemini or OpenAI.
4. Receive structured JSON analysis from the LLM.
5. Save the AI analysis.
6. Display previous reports and analyses.
7. Search old errors by message, endpoint, stack trace, tag, severity, and date.
8. Reuse previous analyses when the same or similar error appears.
9. Track API usage and AI usage for analytics.
10. Provide production-style backend practices: validation, logging, error handling, authentication, and documentation.

### Key Takeaways

- Goals describe what the system must accomplish.
- They are written from the product and engineering point of view.
- They help prevent building random features too early.

## 4. Non-goals

These are intentionally outside the MVP.

1. Building a polished commercial frontend.
2. Replacing observability tools like Datadog, Sentry, or New Relic.
3. Automatically monitoring live production systems.
4. Supporting teams, organizations, billing, or subscriptions.
5. Building a custom AI model.
6. Building a browser extension.
7. Supporting every programming language perfectly.
8. Creating a real-time alerting system.

### Why Non-goals Matter

Beginners often try to build everything at once. Non-goals protect the project from becoming too large and never getting finished.

### Key Takeaways

- MVP focus is a professional skill.
- A smaller finished backend is better than a huge unfinished idea.
- Non-goals can become future features later.

## 5. Target Users

1. Backend developers debugging REST APIs.
2. Junior developers learning from previous errors.
3. Solo developers building projects.
4. Small teams that want lightweight debugging history.
5. Students building production-style backend portfolio projects.

### Key Takeaways

- The first user is not a large enterprise team.
- The ideal MVP user is a developer who manually tests APIs and needs help understanding failures.

## 6. User Personas

### Persona 1: Junior Backend Developer

Name: Aisha  
Skill level: Beginner to intermediate  
Pain point: Understands CRUD but struggles to understand stack traces and architecture bugs.

Needs:

- Clear explanations
- Suggested fixes
- Related topics to study
- Searchable history of previous mistakes

### Persona 2: Solo Project Builder

Name: Rahul  
Skill level: Intermediate  
Pain point: Builds APIs alone and wastes time debugging repeated errors.

Needs:

- Fast AI diagnosis
- Duplicate detection
- Endpoint-level history
- Analytics for most common failures

### Persona 3: Technical Mentor

Name: Maya  
Skill level: Senior  
Pain point: Wants students or juniors to learn from real debugging patterns.

Needs:

- Structured error reports
- Saved explanations
- Tags
- Search

### Key Takeaways

- Personas help you design features for real needs.
- The MVP should serve junior and solo developers first.

## 7. User Stories

### Authentication

- As a user, I want to register so my debugging history is private.
- As a user, I want to log in so I can access protected API routes.
- As a user, I want my password to be securely hashed so it is not stored as plain text.

### Error Reports

- As a developer, I want to submit an API error so I can receive an explanation.
- As a developer, I want to include request and response data so the AI has enough context.
- As a developer, I want to view previous errors so I can remember how I fixed them.
- As a developer, I want to update tags or notes so I can organize errors.
- As a developer, I want to delete an error report if it is no longer useful.

### AI Analysis

- As a developer, I want the AI to explain the root cause in beginner-friendly language.
- As a developer, I want a suggested fix so I know what to try next.
- As a developer, I want example code when useful.
- As a developer, I want confidence and severity so I can prioritize issues.

### Search and Reuse

- As a developer, I want to search previous errors by endpoint or message.
- As a developer, I want the system to detect duplicate errors so I do not pay for repeated AI calls.
- As a developer, I want related errors to appear so I can compare patterns.

### Analytics

- As a user, I want to see my most common errors so I can improve.
- As a user, I want to see failing endpoints so I know where my API is weak.
- As a user, I want to see AI usage so I can understand cost.

### Key Takeaways

- User stories describe features from the user's perspective.
- They help convert product ideas into API routes and database models.

## 8. Functional Requirements

### Authentication

1. Users can register with name, email, and password.
2. Users can log in with email and password.
3. Passwords are hashed with bcrypt.
4. Login returns an access token.
5. Protected routes require a valid JWT.
6. Optional refresh tokens can be added after the MVP.

### Error Report Management

1. Users can create error reports.
2. Users can list their own error reports.
3. Users can view one error report by ID.
4. Users can update notes and tags.
5. Users can delete reports.
6. Users cannot access another user's reports.

### AI Analysis

1. The system sends error context to the AI provider.
2. The AI must return structured JSON.
3. The system validates the AI output shape before saving.
4. If AI fails, the error report is still saved with a failed analysis status.
5. The system records token usage or estimated usage when available.

### Similar Error Detection

1. The system computes a normalized fingerprint for submitted errors.
2. The system checks for exact duplicate fingerprints before calling AI.
3. If a duplicate exists, the system can reuse the previous analysis.
4. Optional similarity checks can be added later.

### Search

1. Search by error message.
2. Search by endpoint.
3. Search by stack trace.
4. Search by AI explanation.
5. Filter by severity.
6. Filter by tags.
7. Filter by date range.

### Analytics

1. Total error count.
2. Errors per day.
3. Most common error fingerprints.
4. Most failing endpoints.
5. AI usage count.
6. Average AI confidence.

### Documentation

1. Swagger/OpenAPI documentation must describe all endpoints.
2. README must explain setup, environment variables, and API usage.

### Key Takeaways

- Functional requirements become routes, services, database tables, and tests.
- They should be specific enough to implement.

## 9. Non-functional Requirements

### Security

- Passwords must never be stored in plain text.
- JWT secrets must come from environment variables.
- Protected routes must verify user ownership.
- Request bodies must be validated with Zod.
- Sensitive fields must not be logged.

### Performance

- Common list and search queries should use indexes.
- AI calls should be avoided for duplicates.
- Pagination should be used for list endpoints.

### Reliability

- AI provider failures should not crash the API.
- Centralized error handling should return consistent responses.
- Logs should include request IDs.

### Maintainability

- Controllers should stay thin.
- Business logic should live in services.
- Prisma access should be isolated through service/repository-style functions.
- Validation schemas should be reusable.

### Observability

- Use Pino for structured logs.
- Log request ID, route, method, status code, and duration.
- Track API usage and AI analysis attempts.

### Key Takeaways

- Non-functional requirements define quality.
- Production-style backend work is mostly about security, reliability, maintainability, and observability.

## 10. Success Metrics

### Product Metrics

- Number of submitted error reports.
- Percentage of reports that receive AI analysis successfully.
- Percentage of duplicate reports that reuse old analysis.
- Number of searches performed.
- Number of returning users.

### Engineering Metrics

- API error rate.
- Average response time for non-AI endpoints.
- Average AI analysis time.
- Validation failure count.
- Test coverage for critical flows.

### Learning Metrics

- You can explain the request flow from route to database.
- You can explain JWT authentication.
- You can explain why validation exists.
- You can explain how duplicate detection saves AI cost.
- You can explain how Prisma relationships map to product features.

### Key Takeaways

- Success is not only "the code runs".
- A portfolio project should demonstrate product thinking and engineering thinking.

## 11. MVP Scope

The MVP should include:

1. Express project setup.
2. PostgreSQL and Prisma setup.
3. User registration and login.
4. JWT-protected routes.
5. Create error report.
6. Store AI analysis.
7. List and view previous reports.
8. Basic duplicate detection with hashing.
9. Basic search by message, endpoint, severity, and date.
10. Basic analytics.
11. Swagger docs.
12. Dockerfile and deployment guide.

### MVP Rule

If a feature does not help submit, analyze, store, search, or reuse API errors, it is probably not MVP.

### Key Takeaways

- The MVP is already a serious backend project.
- Avoid Redis, queues, embeddings, teams, billing, and complex frontend work until the MVP works.

## 12. Future Scope

1. Embedding-based semantic similarity.
2. Redis caching.
3. BullMQ background jobs for AI analysis.
4. Team accounts and shared workspaces.
5. GitHub issue creation.
6. Sentry integration.
7. Slack or Discord alerts.
8. Browser extension.
9. API key access for external apps.
10. Fine-grained severity dashboards.
11. Export reports as PDF or Markdown.
12. Role-based access control.

### Key Takeaways

- Future scope is useful, but only after the MVP is stable.
- Advanced features should solve real pain, not just sound impressive.
