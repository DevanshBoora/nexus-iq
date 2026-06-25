import abc
from typing import Dict, Any, Tuple
from fastapi import Request

class WebhookAdapter(abc.ABC):
    """Base class for all incoming webhook integrations."""
    
    @abc.abstractmethod
    async def verify_signature(self, request: Request, payload_bytes: bytes) -> bool:
        """Verify the cryptographic signature of the webhook."""
        pass
        
    @abc.abstractmethod
    def parse_event_type(self, request: Request) -> str:
        """Extract the specific event type (e.g., push, pull_request) from headers or payload."""
        pass

    @abc.abstractmethod
    def normalize_payload(self, raw_payload: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize the payload to a standard internal structure if needed."""
        pass
