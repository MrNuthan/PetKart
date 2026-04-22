"""
Order service layer.

Contains all order business logic:
    - Order creation from cart
    - Razorpay payment integration
    - Payment verification
    - Order status management

This is the largest service — it replaces ~150 lines of logic
previously embedded in OrderViewSet and AdminOrderViewSet.
"""

import logging
from decimal import Decimal

from django.conf import settings
from django.db.models import F
from django.shortcuts import get_object_or_404
from django.utils import timezone

from api.models import Cart, Order, OrderItem, Product
from apps.core.exceptions import (
    EmptyCartError,
    InsufficientStockError,
    PaymentGatewayError,
    PaymentNotConfiguredError,
    InvalidStatusTransitionError,
)
from apps.core.mixins import ORDER_STATUS_TIMESTAMP_MAP

logger = logging.getLogger(__name__)


class PaymentService:
    """Handles Razorpay payment gateway operations."""

    @staticmethod
    def create_razorpay_order(amount: Decimal) -> str:
        """
        Create a Razorpay order for the given amount.

        Args:
            amount: Order total in INR (decimal).

        Returns:
            str: The Razorpay order ID.

        Raises:
            PaymentNotConfiguredError: If Razorpay credentials are missing.
            PaymentGatewayError: If the Razorpay API call fails.
        """
        try:
            import razorpay
        except ImportError:
            raise PaymentGatewayError(
                "Payment system unavailable. Please try Cash on Delivery."
            )

        key_id = getattr(settings, 'RAZORPAY_KEY_ID', None)
        key_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', None)

        if not key_id or not key_secret:
            logger.error("Razorpay credentials not configured in settings.")
            raise PaymentNotConfiguredError()

        try:
            client = razorpay.Client(auth=(key_id, key_secret))
            razorpay_order = client.order.create({
                "amount": int(amount * 100),  # Convert to paise
                "currency": "INR",
                "payment_capture": "1",
            })
            order_id = razorpay_order['id']
            logger.info(f"Razorpay order created: {order_id} for ₹{amount}")
            return order_id

        except Exception as e:
            logger.error(f"Razorpay order creation failed: {e}")
            raise PaymentGatewayError(f"Payment gateway error: {e}")

    @staticmethod
    def verify_payment(razorpay_payment_id, razorpay_order_id, razorpay_signature):
        """
        Verify a Razorpay payment signature.

        Args:
            razorpay_payment_id: The payment ID from Razorpay callback.
            razorpay_order_id: The order ID from Razorpay.
            razorpay_signature: The HMAC signature for verification.

        Returns:
            bool: True if verification succeeds.

        Raises:
            PaymentGatewayError: If verification fails.
        """
        try:
            import razorpay

            client = razorpay.Client(auth=(
                settings.RAZORPAY_KEY_ID,
                settings.RAZORPAY_KEY_SECRET,
            ))
            client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature,
            })
            return True

        except Exception as e:
            logger.error(f"Payment verification failed: {e}")
            raise PaymentGatewayError(
                "Payment verification failed. Please contact support."
            )


class OrderService:
    """Handles order-related business operations."""

    @staticmethod
    def create_order(user, shipping_data: dict) -> Order:
        """
        Create an order from the user's cart.

        Steps:
            1. Validate the cart is not empty
            2. Calculate total from cart items
            3. Create Razorpay order if payment_method is 'razorpay'
            4. Create the Order and OrderItem records
            5. Clear the cart

        Args:
            user: The authenticated User instance.
            shipping_data: Dictionary containing shipping and payment info:
                - first_name, last_name
                - address_line_1 (required)
                - city (required)
                - postal_code (required)
                - state, phone (optional)
                - payment_method (default: 'razorpay')

        Returns:
            Order: The created order instance.

        Raises:
            EmptyCartError: If the cart is empty.
            ValidationError: If required shipping fields are missing.
            PaymentGatewayError: If Razorpay order creation fails.
        """
        # Step 1: Validate cart
        cart = Cart.objects.filter(user=user).first()
        if not cart or not cart.items.exists():
            raise EmptyCartError()

        # Step 2: Calculate total & validate stock
        cart_items = list(cart.items.select_related('product').all())
        total_amount = sum(
            item.product.price * item.quantity for item in cart_items
        )

        # Validate stock BEFORE creating a Razorpay order or DB records
        for item in cart_items:
            if item.product.stock < item.quantity:
                raise InsufficientStockError(
                    f"'{item.product.name}' only has {item.product.stock} "
                    f"unit(s) in stock. Please reduce your quantity."
                )

        # Extract shipping data with defaults
        payment_method = shipping_data.get('payment_method', 'razorpay')

        # Step 3: Create Razorpay order if needed
        razorpay_order_id = None
        if payment_method == 'razorpay':
            razorpay_order_id = PaymentService.create_razorpay_order(total_amount)

        # Step 4: Create order
        order = Order.objects.create(
            user=user,
            total_amount=total_amount,
            payment_method=payment_method,
            first_name=shipping_data.get('first_name', user.first_name or ''),
            last_name=shipping_data.get('last_name', user.last_name or ''),
            address_line_1=shipping_data.get('address_line_1', ''),
            city=shipping_data.get('city', ''),
            state=shipping_data.get('state', ''),
            postal_code=shipping_data.get('postal_code', ''),
            phone=shipping_data.get('phone', ''),
            razorpay_order_id=razorpay_order_id,
            status='Placed',
        )

        # Create order items from cart
        order_items = [
            OrderItem(
                order=order,
                product=item.product,
                price=item.product.price,
                quantity=item.quantity,
            )
            for item in cart_items
        ]
        OrderItem.objects.bulk_create(order_items)

        # Step 4b: Deduct stock atomically using F() expressions.
        # F() updates happen at the DB level, preventing race conditions
        # when multiple users order the same product simultaneously.
        for item in cart_items:
            Product.objects.filter(pk=item.product.pk).update(
                stock=F('stock') - item.quantity
            )
        logger.info(f"Stock deducted for {len(cart_items)} product(s) in Order #{order.id}")

        # Step 5: Clear cart
        # For COD orders, clear immediately (no payment verification step).
        # For Razorpay orders, defer clearing until payment is verified,
        # so the user can retry if payment fails.
        if payment_method == 'cod':
            cart.items.all().delete()
            logger.info(f"Cart cleared for COD order #{order.id}")

        logger.info(
            f"Order #{order.id} created for {user.email}. "
            f"Total: ₹{total_amount}, Payment: {payment_method}"
        )
        return order

    @staticmethod
    def verify_and_confirm_payment(user, razorpay_payment_id, razorpay_order_id, razorpay_signature):
        """
        Verify payment and update the order.

        Args:
            user: The authenticated User instance.
            razorpay_payment_id: Payment ID from Razorpay.
            razorpay_order_id: Order ID from Razorpay.
            razorpay_signature: HMAC signature for verification.

        Returns:
            Order: The updated order instance.
        """
        PaymentService.verify_payment(
            razorpay_payment_id, razorpay_order_id, razorpay_signature,
        )

        order = get_object_or_404(
            Order, razorpay_order_id=razorpay_order_id, user=user,
        )
        order.status = 'Placed'
        order.razorpay_payment_id = razorpay_payment_id
        order.save(update_fields=['status', 'razorpay_payment_id'])

        # Clear the cart now that payment is verified
        cart = Cart.objects.filter(user=user).first()
        if cart:
            cart.items.all().delete()
            logger.info(f"Cart cleared after payment verification for Order #{order.id}")

        logger.info(f"Payment verified for Order #{order.id}: {razorpay_payment_id}")
        return order

    @staticmethod
    def update_status(order, new_status):
        """
        Update order status with automatic timestamp tracking.

        This method is shared between consumer and admin views,
        eliminating the duplicate timestamp logic.

        Args:
            order: The Order instance to update.
            new_status: The new status string.

        Returns:
            Order: The updated order instance.

        Raises:
            InvalidStatusTransitionError: If the status is invalid.
        """
        valid_statuses = [s[0] for s in Order.STATUS_CHOICES]
        if new_status not in valid_statuses:
            raise InvalidStatusTransitionError(
                f"Invalid status. Choose from: {valid_statuses}"
            )

        # Set tracking timestamp
        if new_status in ORDER_STATUS_TIMESTAMP_MAP:
            setattr(order, ORDER_STATUS_TIMESTAMP_MAP[new_status], timezone.now())

        order.status = new_status
        order.save()

        logger.info(f"Order #{order.id} status updated to '{new_status}'")
        return order
