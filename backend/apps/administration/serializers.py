"""
Admin-specific serializers.

These serializers provide enriched data for the admin dashboard,
including computed fields like customer names and order counts.
Reuses shared helpers from apps.core.mixins to avoid duplication.
"""

from rest_framework import serializers
from api.models import User, Product, Order, OrderItem, Review
from apps.core.mixins import get_full_name, get_image_absolute_url


class AdminUserSerializer(serializers.ModelSerializer):
    """
    User serializer for admin panel.

    Includes order count and computed full name for display.
    """
    order_count = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'name', 'phone', 'address', 'is_staff', 'is_active',
            'date_joined', 'order_count',
        ]

    def get_order_count(self, obj):
        """Return total number of orders placed by this user."""
        return obj.orders.count()

    def get_name(self, obj):
        """Return computed display name."""
        return get_full_name(obj)


class AdminOrderItemSerializer(serializers.ModelSerializer):
    """Order item serializer for admin view with product image."""
    product_name = serializers.ReadOnlyField(source='product.name')
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'price', 'quantity', 'product_image']

    def get_product_image(self, obj):
        """Build absolute URL for the product image."""
        if obj.product:
            return get_image_absolute_url(
                obj.product.image,
                self.context.get('request'),
            )
        return None


class AdminOrderSerializer(serializers.ModelSerializer):
    """
    Order serializer for admin panel.

    Includes customer info and nested order items.
    """
    items = AdminOrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.SerializerMethodField()
    customer_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Order
        fields = [
            'id', 'customer_name', 'customer_email',
            'total_amount', 'status', 'payment_method',
            'first_name', 'last_name', 'address_line_1', 'city',
            'state', 'postal_code', 'phone',
            'created_at', 'packed_at', 'shipped_at',
            'out_for_delivery_at', 'delivered_at', 'cancelled_at',
            'items',
        ]

    def get_customer_name(self, obj):
        """Return the best available customer name."""
        name = f"{obj.first_name} {obj.last_name}".strip()
        if not name:
            name = get_full_name(obj.user)
        return name


class AdminProductSerializer(serializers.ModelSerializer):
    """
    Product serializer for admin panel.

    Supports image upload and writable category foreign key.
    """
    category_name = serializers.ReadOnlyField(source='category.name')
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'stock',
            'image', 'rating', 'featured', 'category', 'category_name',
            'review_count', 'created_at', 'updated_at',
        ]

    def get_review_count(self, obj):
        """Return review count, handling missing relations gracefully."""
        try:
            return obj.reviews.count()
        except Exception:
            return 0


class AdminReviewSerializer(serializers.ModelSerializer):
    """
    Review serializer for admin panel.

    Includes user and product details for display.
    """
    user_name = serializers.SerializerMethodField()
    product_name = serializers.ReadOnlyField(source='product.name')
    user_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Review
        fields = [
            'id', 'user', 'user_name', 'user_email',
            'product', 'product_name',
            'rating', 'comment', 'created_at', 'updated_at',
        ]

    def get_user_name(self, obj):
        """Return reviewer's display name."""
        return get_full_name(obj.user)
