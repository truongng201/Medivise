import logging
from logging.config import dictConfig

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "[%(asctime)s] %(levelname)s in %(module)s: %(message)s",
        },
        "access": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        },
    },
    "handlers": {
        "default": {
            "formatter": "default",
            "class": "logging.StreamHandler",
            "level": "DEBUG",
        }
    },
    "loggers": {
        "uvicorn": {"handlers": ["default"], "level": "INFO", "propagate": False},
        "uvicorn.error": {"level": "INFO"},
        "uvicorn.access": {"handlers": ["default"], "level": "INFO", "propagate": False},
        "mlflow": {"handlers": ["default"], "level": "INFO", "propagate": False},
        "boto3": {"handlers": ["default"], "level": "WARNING", "propagate": False},
        "botocore": {"handlers": ["default"], "level": "WARNING", "propagate": False},
        "s3transfer": {"handlers": ["default"], "level": "WARNING", "propagate": False},
        "root": {"handlers": ["default"], "level": "INFO"},
    },
}

dictConfig(LOGGING_CONFIG)
logger = logging.getLogger(__name__)
