import hashlib
import json
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database.models import AICache

class AICacheManager:
    """
    Manages caching of AI responses to save costs and reduce latency.
    Uses PostgreSQL to store hashes of prompts and their parsed JSON responses.
    """
    
    def __init__(self, session: AsyncSession):
        self.session = session
        
    def _compute_hash(self, prompt: str) -> str:
        """Computes a SHA-256 hash of the prompt string."""
        return hashlib.sha256(prompt.encode("utf-8")).hexdigest()

    async def get_cached_response(self, prompt: str) -> dict:
        """
        Retrieves a cached JSON response if it exists and hasn't expired.
        Returns None if no valid cache is found.
        """
        prompt_hash = self._compute_hash(prompt)
        
        result = await self.session.execute(
            select(AICache).where(AICache.prompt_hash == prompt_hash)
        )
        cache_entry = result.scalar_one_or_none()
        
        if cache_entry:
            # Check expiration
            if cache_entry.expires_at and cache_entry.expires_at < datetime.utcnow():
                # Expired
                await self.session.delete(cache_entry)
                await self.session.commit()
                return None
            return cache_entry.response_json
            
        return None
        
    async def set_cached_response(self, prompt: str, response_json: dict, ttl_seconds: int = 86400):
        """
        Saves a structured JSON response to the cache.
        Default TTL is 24 hours.
        """
        prompt_hash = self._compute_hash(prompt)
        
        # Check if exists first to update or insert
        result = await self.session.execute(
            select(AICache).where(AICache.prompt_hash == prompt_hash)
        )
        cache_entry = result.scalar_one_or_none()
        
        expires_at = datetime.utcnow() + timedelta(seconds=ttl_seconds) if ttl_seconds else None
        
        if cache_entry:
            cache_entry.response_json = response_json
            cache_entry.expires_at = expires_at
        else:
            cache_entry = AICache(
                prompt_hash=prompt_hash,
                response_json=response_json,
                expires_at=expires_at
            )
            self.session.add(cache_entry)
            
        await self.session.commit()
