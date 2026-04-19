from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .admin_views import (
    DashboardAnalyticsView,
    AdminOrderViewSet,
    AdminProductViewSet,
    AdminUserViewSet,
    AdminReviewViewSet,
    AdminCategoryViewSet,
)

router = DefaultRouter()
router.register(r'orders', AdminOrderViewSet, basename='admin-orders')
router.register(r'products', AdminProductViewSet, basename='admin-products')
router.register(r'users', AdminUserViewSet, basename='admin-users')
router.register(r'reviews', AdminReviewViewSet, basename='admin-reviews')
router.register(r'categories', AdminCategoryViewSet, basename='admin-categories')

urlpatterns = [
    path('dashboard/analytics/', DashboardAnalyticsView.as_view(), name='admin-analytics'),
    path('', include(router.urls)),
]
