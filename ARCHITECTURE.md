# NexusIQ Architecture Documentation

## Event Flow Diagram

This diagram shows how webhooks flow from external services through the API to background processing, demonstrating the decoupled ingestion layer.

```mermaid
sequenceDiagram
    participant GitHub
    participant FastAPI (Webhook Receiver)
    participant PostgreSQL
    participant Redis (Celery Broker)
    participant Celery Worker
    
    GitHub->>FastAPI (Webhook Receiver): POST /api/v1/webhooks/github
    FastAPI (Webhook Receiver)->>FastAPI (Webhook Receiver): Validate Signature (HMAC)
    FastAPI (Webhook Receiver)->>PostgreSQL: Insert WebhookEvent (status=PENDING)
    PostgreSQL-->>FastAPI (Webhook Receiver): Return Event ID
    FastAPI (Webhook Receiver)->>Redis (Celery Broker): Enqueue Task (process_webhook_event)
    FastAPI (Webhook Receiver)-->>GitHub: 202 Accepted
    
    Redis (Celery Broker)->>Celery Worker: Deliver Task
    Celery Worker->>PostgreSQL: Fetch Event by ID
    Celery Worker->>PostgreSQL: Update status=PROCESSING
    Celery Worker->>Celery Worker: Parse & Extract Business Entities
    alt Success
        Celery Worker->>PostgreSQL: Update status=PROCESSED
    else Failure
        Celery Worker->>PostgreSQL: Update Retry State (status=PENDING or FAILED)
    end
```

## Retry Flow and Dead Letter Queue (DLQ)

This state diagram models the lifecycle of a single WebhookEvent, demonstrating fault tolerance.

```mermaid
stateDiagram-v2
    [*] --> PENDING: Ingestion
    
    PENDING --> PROCESSING: Worker Claims Task
    
    PROCESSING --> PROCESSED: Success
    PROCESSED --> [*]
    
    PROCESSING --> PENDING: Failure (Retry Count < 3)
    note right of PENDING: Exponential backoff delay (10s, 20s, 40s)
    
    PROCESSING --> FAILED: Failure (Retry Count >= 3)
    FAILED --> [*]: Dead Letter Queue (Manual Intervention)
```

## Component Architecture

```mermaid
graph TD
    subgraph "External"
        GH[GitHub / GitLab]
    end
    
    subgraph "API Layer (FastAPI)"
        MW[Tracing Middleware]
        WH[Webhook Endpoint]
        AD[Webhook Adapters]
    end
    
    subgraph "Messaging"
        RD[Redis]
    end
    
    subgraph "Worker Layer (Celery)"
        CW[Worker Orchestrator]
        PS[Payload Parsers]
    end
    
    subgraph "Data Layer"
        PG[(PostgreSQL)]
    end
    
    GH --> MW
    MW --> WH
    WH --> AD
    AD --> WH
    WH --> |Persist Event| PG
    WH --> |Enqueue| RD
    RD --> CW
    CW --> |Claim Event| PG
    CW --> PS
    PS --> |Write Parsed Data| PG
```
