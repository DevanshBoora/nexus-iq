import uuid
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.logger import request_id_ctx_var, correlation_id_ctx_var, logger

class TracingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Generate or extract tracing IDs
        request_id = str(uuid.uuid4())
        correlation_id = request.headers.get("X-Correlation-ID", request_id)

        # Set context variables
        req_token = request_id_ctx_var.set(request_id)
        corr_token = correlation_id_ctx_var.set(correlation_id)

        # Attach to request state for use in endpoints if needed
        request.state.request_id = request_id
        request.state.correlation_id = correlation_id

        try:
            response = await call_next(request)
            # Inject headers into response
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Correlation-ID"] = correlation_id
            return response
        finally:
            # Reset context variables
            request_id_ctx_var.reset(req_token)
            correlation_id_ctx_var.reset(corr_token)
