# Full-Stack Coding and Architecture Standards

This repository uses the following engineering standards for performance, maintainability, and security.

## 1. Architecture and Design

- Use modular architecture by business domain.
- Each module should own a single business responsibility.
- Keep frontend components reusable and isolated.
- Use API versioning and consistent error responses.

## 2. Size Limits

- File size target: 300 to 400 lines.
- Function size target: 30 to 50 lines.
- Keep modules and components single-purpose.

## 3. Code Quality and Style

- Linting is mandatory in CI.
- Type safety is mandatory (`tsc --noEmit`).
- Use clear and descriptive naming.
- Prefer domain folders and explicit boundaries.

## 4. Testing

- Unit tests for business logic.
- Integration tests for module interactions.
- E2E tests for critical user flows.
- Coverage target: at least 80%.

## 5. Backend and Database

- Always scope data by organization boundary.
- Use parameterized ORM queries only.
- Avoid N+1 query patterns.
- Add indexes for frequently filtered and sorted fields.
- Use versioned schema updates and keep Prisma schema consistent.
- Cache repeated high-frequency reads when correctness permits.

## 6. Frontend

- Prefer server components and keep client components focused.
- Debounce high-frequency user-triggered network calls.
- Prevent stale async result races in UI interactions.
- Use lazy loading and code splitting for heavy modules.
- Keep pages responsive and accessible.

## 7. Cloud and Infrastructure

- Use CI/CD pipelines for automated quality gates.
- Keep secrets in environment variables or a managed secret store.
- Maintain health checks, retry policies, and observability.

## 8. CI/CD

- Pull requests require lint, typecheck, and build success.
- Use feature flags for controlled rollout where needed.
- Keep rollback plans for production deployments.

## 9. Security

- Validate all inputs and sanitize outputs.
- Enforce RBAC at API and domain levels.
- Encrypt traffic in transit and secure secrets at rest.
- Run regular dependency and vulnerability scans.

## 10. Additional Practices

- Prefer composition over inheritance.
- Keep function complexity under 10.
- Minimize duplication and centralize reusable logic.
- Avoid unnecessary global state.

## Repository Enforcement

The following checks now run in CI for both backend and frontend:

- Lint (errors block merges; warnings are tracked and reduced incrementally).
- Typecheck.
- Production build.

## Performance Playbook (Applied)

- Replaced N+1 unread-count patterns in chat services with grouped/aggregated queries.
- Added short-lived caching for global search hot path.
- Added DB indexes for common filters, joins, and sort paths.
- Added stale-response protection and local cache in global search UI.
