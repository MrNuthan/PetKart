"""
PetKart Django Settings — Development Overrides
================================================

Extends base.py with development-friendly defaults.
This is the default settings module used by manage.py and start_server.py.
"""

from .base import *  # noqa: F401, F403


# =============================================================================
# Debug
# =============================================================================

DEBUG = True


# =============================================================================
# CORS — Allow all origins in development
# =============================================================================

CORS_ALLOW_ALL_ORIGINS = True


# =============================================================================
# Logging — Verbose output for development
# =============================================================================

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '[{asctime}] {levelname} {name}: {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'apps': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}
