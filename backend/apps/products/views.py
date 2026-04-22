"""
Product views.

Thin view layer — delegates to ProductService and ReviewService.
Views handle only request/response concerns.
"""

from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from api.models import Category, Product, Favorite, Review
from apps.core.permissions import IsAdminOrReadOnly
from .serializers import (
    CategorySerializer, ProductSerializer,
    ReviewSerializer, FavoriteSerializer,
)
from .services import ProductService, ReviewService


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for product categories.

    - GET  /categories/     → List all categories (public)
    - POST /categories/     → Create category (admin only)
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint for products.

    Supports filtering via query params:
        - ?category=DogFood  → Filter by category name
        - ?featured=true     → Show only featured products
        - ?search=toy        → Search by name/description

    Actions:
        - GET /products/{id}/reviews/ → List reviews for a product
    """
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

    def get_queryset(self):
        """Return optimized, filtered product queryset."""
        return ProductService.get_product_list(
            category_name=self.request.query_params.get('category'),
            featured=self.request.query_params.get('featured'),
        )

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def reviews(self, request, pk=None):
        """Get all reviews for a specific product."""
        reviews = ReviewService.get_reviews_for_product(pk)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)


class FavoriteViewSet(viewsets.ModelViewSet):
    """
    API endpoint for user favorites (wishlists).

    - GET    /favorites/         → List user's favorites
    - POST   /favorites/         → Add a product to favorites
    - DELETE /favorites/{product_id}/ → Remove from favorites
    """
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return only the authenticated user's favorites."""
        return Favorite.objects.filter(
            user=self.request.user
        ).select_related('product', 'product__category')

    def create(self, request):
        """Add a product to the user's favorites (idempotent)."""
        product_id = request.data.get('product_id')
        if not product_id:
            return Response(
                {'error': 'product_id is required'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        favorite, created = Favorite.objects.get_or_create(
            user=request.user, product_id=product_id,
        )
        serializer = self.get_serializer(favorite)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )

    def destroy(self, request, pk=None):
        """Remove a product from favorites by product_id."""
        try:
            favorite = Favorite.objects.get(user=request.user, product_id=pk)
            favorite.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Favorite.DoesNotExist:
            return Response(
                {'error': 'Favorite not found'},
                status=status.HTTP_404_NOT_FOUND,
            )


class ReviewViewSet(viewsets.ModelViewSet):
    """
    API endpoint for product reviews.

    - POST /reviews/          → Create or update a review
    - GET  /reviews/my_reviews/ → List authenticated user's reviews
    - GET  /reviews/for_product/?product_id=X → List reviews for a product
    """
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return only the authenticated user's reviews."""
        return Review.objects.filter(
            user=self.request.user
        ).select_related('user', 'product')

    def create(self, request):
        """
        Create or update a product review.

        Delegates all validation (delivery check, rating range) to ReviewService.
        """
        product_id = request.data.get('product_id')
        rating = request.data.get('rating')

        if not product_id or rating is None:
            return Response(
                {'error': 'product_id and rating are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            rating = int(rating)
        except (ValueError, TypeError):
            return Response(
                {'error': 'Rating must be an integer between 1 and 5.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        review, created = ReviewService.create_or_update_review(
            user=request.user,
            product_id=product_id,
            rating=rating,
            comment=request.data.get('comment', ''),
            order_id=request.data.get('order_id'),
        )

        serializer = self.get_serializer(review)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )

    @action(detail=False, methods=['get'])
    def my_reviews(self, request):
        """Get all reviews by the authenticated user."""
        reviews = self.get_queryset()
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def for_product(self, request):
        """Get all reviews for a specific product (public)."""
        product_id = request.query_params.get('product_id')
        if not product_id:
            return Response(
                {'error': 'product_id query param is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        reviews = ReviewService.get_reviews_for_product(product_id)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
