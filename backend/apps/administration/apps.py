from django.apps import AppConfig


class AdministrationConfig(AppConfig):
    """Configuration for the Administration domain app."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.administration'
    label = 'app_administration'
    verbose_name = 'Administration'
