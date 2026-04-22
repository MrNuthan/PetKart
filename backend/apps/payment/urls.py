"""
Payment URL configuration.

Clean RESTful routes for payment operations.
All routes are prefixed with /api/ by the root URL conf.

Endpoints:
    POST /api/payment/create/  → Create payment order
    POST /api/payment/verify/  → Verify payment
"""

from django.urls import path

from .views import PaymentCreateView, PaymentVerifyView

urlpatterns = [
    path('payment/create/', PaymentCreateView.as_view(), name='payment-create'),
    path('payment/verify/', PaymentVerifyView.as_view(), name='payment-verify'),
]
