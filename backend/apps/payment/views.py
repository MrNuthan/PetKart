"""
Payment views.

Simple, clean payment endpoints for Razorpay integration.
Delegates all business logic to PaymentService and OrderService.

Endpoints:
    POST /api/payment/create/  → Create a Razorpay payment order
    POST /api/payment/verify/  → Verify Razorpay payment signature
"""

import logging

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.orders.services import OrderService

logger = logging.getLogger(__name__)


class PaymentCreateView(APIView):
    """
    POST /api/payment/create/

    Create a payment order. This is an alternative entry point that
    creates both the order and the Razorpay payment in one call.

    Body: {
        "address_line_1": "123 Main St",
        "city": "Mumbai",
        "postal_code": "400001",
        "first_name": "John",
        "last_name": "Doe",
        "payment_method": "razorpay"  (default)
    }

    Returns: Order data with razorpay_order_id for client-side checkout.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Create a new order with payment."""
        from apps.orders.serializers import OrderSerializer

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


class PaymentVerifyView(APIView):
    """
    POST /api/payment/verify/

    Verify a Razorpay payment after client-side checkout completes.

    Body: {
        "razorpay_payment_id": "pay_xxx",
        "razorpay_order_id": "order_xxx",
        "razorpay_signature": "signature_xxx"
    }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Verify Razorpay payment signature."""
        from apps.orders.serializers import OrderSerializer

        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_signature = request.data.get('razorpay_signature')

        if not all([razorpay_payment_id, razorpay_order_id, razorpay_signature]):
            return Response(
                {'error': 'Missing payment verification data.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order = OrderService.verify_and_confirm_payment(
            user=request.user,
            razorpay_payment_id=razorpay_payment_id,
            razorpay_order_id=razorpay_order_id,
            razorpay_signature=razorpay_signature,
        )

        serializer = OrderSerializer(order, context={'request': request})
        return Response({
            'status': 'Payment verified successfully',
            'order': serializer.data,
        })
