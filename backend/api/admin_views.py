from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta

from .models import User, Product, Order, OrderItem, Review, Category
from .admin_serializers import (
    AdminUserSerializer, AdminOrderSerializer, AdminProductSerializer,
    AdminReviewSerializer
)

import logging
logger = logging.getLogger(__name__)


class DashboardAnalyticsView(APIView):
    """Compute real-time analytics for the admin dashboard."""
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        # Totals
        total_revenue = Order.objects.exclude(
            status='Cancelled'
        ).aggregate(total=Sum('total_amount'))['total'] or 0

        total_orders = Order.objects.count()
        total_users = User.objects.filter(is_staff=False).count()
        total_products = Product.objects.count()

        # Sales data — last 7 days
        today = timezone.now().date()
        seven_days_ago = today - timedelta(days=6)

        sales_qs = (
            Order.objects
            .filter(created_at__date__gte=seven_days_ago)
            .exclude(status='Cancelled')
            .annotate(day=TruncDate('created_at'))
            .values('day')
            .annotate(sales=Sum('total_amount'))
            .order_by('day')
        )

        # Build a full 7-day array (fill missing days with 0)
        sales_map = {entry['day']: float(entry['sales'] or 0) for entry in sales_qs}
        day_names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        sales_data = []
        for i in range(7):
            d = seven_days_ago + timedelta(days=i)
            sales_data.append({
                'name': day_names[d.weekday()],
                'sales': sales_map.get(d, 0),
                'date': str(d),
            })

        # Recent orders for activity feed
        recent_orders = Order.objects.order_by('-created_at')[:5]
        recent_activity = []
        for order in recent_orders:
            customer = f"{order.first_name} {order.last_name}".strip() or order.user.username
            recent_activity.append({
                'id': order.id,
                'customer': customer,
                'amount': float(order.total_amount),
                'status': order.status,
                'created_at': order.created_at.isoformat(),
            })

        return Response({
            'totalRevenue': float(total_revenue),
            'totalOrders': total_orders,
            'totalUsers': total_users,
            'totalProducts': total_products,
            'salesData': sales_data,
            'recentActivity': recent_activity,
        })


class AdminOrderViewSet(viewsets.ReadOnlyModelViewSet):
    """Admin view for managing orders — list all, view details, update status."""
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = AdminOrderSerializer
    permission_classes = [permissions.IsAdminUser]

    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')

        valid_statuses = [s[0] for s in Order.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response(
                {'error': f'Invalid status. Choose from: {valid_statuses}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Set timestamps based on status transition
        now = timezone.now()
        timestamp_map = {
            'Packed': 'packed_at',
            'Shipped': 'shipped_at',
            'Out for Delivery': 'out_for_delivery_at',
            'Delivered': 'delivered_at',
            'Cancelled': 'cancelled_at',
        }

        if new_status in timestamp_map:
            setattr(order, timestamp_map[new_status], now)

        order.status = new_status
        order.save()

        serializer = self.get_serializer(order)
        logger.info(f"Admin updated Order #{order.id} status to '{new_status}'")
        return Response(serializer.data)


class AdminProductViewSet(viewsets.ModelViewSet):
    """Admin CRUD for products — supports image upload via multipart."""
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = AdminProductSerializer
    permission_classes = [permissions.IsAdminUser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        logger.info(f"Admin created product: {product.name} (ID: {product.id})")
        return Response(
            AdminProductSerializer(product, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        logger.info(f"Admin updated product: {product.name} (ID: {product.id})")
        return Response(AdminProductSerializer(product, context={'request': request}).data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        name = instance.name
        instance.delete()
        logger.info(f"Admin deleted product: {name}")
        return Response({'success': True}, status=status.HTTP_200_OK)


class AdminUserViewSet(viewsets.ReadOnlyModelViewSet):
    """Admin view for listing users and viewing details."""
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminReviewViewSet(viewsets.ModelViewSet):
    """Admin view for managing reviews — list all, delete inappropriate ones."""
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = AdminReviewSerializer
    permission_classes = [permissions.IsAdminUser]
    http_method_names = ['get', 'delete', 'head', 'options']

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        product = instance.product
        instance.delete()
        # Product rating auto-updates via Review.delete() override
        logger.info(f"Admin deleted review #{instance.id} for product '{product.name}'")
        return Response({'success': True}, status=status.HTTP_200_OK)


class AdminCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Admin view for listing categories (used in product forms)."""
    queryset = Category.objects.all().order_by('name')
    permission_classes = [permissions.IsAdminUser]

    def list(self, request, *args, **kwargs):
        categories = self.get_queryset()
        data = [{'id': c.id, 'name': c.name, 'slug': c.slug} for c in categories]
        return Response(data)
