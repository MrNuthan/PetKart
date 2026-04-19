from rest_framework import serializers
from .models import User, Category, Product, Order, OrderItem, Review
from django.db.models import Count


class AdminUserSerializer(serializers.ModelSerializer):
    """User serializer for admin panel — includes order count and staff status."""
    order_count = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'name', 'phone', 'address', 'is_staff', 'is_active',
            'date_joined', 'order_count'
        ]

    def get_order_count(self, obj):
        return obj.orders.count()

    def get_name(self, obj):
        full = f"{obj.first_name} {obj.last_name}".strip()
        return full or obj.username


class AdminOrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'price', 'quantity', 'product_image']

    def get_product_image(self, obj):
        if obj.product and obj.product.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.product.image.url)
            return obj.product.image.url
        return None


class AdminOrderSerializer(serializers.ModelSerializer):
    """Order serializer for admin — includes customer info and items."""
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
            'items'
        ]

    def get_customer_name(self, obj):
        name = f"{obj.first_name} {obj.last_name}".strip()
        if not name:
            name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return name or obj.user.username


class AdminProductSerializer(serializers.ModelSerializer):
    """Product serializer for admin — supports image upload and writable category."""
    category_name = serializers.ReadOnlyField(source='category.name')
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'stock',
            'image', 'rating', 'featured', 'category', 'category_name',
            'review_count', 'created_at', 'updated_at'
        ]

    def get_review_count(self, obj):
        try:
            return obj.reviews.count()
        except Exception:
            return 0


class AdminReviewSerializer(serializers.ModelSerializer):
    """Review serializer for admin — includes user and product names."""
    user_name = serializers.SerializerMethodField()
    product_name = serializers.ReadOnlyField(source='product.name')
    user_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Review
        fields = [
            'id', 'user', 'user_name', 'user_email',
            'product', 'product_name',
            'rating', 'comment', 'created_at', 'updated_at'
        ]

    def get_user_name(self, obj):
        full = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full or obj.user.username
