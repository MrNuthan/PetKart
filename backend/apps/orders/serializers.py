"""
Order serializers.

Handles serialization for orders and order items.
"""

from rest_framework import serializers
from api.models import Order, OrderItem
from apps.core.mixins import get_image_absolute_url


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer for individual order items.

    Includes product details needed for the order summary display.
    """
    product_name = serializers.ReadOnlyField(source='product.name')
    product_id = serializers.ReadOnlyField(source='product.id')
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'product_id', 'product_image', 'price', 'quantity']

    def get_product_image(self, obj):
        """Build absolute URL for the product's image."""
        if obj.product:
            return get_image_absolute_url(
                obj.product.image,
                self.context.get('request'),
            )
        return None


class OrderSerializer(serializers.ModelSerializer):
    """
    Serializer for orders.

    Includes nested order items with product details.
    Most fields are read-only (set by the service layer, not by the client).
    """
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = [
            'user', 'total_amount', 'status',
            'razorpay_order_id', 'razorpay_payment_id',
            'created_at', 'packed_at', 'shipped_at',
            'out_for_delivery_at', 'delivered_at', 'cancelled_at',
        ]

    def validate_payment_method(self, value):
        """Ensure payment method is valid."""
        valid_methods = [choice[0] for choice in Order.PAYMENT_METHOD_CHOICES]
        if value not in valid_methods:
            raise serializers.ValidationError(
                f"Invalid payment method. Choose from: {valid_methods}"
            )
        return value
