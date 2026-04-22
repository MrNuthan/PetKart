from django.apps import AppConfig


class UsersConfig(AppConfig):
    """Configuration for the Users domain app."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'
    label = 'app_users'
    verbose_name = 'Users'
