# DebugMate AI Development Roadmap

This roadmap is designed for learning. Do not build every file at once. Finish one milestone, test it, commit it, then move to the next.

## Milestone 1: Project Setup

### Objective

Create the basic Node.js, Express, TypeScript, Prisma, and tooling foundation.

### Estimated Time

4 to 6 hours

### Deliverables

- `package.json`
- TypeScript config
- Express app
- Health check route
- Environment variable loader
- Pino logger setup
- Basic folder structure
- `.env.example`
- Git ignore file

### Files to Create

```text
src/app.ts
src/server.ts
src/config/env.ts
src/config/logger.ts
src/routes/health.routes.ts
.env.example
.gitignore
```

### Concepts Learned

- Express app setup.
- Difference between `app.ts` and `server.ts`.
- Environment variables.
- Structured logging.
- Project organization.

### Beginner Mistakes to Avoid

- Do not hardcode the port everywhere.
- Do not commit `.env`.
- Do not put every route in `server.ts`.

### Suggested Commit

```text
chore(project): initialize Express backend structure
```

### Done When

- `GET /health` returns a success response.
- The app starts from an npm script.
- Environment variables are validated on startup.

## Milestone 2: Authentication

### Objective

Implement registration, login, password hashing, and JWT-protected routes.

### Estimated Time

6 to 10 hours

### Deliverables

- User model.
- Register endpoint.
- Login endpoint.
- Password hashing with bcrypt.
- JWT generation.
- Auth middleware.
- Protected test route.

### Files to Create

```text
prisma/schema.prisma
src/routes/auth.routes.ts
src/controllers/auth.controller.ts
src/services/auth.service.ts
src/validators/auth.schema.ts
src/middlewares/auth.middleware.ts
```

### Concepts Learned

- Hashing versus encryption.
- JWT access tokens.
- Authentication middleware.
- User ownership.
- Zod validation.

### Suggested Commit

```text
feat(auth): implement JWT authentication
```

### Done When

- A user can register.
- A user can log in.
- Passwords are stored as hashes.
- A protected route rejects requests without a valid token.

## Milestone 3: Database Foundations

### Objective

Create the main Prisma models and run migrations.

### Estimated Time

4 to 8 hours

### Deliverables

- `ErrorReport` model.
- `AIAnalysis` model.
- `Tag` model.
- `SearchHistory` model.
- `ApiUsage` model.
- Database indexes.
- Prisma client setup.

### Files to Create

```text
src/config/prisma.ts
prisma/schema.prisma
prisma/migrations/
```

### Concepts Learned

- Relational modeling.
- One-to-many relationships.
- One-to-one relationships.
- Many-to-many relationships.
- Indexes.
- Migrations.

### Suggested Commit

```text
feat(database): add Prisma models for debugging history
```

### Done When

- Prisma migration runs successfully.
- Prisma client can connect to PostgreSQL.
- You can explain every table.

## Milestone 4: Error Report CRUD

### Objective

Allow users to create, list, view, update, and delete their own error reports.

### Estimated Time

8 to 12 hours

### Deliverables

- Create report endpoint.
- List reports with pagination.
- Get report by ID.
- Update notes, title, and tags.
- Delete report.
- Ownership checks.

### Files to Create

```text
src/routes/errorReport.routes.ts
src/controllers/errorReport.controller.ts
src/services/errorReport.service.ts
src/validators/errorReport.schema.ts
src/utils/pagination.ts
```

### Concepts Learned

- CRUD design.
- Pagination.
- Authorization versus authentication.
- Service-layer business logic.
- Many-to-many tag updates.

### Suggested Commit

```text
feat(errors): implement error report CRUD
```

### Done When

- Users can manage their own reports.
- Users cannot access another user's reports.
- Invalid request bodies return validation errors.

## Milestone 5: AI Integration

### Objective

Send error reports to Gemini or OpenAI and save structured analysis.

### Estimated Time

8 to 14 hours

### Deliverables

- AI provider client.
- Prompt template.
- Structured JSON parser.
- Zod validation for AI response.
- Save analysis to database.
- Handle AI failures gracefully.

### Files to Create

```text
src/ai/aiClient.ts
src/ai/gemini.provider.ts
src/ai/openai.provider.ts
src/ai/ai.types.ts
src/prompts/errorAnalysis.prompt.ts
src/services/aiAnalysis.service.ts
```

### Concepts Learned

- External API integration.
- Prompt engineering.
- Structured AI output.
- Defensive parsing.
- Failure handling.

### Suggested Commit

```text
feat(ai): integrate AI error analysis
```

### Done When

- Creating an error report can generate analysis.
- AI output is saved.
- Invalid AI output does not crash the app.

## Milestone 6: Similar Error Reuse and Search

### Objective

Avoid repeated AI calls and make previous errors searchable.

### Estimated Time

8 to 12 hours

### Deliverables

- Error normalization.
- Fingerprint hashing.
- Duplicate lookup.
- Reused analysis flow.
- Search endpoint.
- Search history tracking.

### Files to Create

```text
src/utils/normalizeError.ts
src/utils/hashError.ts
src/routes/search.routes.ts
src/controllers/search.controller.ts
src/services/search.service.ts
src/validators/search.schema.ts
```

### Concepts Learned

- Caching strategy.
- Hashing.
- Duplicate detection.
- Search filters.
- Query design.

### Suggested Commits

```text
feat(errors): add duplicate error detection
feat(search): add error search endpoint
```

### Done When

- Duplicate errors reuse old analysis.
- Search works by message, endpoint, severity, tags, and date.

## Milestone 7: Analytics

### Objective

Add statistics that summarize debugging history.

### Estimated Time

5 to 8 hours

### Deliverables

- Overview analytics endpoint.
- Most common errors endpoint.
- Most failing endpoints endpoint.
- Errors per day endpoint.
- AI usage metrics.

### Files to Create

```text
src/routes/analytics.routes.ts
src/controllers/analytics.controller.ts
src/services/analytics.service.ts
src/validators/analytics.schema.ts
```

### Concepts Learned

- Aggregation queries.
- Prisma `groupBy`.
- Date range filtering.
- Analytics response design.

### Suggested Commit

```text
feat(analytics): add debugging analytics endpoints
```

### Done When

- You can view total errors, common errors, failing endpoints, and AI usage.

## Milestone 8: Production Hardening and Deployment

### Objective

Prepare the backend for real deployment.

### Estimated Time

8 to 12 hours

### Deliverables

- Centralized error handling.
- Rate limiting.
- Helmet.
- CORS config.
- Swagger docs.
- Dockerfile.
- Docker Compose for local database.
- Railway or Render deployment config.
- README polish.

### Files to Create

```text
src/middlewares/error.middleware.ts
src/middlewares/rateLimit.middleware.ts
src/middlewares/requestId.middleware.ts
src/config/swagger.ts
Dockerfile
docker-compose.yml
README.md
```

### Concepts Learned

- Production security basics.
- API documentation.
- Docker.
- Deployment environment variables.
- Observability.

### Suggested Commits

```text
feat(docs): add Swagger API documentation
chore(docker): add Docker deployment setup
chore(deploy): configure production deployment
```

### Done When

- API docs are available.
- The app runs in Docker.
- The app is deployed with production environment variables.

## Testing Plan

### Manual Testing with Postman

Create a Postman collection with folders:

- Health
- Auth
- Error Reports
- Search
- Analytics
- Negative Tests

Use variables:

```text
baseUrl
accessToken
refreshToken
reportId
```

### Automated Testing

Recommended test categories:

- Authentication tests.
- Validation tests.
- CRUD tests.
- Authorization tests.
- AI service tests with mocked provider.
- Error middleware tests.

### Important Testing Rule

Do not call the real AI provider in normal automated tests. Mock it so your tests are fast, free, and predictable.

## Professional Commit Message List

```text
chore(project): initialize Express backend structure
chore(config): add environment validation
feat(auth): implement user registration
feat(auth): implement login with JWT
feat(auth): protect private routes
feat(database): add Prisma schema and migrations
feat(errors): implement error report CRUD
feat(tags): support tagging error reports
feat(ai): integrate AI error analysis
feat(errors): add duplicate error detection
feat(search): add error search endpoint
feat(analytics): add debugging analytics endpoints
feat(docs): add Swagger API documentation
chore(docker): add Docker deployment setup
test(auth): add authentication tests
test(errors): add error report tests
docs(readme): add setup and API documentation
```

## How We Should Work Through This

Build one milestone at a time.

For each milestone:

1. Read the objective.
2. Create only the files needed for that milestone.
3. Test manually.
4. Add automated tests where useful.
5. Commit with a professional message.
6. Explain what you learned in your own words.

This is how you avoid copying code without understanding it.
