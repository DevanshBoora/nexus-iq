# NexusIQ API Reference

Base URL: `/api/v1`

## Authentication (`/auth`)

### `POST /auth/register`
Register a new user and return an access token.
- **Payload**: `{"email": "user@example.com", "password": "password", "name": "User"}`
- **Response**: `{"access_token": "...", "token_type": "bearer"}`

### `POST /auth/login`
Authenticate a user.
- **Payload**: `{"email": "user@example.com", "password": "password"}`
- **Response**: `{"access_token": "...", "token_type": "bearer"}`

### `GET /auth/me`
Get the current authenticated user profile.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User object.

## Workspaces (`/workspaces`)

### `POST /workspaces`
Create a new workspace.
- **Payload**: `{"name": "My Workspace"}`
- **Response**: Workspace object.

### `GET /workspaces`
List workspaces for the current user.
- **Response**: Array of Workspace objects.

## Webhooks (`/webhooks`)

### `POST /webhooks/github/{workspace_id}`
Ingest a GitHub webhook payload (push, pull_request).
- **Headers**: `X-GitHub-Event`, `X-Hub-Signature-256`
- **Response**: `{ "status": "accepted", "event_id": "uuid" }`

## Telemetry (`/telemetry`)

### `POST /telemetry`
Ingest high-throughput API telemetry metrics.
- **Payload**: Array of `{ "workspace_id": "uuid", "endpoint": "/api/users", "status_code": 200, "latency_ms": 45, "timestamp": "ISO8601" }`
- **Response**: `{ "status": "accepted", "count": 1 }`
