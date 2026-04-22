"""
Product serializers.

Handles serialization for products, categories, reviews, and favorites.
Validation logic lives in serializers — not in views.
"""

from rest_framework import serializers
from api.models import Category, Product, Review, Favorite
from apps.core.mixins import get_full_name


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for product categories."""

    class Meta:
        model = Category
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer for product listing and detail views.

    Includes computed fields:
        - category_name: Human-readable category name
        - review_count: Number of reviews for the product
    """
    category_name = serializers.ReadOnlyField(source='category.name')
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_review_count(self, obj):
        """Return the number of reviews, safely handling missing relations."""
        try:
            return obj.reviews.count()
        except Exception:
            return 0


class ReviewSerializer(serializers.ModelSerializer):
    """
    Serializer for product reviews.

    Includes validation for:
        - Rating must be between 1 and 5
        - product_id is required for creation
    """
    user_name = serializers.SerializerMethodField()
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = Review
        fields = [
            'id', 'user', 'user_name', 'product', 'product_name',
            'order', 'rating', 'comment', 'created_at', 'updated_at',
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_user_name(self, obj):
        """Return the reviewer's display name."""
        return get_full_name(obj.user)

    def validate_rating(self, value):
        """Ensure rating is within the valid range."""
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value


class FavoriteSerializer(serializers.ModelSerializer):
    """Serializer for user favorites (wishlists)."""
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = Favorite
        fields = ['id', 'product', 'product_id', 'created_at']
