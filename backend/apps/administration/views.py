"""
Administration views.

Admin-only views for the dashboard and CRUD management.
Reuses OrderService.update_status() instead of duplicating timestamp logic.
"""

import logging

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import User, Product, Order, Review, Category
from apps.orders.services import OrderService
from .serializers import (
    AdminUserSerializer, AdminOrderSerializer,
    AdminProductSerializer, AdminReviewSerializer,
)
from .services import AnalyticsService

logger = logging.getLogger(__name__)


class DashboardAnalyticsView(APIView):
    """
    GET /api/admin/dashboard/analytics/

    Returns real-time dashboard analytics (admin only).
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        """Return dashboard analytics data."""
        data = AnalyticsService.get_dashboard_data()
        return Response(data)


class AdminOrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Admin view for order management.

    - GET   /admin/orders/           → List all orders
    - GET   /admin/orders/{id}/      → Order detail
    - PATCH /admin/orders/{id}/update-status/ → Update status
    """
    queryset = Order.objects.select_related('user').prefetch_related(
        'items__product'
    ).order_by('-created_at')
    serializer_class = AdminOrderSerializer
    permission_classes = [permissions.IsAdminUser]

    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        """
        Update order status.

        Delegates to OrderService.update_status() — the single source
        of truth for status transitions and timestamp tracking.
        """
        order = self.get_object()
        new_status = request.data.get('status')

        order = OrderService.update_status(order, new_status)

        serializer = self.get_serializer(order)
        logger.info(f"Admin updated Order #{order.id} status to '{new_status}'")
        return Response(serializer.data)


class AdminProductViewSet(viewsets.ModelViewSet):
    """
    Admin CRUD for products.

    Supports image upload via multipart/form-data.
    """
    queryset = Product.objects.select_related('category').order_by('-created_at')
    serializer_class = AdminProductSerializer
    permission_classes = [permissions.IsAdminUser]

    def create(self, request, *args, **kwargs):
        """Create a new product."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        logger.info(f"Admin created product: {product.name} (ID: {product.id})")
        return Response(
            AdminProductSerializer(product, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        """Update an existing product (full or partial)."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        logger.info(f"Admin updated product: {product.name} (ID: {product.id})")
        return Response(
            AdminProductSerializer(product, context={'request': request}).data,
        )

    def partial_update(self, request, *args, **kwargs):
        """Partial update (PATCH)."""
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Delete a product."""
        instance = self.get_object()
        name = instance.name
        instance.delete()
        logger.info(f"Admin deleted product: {name}")
        return Response({'success': True}, status=status.HTTP_200_OK)


class AdminUserViewSet(viewsets.ReadOnlyModelViewSet):
    """Admin view for listing users and viewing details."""
    queryset = User.objects.prefetch_related('orders').order_by('-date_joined')
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminReviewViewSet(viewsets.ModelViewSet):
    """
    Admin view for managing reviews.

    Only GET and DELETE are allowed — admins cannot create/edit reviews.
    """
    queryset = Review.objects.select_related(
        'user', 'product'
    ).order_by('-created_at')
    serializer_class = AdminReviewSerializer
    permission_classes = [permissions.IsAdminUser]
    http_method_names = ['get', 'delete', 'head', 'options']

    def destroy(self, request, *args, **kwargs):
        """Delete an inappropriate review."""
        instance = self.get_object()
        product = instance.product
        instance.delete()
        logger.info(f"Admin deleted review #{instance.id} for product '{product.name}'")
        return Response({'success': True}, status=status.HTTP_200_OK)


class AdminCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Admin view for listing categories (used in product forms)."""
    queryset = Category.objects.all().order_by('name')
    permission_classes = [permissions.IsAdminUser]

    def list(self, request, *args, **kwargs):
        """Return categories as simple id/name/slug dicts."""
        categories = self.get_queryset()
        data = [{'id': c.id, 'name': c.name, 'slug': c.slug} for c in categories]
        return Response(data)
