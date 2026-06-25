# NexusIQ: Portfolio & Resume Assets

## 1. Project Description (2-3 Lines)
**NexusIQ** is an AI-powered engineering observability platform that automatically correlates real-time API telemetry anomalies with GitHub deployments. Built with FastAPI, Next.js, and Celery, it ingests production metrics and leverages Google Gemini to generate actionable incident insights and automated pull request summaries.

## 2. High-Impact Resume Bullet Points
- **Architected a production-ready observability platform** using FastAPI and PostgreSQL, capable of ingesting high-throughput webhook events and API telemetry.
- **Engineered an AI correlation engine** with Google Gemini, automatically cross-referencing P99 latency spikes and error anomalies against recent code deployments to accelerate incident resolution.
- **Implemented a resilient background processing pipeline** using Celery, Redis, and a Dead Letter Queue (DLQ) pattern, ensuring exactly-once processing for critical webhook payloads.
- **Developed a modular AI subsystem** featuring prompt templates, caching, and structured Pydantic outputs to guarantee deterministic LLM responses without relying on external libraries like LangChain.
- **Built a high-performance, responsive Next.js frontend** utilizing Tailwind CSS, Framer Motion, and Recharts to deliver a "glassmorphism" dashboard with real-time telemetry visualizations.

## 3. Complete Technology Stack
- **Frontend**: Next.js 14, React 19, Tailwind CSS v4, Framer Motion, Recharts
- **Backend**: FastAPI, Python 3.8, Pydantic, SQLAlchemy 2.0 (Async)
- **Data & Processing**: PostgreSQL, Redis, Celery, Pandas (for time-series aggregation)
- **AI/ML**: Google Gemini Pro (via `google-genai`), Custom Prompt Manager
- **Infrastructure**: Docker, GitHub Actions, Vercel (Frontend), Render (Backend)

## 4. 20 Likely Interview Questions

1. **Why did you choose FastAPI over Django or Flask?**
   *(Focus on async capabilities, built-in Pydantic validation, and high throughput for webhook ingestion.)*
2. **How does your Celery Dead Letter Queue (DLQ) work?**
   *(Explain the retry mechanism, exponential backoff, and state transitions: PENDING -> PROCESSING -> FAILED).*
3. **Why did you use Pandas for telemetry instead of pure SQL?**
   *(Discuss Pandas' efficiency in calculating P99 quantiles and error rates across time-series windows in-memory).*
4. **How did you prevent the LLM from generating invalid JSON?**
   *(Explain the use of `response_schema` with Pydantic to enforce structured output at the API level).*
5. **How did you handle GitHub webhook security?**
   *(Mention HMAC SHA-256 signature verification using the `X-Hub-Signature-256` header).*
6. **Why Next.js App Router?**
   *(Discuss server components, simplified routing, and optimal performance for dashboards).*
7. **How does the AI Engine correlate an anomaly to a PR?**
   *(Detail the prompt engineering: feeding the anomaly description alongside a recent history of deployment payloads).*
8. **What happens if Redis goes down?**
   *(Discuss Celery broker dependencies and fallback strategies).*
9. **How did you manage database migrations?**
   *(Alembic integration with SQLAlchemy).*
10. **Explain your database schema design.**
    *(Workspace isolation, WebhookEvents, APITelemetry, and Insights tables).*
11. **Why use Redis for the LLM cache?**
    *(To prevent redundant API calls for identical prompts, saving tokens and latency).*
12. **How do you handle N+1 query problems in SQLAlchemy?**
    *(Using `selectinload` or `joinedload` for relationships).*
13. **What is the purpose of the `Dependency Injection` pattern in FastAPI?**
    *(Explain how `get_db` yields sessions and ensures cleanup).*
14. **How did you test the AI Engine without making real API calls?**
    *(Mocking `AsyncMock` and `patch` in `pytest`).*
15. **Why use UUIDs for primary keys instead of auto-incrementing integers?**
    *(Security against enumeration attacks and distributed system compatibility).*
16. **How would you scale the Celery workers?**
    *(Horizontal scaling on Kubernetes or Render, adjusting concurrency flags).*
17. **What happens if the Gemini API rate limits you?**
    *(The Celery worker catches the exception and retries the task, eventually pushing to the DLQ if it consistently fails).*
18. **How do you secure the API endpoints?**
    *(JWT Bearer tokens and Workspace-level isolation).*
19. **Why Tailwind CSS over styled-components?**
    *(Utility-first, zero runtime overhead, and ease of creating complex gradients/glassmorphism).*
20. **What was the hardest bug you fixed during development?**
    *(You can mention the SQLAlchemy `asyncio` session loop issues or the Pydantic literal typing during telemetry testing).*

## 5. 5-Minute Project Explanation Script
*"For my capstone portfolio project, I built NexusIQ. It's an engineering intelligence platform designed to automate incident root-cause analysis. In modern microservices, when a P99 latency spike happens, engineers waste hours digging through Datadog and cross-referencing recent GitHub PRs to figure out what broke.*

*I automated this workflow. I built a FastAPI backend that ingests GitHub webhooks and API telemetry. The telemetry is processed asynchronously by Celery workers using Pandas to calculate error rates and quantiles. If an anomaly is detected—like a 5xx error spike—it triggers my custom AI Engine.*

*The AI Engine uses Google Gemini to analyze the anomaly alongside the recent Git commit history, and it generates a structured 'Incident Insight' identifying which PR likely caused the outage and recommending rollback steps. I built the entire system to be production-ready, featuring a Redis Dead Letter Queue for failed webhooks, asynchronous SQLAlchemy for high concurrency, and a stunning Next.js dashboard using Tailwind and Framer Motion to visualize the telemetry in real-time."*

## 6. Architecture Summary
- **Client Layer:** Next.js React SPA communicating via REST.
- **API Layer:** FastAPI handling routing, JWT Auth, and Payload Validation (Pydantic).
- **Processing Layer:** Celery Workers consuming from Redis. Workers handle Webhook parsing and Pandas Telemetry aggregations.
- **Intelligence Layer:** Modular AI Engine containing Prompt Managers and Context Builders, interfacing with Google Gemini.
- **Data Layer:** PostgreSQL (Asyncpg) storing Workspaces, Events, Telemetry, and Insights. Redis used as a message broker and LLM prompt cache.

## 7. GitHub Feature List
- ✅ **High-Throughput Ingestion**: Async FastAPI endpoints for GitHub Webhooks and Telemetry.
- ✅ **Automated Anomaly Detection**: Pandas-driven P99 latency and error rate windowing.
- ✅ **AI Incident Correlation**: Automated root-cause analysis linking metrics to code changes.
- ✅ **Resilient Processing**: Celery + Redis background workers with DLQ retry mechanisms.
- ✅ **Secure Architecture**: JWT Authentication, Workspace data isolation, HMAC Webhook verification.
- ✅ **Modern UI**: Next.js Glassmorphism dashboard with real-time Recharts visualizations.
