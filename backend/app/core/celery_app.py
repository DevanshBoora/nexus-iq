from celery import Celery
from app.core.config import settings
from app.core.logger import logger

celery_app = Celery(
    "nexus-iq",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_routes={
        "app.workers.events.process_webhook_event": {"queue": "github_events_queue"}
    },
    task_acks_late=True,  # Ensure tasks are acknowledged ONLY after success
    worker_prefetch_multiplier=1,  # Fair dispatch
)

if settings.REDIS_URL.startswith("rediss://"):
    import ssl
    celery_app.conf.update(
        broker_use_ssl={"ssl_cert_reqs": ssl.CERT_NONE},
        redis_backend_use_ssl={"ssl_cert_reqs": ssl.CERT_NONE}
    )

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    logger.info("Celery configured successfully.")
