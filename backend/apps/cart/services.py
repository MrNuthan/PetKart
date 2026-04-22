"""
Cart service layer.

Encapsulates all cart business logic: add, remove, update, and clear items.
Stock validation is enforced before adding items.
"""

import logging
from django.shortcuts import get_object_or_404

from api.models import Cart, CartItem, Product
from apps.core.exceptions import InsufficientStockError

logger = logging.getLogger(__name__)


class CartService:
    """Handles cart-related business operations."""

    @staticmethod
    def get_or_create_cart(user):
        """
        Retrieve or create a cart for the given user.

        Args:
            user: The authenticated User instance.

        Returns:
            Cart: The user's cart instance.
        """
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    @staticmethod
    def add_item(user, product_id, quantity=1):
        """
        Add a product to the user's cart, or increment quantity if already present.

        Args:
            user: The authenticated User instance.
            product_id: ID of the product to add.
            quantity: Number of units to add (default: 1).

        Returns:
            CartItem: The created or updated cart item.

        Raises:
            InsufficientStockError: If the product doesn't have enough stock.
        """
        cart = CartService.get_or_create_cart(user)
        product = get_object_or_404(Product, id=product_id)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        new_quantity = quantity if created else cart_item.quantity + quantity

        # Validate stock availability
        if product.stock < new_quantity:
            raise InsufficientStockError(
                f"Only {product.stock} units of '{product.name}' are available."
            )

        cart_item.quantity = new_quantity
        cart_item.save()

        logger.debug(f"Cart item {'added' if created else 'updated'}: {product.name} x{new_quantity}")
        return cart_item

    @staticmethod
    def remove_item(user, product_id):
        """
        Remove a product from the user's cart.

        Args:
            user: The authenticated User instance.
            product_id: ID of the product to remove.
        """
        cart = get_object_or_404(Cart, user=user)
        item = get_object_or_404(CartItem, cart=cart, product_id=product_id)
        item.delete()
        logger.debug(f"Cart item removed: product_id={product_id}")

    @staticmethod
    def update_item(user, product_id, quantity):
        """
        Set the quantity of a product in the user's cart.

        Args:
            user: The authenticated User instance.
            product_id: ID of the product to update.
            quantity: New quantity value.

        Returns:
            CartItem: The updated cart item.
        """
        cart = CartService.get_or_create_cart(user)
        product = get_object_or_404(Product, id=product_id)
        cart_item, _ = CartItem.objects.get_or_create(cart=cart, product=product)

        cart_item.quantity = quantity
        cart_item.save()

        logger.debug(f"Cart item set: {product.name} x{quantity}")
        return cart_item

    @staticmethod
    def clear(user):
        """
        Remove all items from the user's cart.

        Args:
            user: The authenticated User instance.
        """
        cart = Cart.objects.filter(user=user).first()
        if cart:
            count = cart.items.count()
            cart.items.all().delete()
            logger.debug(f"Cart cleared: {count} items removed")
