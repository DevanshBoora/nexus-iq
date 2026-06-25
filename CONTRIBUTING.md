# Contributing to NexusIQ

First off, thank you for considering contributing to NexusIQ! 

## Development Setup

1. **Fork & Clone**: Fork the repository and clone it locally.
2. **Backend**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   cp .env.example .env # Configure your environment variables
   uvicorn app.main:app --reload
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```

## Workflow

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'feat: add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request.

## Code Standards

- **Backend**: We use FastAPI with strict Pydantic typing and SQLAlchemy 2.0 async. Run `pytest` before submitting.
- **Frontend**: Next.js 14 App Router, Tailwind CSS v4, and standard Prettier/ESLint configs.

Please ensure all tests pass and there are no linting errors before requesting a review.
