"""
Cart URL configuration.

Clean RESTful routes for shopping cart operations.
All routes are prefixed with /api/ by the root URL conf.

Endpoints:
    GET    /api/cart/                    → Get cart
    POST   /api/cart/add/               → Add item
    PUT    /api/cart/update/             → Update quantity
    DELETE /api/cart/remove/{product_id}/ → Remove item
    DELETE /api/cart/clear/              → Clear cart
"""

from django.urls import path

from .views import CartView, CartAddView, CartUpdateView, CartRemoveView, CartClearView

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart-detail'),
    path('cart/add/', CartAddView.as_view(), name='cart-add'),
    path('cart/update/', CartUpdateView.as_view(), name='cart-update'),
    path('cart/remove/<int:product_id>/', CartRemoveView.as_view(), name='cart-remove'),
    path('cart/clear/', CartClearView.as_view(), name='cart-clear'),
]
