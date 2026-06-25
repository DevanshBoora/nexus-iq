import hmac
import hashlib
from typing import Dict, Any, Optional
from fastapi import Request
from app.integrations.base import WebhookAdapter
from app.core.config import settings
from app.core.logger import logger

class GithubAdapter(WebhookAdapter):
    """Adapter for GitHub Webhooks."""
    
    def __init__(self, secret: Optional[str] = None):
        self.secret = secret or settings.GITHUB_WEBHOOK_SECRET

    async def verify_signature(self, request: Request, payload_bytes: bytes) -> bool:
        signature_header = request.headers.get("x-hub-signature-256")
        if not signature_header or not signature_header.startswith("sha256="):
            logger.warning("Missing or malformed x-hub-signature-256 header")
            return False
            
        _, signature = signature_header.split("=", 1)
        mac = hmac.new(
            self.secret.encode("utf-8"),
            msg=payload_bytes,
            digestmod=hashlib.sha256
        )
        return hmac.compare_digest(mac.hexdigest(), signature)

    def parse_event_type(self, request: Request) -> str:
        event = request.headers.get("x-github-event", "unknown")
        return f"github.{event}"

    def normalize_payload(self, raw_payload: Dict[str, Any]) -> Dict[str, Any]:
        # Basic normalization, we keep the raw structure for now but can add common fields
        return raw_payload
