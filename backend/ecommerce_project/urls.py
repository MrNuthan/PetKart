"""
PetKart Root URL Configuration
==============================

Single /api/ prefix routes requests to domain apps.
Each app defines its own clean, RESTful URL patterns.

API Structure:
    /api/products/       → Product catalog
    /api/categories/     → Product categories
    /api/users/          → Auth & profile management
    /api/cart/           → Shopping cart
    /api/orders/         → Order management
    /api/payment/        → Payment processing
    /api/favorites/      → User wishlists
    /api/reviews/        → Product reviews
    /api/admin/          → Admin dashboard
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Django admin site
    path('admin/', admin.site.urls),

    # Consumer API — single /api/ prefix, each app owns its routes
    path('api/', include('apps.products.urls')),     # /api/products/*, /api/categories/*
    path('api/', include('apps.users.urls')),         # /api/users/*
    path('api/', include('apps.cart.urls')),           # /api/cart/*
    path('api/', include('apps.orders.urls')),         # /api/orders/*
    path('api/', include('apps.payment.urls')),        # /api/payment/*

    # Admin Dashboard API
    path('api/admin/', include('apps.administration.urls')),  # /api/admin/*
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
