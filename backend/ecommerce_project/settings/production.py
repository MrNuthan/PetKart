"""
PetKart Django Settings — Production Overrides
===============================================

Extends base.py with production-hardened defaults.
Activate by setting DJANGO_SETTINGS_MODULE=ecommerce_project.settings.production
"""

from .base import *  # noqa: F401, F403
from decouple import config


# =============================================================================
# Security
# =============================================================================

DEBUG = False

SECRET_KEY = config('SECRET_KEY')  # Must be set in production .env

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='',
    cast=lambda v: [s.strip() for s in v.split(',') if s.strip()]
)

# HTTPS settings
SECURE_SSL_REDIRECT = config('SECURE_SSL_REDIRECT', default=True, cast=bool)
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
