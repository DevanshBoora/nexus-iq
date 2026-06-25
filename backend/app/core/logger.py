import logging
import sys
from contextvars import ContextVar
from typing import Optional
from pythonjsonlogger import jsonlogger

# Context variables for tracing
request_id_ctx_var: ContextVar[Optional[str]] = ContextVar("request_id", default=None)
correlation_id_ctx_var: ContextVar[Optional[str]] = ContextVar("correlation_id", default=None)
task_id_ctx_var: ContextVar[Optional[str]] = ContextVar("task_id", default=None)

class ContextFilter(logging.Filter):
    def filter(self, record):
        record.request_id = request_id_ctx_var.get()
        record.correlation_id = correlation_id_ctx_var.get()
        record.task_id = task_id_ctx_var.get()
        return True

def setup_logger(name: str = "nexus-iq") -> logging.Logger:
    logger = logging.getLogger(name)
    
    # Avoid duplicate handlers if setup is called multiple times
    if logger.handlers:
        return logger

    logger.setLevel(logging.INFO)
    
    logHandler = logging.StreamHandler(sys.stdout)
    
    # Map typical fields to standard output
    formatter = jsonlogger.JsonFormatter(
        '%(asctime)s %(levelname)s %(name)s %(message)s %(request_id)s %(correlation_id)s %(task_id)s'
    )
    logHandler.setFormatter(formatter)
    
    logger.addHandler(logHandler)
    logger.addFilter(ContextFilter())
    
    return logger

# Create the default app logger
logger = setup_logger()
