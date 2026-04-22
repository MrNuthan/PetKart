"""
PetKart Settings Package
========================

Defaults to development settings for local use.
Override with DJANGO_SETTINGS_MODULE env var for production.
"""

from .development import *  # noqa: F401, F403
