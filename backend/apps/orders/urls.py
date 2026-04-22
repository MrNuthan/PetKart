"""
Order URL configuration.

Clean RESTful routes for order management.
All routes are prefixed with /api/ by the root URL conf.

Endpoints:
    POST /api/orders/              → Create order
    GET  /api/orders/              → List orders
    GET  /api/orders/{id}/         → Order detail
    PUT  /api/orders/{id}/status/  → Update status (admin)
"""

from django.urls import path

from .views import OrderListCreateView, OrderDetailView, OrderStatusUpdateView

urlpatterns = [
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<int:order_id>/', OrderDetailView.as_view(), name='order-detail'),
    path('orders/<int:order_id>/status/', OrderStatusUpdateView.as_view(), name='order-status-update'),
]
