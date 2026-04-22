"""
Order views.

Clean RESTful endpoints for order management.
All business logic is delegated to OrderService.

Endpoints:
    POST /api/orders/            → Create order from cart
    GET  /api/orders/            → List user's orders
    GET  /api/orders/{id}/       → Order detail
    PUT  /api/orders/{id}/status/ → Update order status (admin)
"""

import logging

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Order
from .serializers import OrderSerializer
from .services import OrderService

logger = logging.getLogger(__name__)


class OrderListCreateView(APIView):
    """
    GET  /api/orders/  → List authenticated user's orders
    POST /api/orders/  → Create a new order from the user's cart

    Admin users can see all orders via GET.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """List orders for the current user (admin sees all)."""
        if request.user.is_staff:
            orders = Order.objects.all().select_related('user').prefetch_related(
                'items__product'
            ).order_by('-created_at')
        else:
            orders = Order.objects.filter(
                user=request.user
            ).prefetch_related('items__product').order_by('-created_at')

        serializer = OrderSerializer(orders, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        """
        Create a new order from the user's cart.

        Required fields: address_line_1, city, postal_code.
        Optional: first_name, last_name, state, phone, payment_method.
        """
        required_fields = ('address_line_1', 'city', 'postal_code')
        missing = [f for f in required_fields if not request.data.get(f)]
        if missing:
            return Response(
                {'error': f"Missing required fields: {', '.join(missing)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order = OrderService.create_order(
            user=request.user,
            shipping_data=request.data,
        )

        serializer = OrderSerializer(order, context={'request': request})
        response_data = serializer.data

        if order.razorpay_order_id:
            response_data['razorpay_order_id'] = order.razorpay_order_id
            # Return the exact paise amount computed via Decimal arithmetic.
            # The frontend MUST use this value directly — never recalculate
            # from total_amount to avoid floating-point precision mismatches
            # that cause Razorpay to reject the payment.
            response_data['razorpay_amount'] = int(order.total_amount * 100)

        return Response(response_data, status=status.HTTP_201_CREATED)


class OrderDetailView(APIView):
    """
    GET /api/orders/{id}/

    Retrieve a single order by ID.
    Users can only view their own orders; admins can view any.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        """Return order details."""
        if request.user.is_staff:
            try:
                order = Order.objects.select_related('user').prefetch_related(
                    'items__product'
                ).get(id=order_id)
            except Order.DoesNotExist:
                return Response(
                    {'error': 'Order not found.'},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            try:
                order = Order.objects.prefetch_related(
                    'items__product'
                ).get(id=order_id, user=request.user)
            except Order.DoesNotExist:
                return Response(
                    {'error': 'Order not found.'},
                    status=status.HTTP_404_NOT_FOUND,
                )

        serializer = OrderSerializer(order, context={'request': request})
        return Response(serializer.data)


class OrderStatusUpdateView(APIView):
    """
    PUT /api/orders/{id}/status/

    Update order status with automatic timestamp tracking (admin only).
    Body: { "status": "Shipped" }
    """
    permission_classes = [permissions.IsAdminUser]

    def put(self, request, order_id):
        """Update order status."""
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        new_status = request.data.get('status')
        order = OrderService.update_status(order, new_status)

        serializer = OrderSerializer(order, context={'request': request})
        logger.info(f"Admin updated Order #{order.id} status to '{new_status}'")
        return Response(serializer.data)
