from django.apps import AppConfig


class CartConfig(AppConfig):
    """Configuration for the Cart domain app."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.cart'
    label = 'app_cart'
    verbose_name = 'Cart'
