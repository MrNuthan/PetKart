"""
Cart views.

Clean RESTful endpoints for shopping cart operations.
All business logic is delegated to CartService.

Endpoints:
    GET    /api/cart/             → Get cart contents
    POST   /api/cart/add/        → Add item to cart
    PUT    /api/cart/update/      → Update item quantity
    DELETE /api/cart/remove/{id}/ → Remove item from cart
    DELETE /api/cart/clear/       → Clear entire cart
"""

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import CartSerializer
from .services import CartService


class CartView(APIView):
    """
    GET /api/cart/

    Return the authenticated user's cart with all items and total price.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Return the user's cart contents."""
        cart = CartService.get_or_create_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class CartAddView(APIView):
    """
    POST /api/cart/add/

    Add a product to the cart. If already present, increments quantity.
    Body: { "product_id": int, "quantity": int (optional, default 1) }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Add a product to the cart."""
        CartService.add_item(
            user=request.user,
            product_id=request.data.get('product_id'),
            quantity=int(request.data.get('quantity', 1)),
        )
        return Response({'status': 'item added'}, status=status.HTTP_200_OK)


class CartUpdateView(APIView):
    """
    PUT /api/cart/update/

    Update the quantity of a product in the cart.
    Body: { "product_id": int, "quantity": int }
    """
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        """Update item quantity in the cart."""
        CartService.update_item(
            user=request.user,
            product_id=request.data.get('product_id'),
            quantity=int(request.data.get('quantity', 1)),
        )
        return Response({'status': 'item updated'}, status=status.HTTP_200_OK)


class CartRemoveView(APIView):
    """
    DELETE /api/cart/remove/{product_id}/

    Remove a specific product from the cart by product ID.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, product_id):
        """Remove a product from the cart."""
        CartService.remove_item(user=request.user, product_id=product_id)
        return Response({'status': 'item removed'}, status=status.HTTP_200_OK)


class CartClearView(APIView):
    """
    DELETE /api/cart/clear/

    Remove all items from the cart.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        """Clear all items from the cart."""
        CartService.clear(request.user)
        return Response({'status': 'cart cleared'}, status=status.HTTP_200_OK)
