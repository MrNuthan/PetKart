from django.apps import AppConfig


class ProductsConfig(AppConfig):
    """Configuration for the Products domain app."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.products'
    label = 'app_products'
    verbose_name = 'Products'
