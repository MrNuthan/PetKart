"""
PetKart Data Models
===================

All models live in the `api` app to preserve migration history
and avoid the complexity of cross-app model migration (Option A architecture).

Domain apps (users, products, cart, orders, administration) import
these models directly: `from api.models import Product`

Models:
    - User: Custom user with email as primary identifier
    - Category: Product category for organization
    - Product: Items available for purchase
    - Cart / CartItem: Shopping cart (one per user)
    - Order / OrderItem: Placed orders with tracking
    - Favorite: User wishlists
    - Review: Product reviews (one per user per product)
"""

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


# =============================================================================
# User
# =============================================================================

class User(AbstractUser):
    """
    Custom user model using email as the primary authentication field.

    Extends Django's AbstractUser with additional profile fields
    (address, phone) commonly needed in e-commerce applications.
    """
    email = models.EmailField(unique=True)
    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        ordering = ['-date_joined']

    def __str__(self):
        return self.email


# =============================================================================
# Products & Categories
# =============================================================================

class Category(models.Model):
    """Product category for organizing the catalog."""
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    """
    A purchasable product in the catalog.

    The `rating` field is automatically recalculated via update_rating()
    whenever a Review is created, updated, or deleted.
    """
    category = models.ForeignKey(
        Category, related_name='products', on_delete=models.CASCADE
    )
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def update_rating(self):
        """Recalculate the average rating from all associated reviews."""
        reviews = self.reviews.all()
        if reviews.exists():
            avg = reviews.aggregate(models.Avg('rating'))['rating__avg']
            self.rating = round(avg, 2)
        else:
            self.rating = 0.00
        self.save(update_fields=['rating'])


# =============================================================================
# Cart
# =============================================================================

class Cart(models.Model):
    """
    Shopping cart — one per user (OneToOneField).

    The cart is lazily created on first access via CartService.get_or_create_cart().
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart of {self.user.email}"


class CartItem(models.Model):
    """An individual item in a user's shopping cart."""
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'product')

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"


# =============================================================================
# Orders
# =============================================================================

class Order(models.Model):
    """
    A placed order with shipping info, payment details, and status tracking.

    Status transitions are managed by OrderService.update_status(),
    which automatically sets the corresponding timestamp field.
    """
    STATUS_CHOICES = (
        ('Placed', 'Placed'),
        ('Packed', 'Packed'),
        ('Shipped', 'Shipped'),
        ('Out for Delivery', 'Out for Delivery'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    )

    PAYMENT_METHOD_CHOICES = (
        ('razorpay', 'Razorpay'),
        ('cod', 'Cash on Delivery'),
    )

    user = models.ForeignKey(User, related_name='orders', on_delete=models.CASCADE)

    # Pricing
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    # Order state
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Placed')

    # Payment
    payment_method = models.CharField(
        max_length=20, choices=PAYMENT_METHOD_CHOICES, default='razorpay'
    )
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)

    # Shipping / Customer Info
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    address_line_1 = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default="India")
    phone = models.CharField(max_length=20, blank=True, null=True)

    # Tracking timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    packed_at = models.DateTimeField(blank=True, null=True)
    shipped_at = models.DateTimeField(blank=True, null=True)
    out_for_delivery_at = models.DateTimeField(blank=True, null=True)
    delivered_at = models.DateTimeField(blank=True, null=True)
    cancelled_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.id} - {self.user.email} - {self.status} ({self.payment_method})"


class OrderItem(models.Model):
    """A single line item within an order, capturing the price at time of purchase."""
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"


# =============================================================================
# Favorites & Reviews
# =============================================================================

class Favorite(models.Model):
    """A user's wishlisted product. Unique per user + product pair."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.product.name}"


class Review(models.Model):
    """
    Product review — one per user per product.

    On save/delete, automatically recalculates the parent product's
    average rating via Product.update_rating().
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name='reviews',
        null=True, blank=True
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.product.name} ({self.rating}★)"

    def save(self, *args, **kwargs):
        """Save review and recalculate product rating."""
        super().save(*args, **kwargs)
        self.product.update_rating()

    def delete(self, *args, **kwargs):
        """Delete review and recalculate product rating."""
        product = self.product
        super().delete(*args, **kwargs)
        product.update_rating()
