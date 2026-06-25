<p align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Celery-37814A?style=for-the-badge&logo=celery&logoColor=white" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" />
</p>

<h1 align="center">NexusIQ: Engineering Intelligence Automated</h1>

<p align="center">
  <strong>An AI-powered engineering observability platform that automatically correlates API telemetry anomalies with GitHub deployments.</strong>
</p>

## Overview

NexusIQ is a full-stack engineering intelligence platform designed to replace manual incident investigation. By ingesting real-time API telemetry and monitoring GitHub webhooks, NexusIQ detects P99 latency spikes and error rate anomalies, then uses **Google Gemini AI** to automatically correlate the incident with the exact code change that caused it.

## 🚀 Features

* **Real-time Telemetry Ingestion:** Processes high-volume API traffic using Celery and Pandas to detect performance degradation.
* **AI Incident Correlation:** Automatically cross-references telemetry anomalies against recent GitHub PRs and commits.
* **Smart Engineering Feed:** Generates AI-driven summaries of pull requests, tech debt alerts, and security risks.
* **Modern Glassmorphism UI:** Built with Next.js and Tailwind CSS for a stunning, responsive, demo-ready experience.
* **Enterprise Architecture:** Uses FastAPI, SQLAlchemy 2.0 (Async), Redis, Celery, and a robust Dead Letter Queue (DLQ).

## 🛠 Tech Stack

* **Frontend**: Next.js 14, React 19, Tailwind CSS v4, Framer Motion, Recharts
* **Backend**: FastAPI, Python 3.8+, Pydantic, SQLAlchemy 2.0
* **Data Processing**: Pandas, Celery, Redis
* **Database**: PostgreSQL (via asyncpg)
* **AI Integration**: Google Gemini API

## 🏁 Getting Started

### Prerequisites

* Docker and Docker Compose
* Google Gemini API Key

### Quick Start (Docker)

1. Clone the repository:
   ```bash
   git clone https://github.com/DevanshBoora/nexus-iq.git
   cd nexus-iq
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

3. Launch the stack:
   ```bash
   docker-compose up --build
   ```

4. The platform will be available at:
   * Frontend: `http://localhost:3000`
   * Backend API: `http://localhost:8000`

### Seeding the Demo

To populate the application with realistic, interview-ready mock data:
```bash
cd backend
python -m app.scripts.seeder
```

## 📖 Documentation

* [Architecture Overview](./ARCHITECTURE.md)
* [API Reference](./docs/API.md)
* [Deployment Guide](./DEPLOYMENT.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
