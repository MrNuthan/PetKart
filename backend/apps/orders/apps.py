from django.apps import AppConfig


class OrdersConfig(AppConfig):
    """Configuration for the Orders domain app."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.orders'
    label = 'app_orders'
    verbose_name = 'Orders'
