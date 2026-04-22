"""
Cart serializers.

Handles serialization for cart items and the cart itself,
including computed total price.
"""

from rest_framework import serializers
from api.models import Cart, CartItem, Product
from apps.products.serializers import ProductSerializer


class CartItemSerializer(serializers.ModelSerializer):
    """
    Serializer for individual cart items.

    Provides full product details on read, accepts product_id on write.
    """
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity']


class CartSerializer(serializers.ModelSerializer):
    """
    Serializer for the shopping cart.

    Includes nested cart items and a computed total_price field.
    """
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_price']

    def get_total_price(self, obj):
        """Calculate the total price of all items in the cart."""
        return sum(item.product.price * item.quantity for item in obj.items.all())
