from django.apps import AppConfig


class PaymentConfig(AppConfig):
    """Configuration for the Payment domain app."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.payment'
    label = 'app_payment'
    verbose_name = 'Payment'
