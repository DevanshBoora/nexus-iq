# NexusIQ Deployment Guide

This guide provides instructions for deploying NexusIQ using free-tier services, creating a publicly accessible live demo URL for your portfolio.

## Architecture

* **Frontend:** Vercel (Free Tier)
* **Backend:** Render or Railway (Free Tier)
* **PostgreSQL:** Neon or Supabase (Free Tier)
* **Redis:** Upstash (Free Tier)

---

## 1. Database & Cache (Neon & Upstash)

1. **PostgreSQL (Neon.tech)**
   * Create a free account at [Neon.tech](https://neon.tech)
   * Create a new project.
   * Copy the connection string. It will look like:
     `postgresql://[user]:[password]@[host]/[dbname]?sslmode=require`
   * To use with SQLAlchemy's `asyncpg`, change the scheme to `postgresql+asyncpg://`.

2. **Redis (Upstash.com)**
   * Create a free account at [Upstash](https://upstash.com).
   * Create a new Redis database.
   * Copy the `REDIS_URL` connection string (usually starts with `rediss://`).

---

## 2. Backend (Render.com)

1. Create a free account at [Render](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository (`nexus-iq`).
4. **Configuration:**
   * **Root Directory:** `backend`
   * **Build Command:** `pip install -r requirements.txt`
   * **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables:**
   * `DATABASE_URL`: `postgresql+asyncpg://...` (From Neon)
   * `REDIS_URL`: `rediss://...` (From Upstash)
   * `GEMINI_API_KEY`: Your Google Gemini API Key.
   * `SECRET_KEY`: Generate a random string (e.g., `openssl rand -hex 32`).
   * `ALGORITHM`: `HS256`
   * `ACCESS_TOKEN_EXPIRE_MINUTES`: `1440`
6. Click **Create Web Service**. Render will give you a public URL (e.g., `https://nexus-iq-backend.onrender.com`).

---

## 3. Celery Worker (Render.com)

To process background telemetry and incidents, you need a worker.

1. On Render, click **New +** -> **Background Worker**.
2. Connect your repository.
3. **Configuration:**
   * **Root Directory:** `backend`
   * **Build Command:** `pip install -r requirements.txt`
   * **Start Command:** `celery -A app.core.celery_app worker --loglevel=info`
4. Use the exact same **Environment Variables** as the Web Service.

---

## 4. Frontend (Vercel)

1. Create a free account at [Vercel](https://vercel.com).
2. Click **Add New Project** and import your `nexus-iq` repository.
3. **Configuration:**
   * **Framework Preset:** Next.js
   * **Root Directory:** `frontend`
4. **Environment Variables:**
   * `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://nexus-iq-backend.onrender.com/api/v1`)
5. Click **Deploy**. Vercel will give you a public URL (e.g., `https://nexus-iq.vercel.app`).

---

## 5. Seeding the Demo

Once everything is deployed, trigger the seeder to populate the demo workspace:

```bash
# If running locally to seed the remote DB, use the Neon connection string:
export DATABASE_URL="postgresql+asyncpg://..."
cd backend
python -m app.scripts.seeder
```

**Congratulations!** You now have a fully functional, publicly accessible demo of NexusIQ to share with recruiters.
