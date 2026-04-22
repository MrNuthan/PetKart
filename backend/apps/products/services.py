"""
Product service layer.

Encapsulates business logic for products, reviews, and favorites.
Uses optimized ORM queries with select_related / prefetch_related.
"""

import logging
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound, ValidationError

from api.models import Product, Review, Order, Favorite

logger = logging.getLogger(__name__)


class ProductService:
    """Handles product-related business operations."""

    @staticmethod
    def get_product_list(category_name=None, featured=None, search=None):
        """
        Return a filtered and optimized product queryset.

        Args:
            category_name: Filter by category name (exact match).
            featured: If 'true', show only featured products.
            search: Search term for name/description (handled by DRF filter backend).

        Returns:
            QuerySet: Optimized Product queryset.
        """
        queryset = Product.objects.select_related('category').prefetch_related('reviews')

        if category_name:
            queryset = queryset.filter(category__name=category_name)
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(featured=True)

        return queryset

    @staticmethod
    def get_product(product_id):
        """
        Retrieve a single product by ID.

        Args:
            product_id: The product's primary key.

        Returns:
            Product: The product instance.

        Raises:
            NotFound: If the product does not exist.
        """
        product = Product.objects.select_related('category').filter(id=product_id).first()
        if not product:
            raise NotFound("Product not found.")
        return product


class ReviewService:
    """Handles review-related business operations."""

    @staticmethod
    def create_or_update_review(user, product_id, rating, comment='', order_id=None):
        """
        Create or update a review for a product.

        Business rules enforced:
            1. User must have a delivered order containing this product.
            2. If order_id is specified, that order must be delivered and contain the product.
            3. One review per user per product (upsert).

        Args:
            user: The authenticated User instance.
            product_id: ID of the product being reviewed.
            rating: Integer rating (1–5).
            comment: Optional review text.
            order_id: Optional specific order to link the review to.

        Returns:
            tuple: (Review instance, bool created)

        Raises:
            ValidationError: If business rules are violated.
        """
        product = get_object_or_404(Product, id=product_id)

        # Validate delivery status
        if order_id:
            order = get_object_or_404(Order, id=order_id, user=user)
            if order.status != 'Delivered':
                raise ValidationError(
                    {"error": "You can only review products from delivered orders."}
                )
            if not order.items.filter(product=product).exists():
                raise ValidationError(
                    {"error": "This product was not part of the specified order."}
                )
        else:
            has_delivered = Order.objects.filter(
                user=user,
                status='Delivered',
                items__product=product,
            ).exists()
            if not has_delivered:
                raise ValidationError(
                    {"error": "You can only review products you have received."}
                )

        # Create or update (unique_together on user + product)
        review, created = Review.objects.update_or_create(
            user=user,
            product=product,
            defaults={
                'rating': rating,
                'comment': comment,
                'order_id': order_id,
            },
        )

        action = "created" if created else "updated"
        logger.info(f"Review {action} by {user.email} for product '{product.name}' ({rating}★)")

        return review, created

    @staticmethod
    def get_reviews_for_product(product_id):
        """
        Return all reviews for a product, ordered by newest first.

        Args:
            product_id: ID of the product.

        Returns:
            QuerySet: Review queryset with related user data.
        """
        return Review.objects.filter(
            product_id=product_id
        ).select_related('user', 'product').order_by('-created_at')
