# config.py
import os
import sys
import logging
import logging.config
from pathlib import Path
import mlflow

# ---------- Paths ----------
ROOT_DIR = Path(__file__).parent.parent.resolve()
# LOGS_DIR = ROOT_DIR / "logs"
# LOGS_DIR.mkdir(parents=True, exist_ok=True)

# ---------- MLflow ----------
# You’re running an MLflow server locally on port 5000
MLFLOW_TRACKING_URI = os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5001")
mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)

# Default experiment name (can be overridden with env var)
DEFAULT_EXPERIMENT = os.getenv("MLFLOW_EXPERIMENT_NAME", "ehr_xgb_experiment")

def configure_experiment(name: str | None = None) -> str:
    exp_name = name or DEFAULT_EXPERIMENT
    mlflow.set_experiment(exp_name)
    return exp_name

# ---------- Logging ----------
# logging_config = {
#     "version": 1,
#     "disable_existing_loggers": False,
#     "formatters": {
#         "minimal": {"format": "%(message)s"},
#         "detailed": {
#             "format": (
#                 "%(levelname)s %(asctime)s "
#                 "[%(name)s:%(filename)s:%(funcName)s:%(lineno)d]\n%(message)s\n"
#             )
#         },
#     },
#     "handlers": {
#         "console": {
#             "class": "logging.StreamHandler",
#             "stream": sys.stdout,
#             "formatter": "minimal",
#             "level": logging.DEBUG,
#         },
#         "info": {
#             "class": "logging.handlers.RotatingFileHandler",
#             "filename": str(LOGS_DIR / "info.log"),
#             "maxBytes": 10 * 1024 * 1024,  # 10 MB
#             "backupCount": 3,
#             "formatter": "detailed",
#             "level": logging.INFO,
#         },
#         "error": {
#             "class": "logging.handlers.RotatingFileHandler",
#             "filename": str(LOGS_DIR / "error.log"),
#             "maxBytes": 10 * 1024 * 1024,
#             "backupCount": 3,
#             "formatter": "detailed",
#             "level": logging.ERROR,
#         },
#     },
#     "root": {
#         "handlers": ["console", "info", "error"],
#         "level": logging.INFO,
#         "propagate": True,
#     },
# }

# logging.config.dictConfig(logging_config)
# logger = logging.getLogger(__name__)

print(f"[MLflow] tracking_uri={MLFLOW_TRACKING_URI} | default_experiment={DEFAULT_EXPERIMENT}")
