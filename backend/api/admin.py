"""
Django Admin configuration for PetKart models.

This file stays in the `api` app alongside the models it registers.
Uses the shared ORDER_STATUS_TIMESTAMP_MAP from core.mixins to avoid
duplicating the timestamp-setting logic.
"""

from django.contrib import admin
from django.utils import timezone

from .models import (
    User, Category, Product, Cart, CartItem,
    Order, OrderItem, Favorite, Review,
)
from apps.core.mixins import ORDER_STATUS_TIMESTAMP_MAP


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """Admin configuration for the User model."""
    list_display = ('username', 'email', 'is_staff', 'date_joined')
    search_fields = ('username', 'email')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin configuration for the Category model."""
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Admin configuration for the Product model."""
    list_display = ('name', 'category', 'price', 'stock', 'rating', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}


class CartItemInline(admin.TabularInline):
    """Inline display of cart items within the Cart admin."""
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    """Admin configuration for the Cart model."""
    list_display = ('user', 'created_at')
    inlines = [CartItemInline]


class OrderItemInline(admin.TabularInline):
    """Inline display of order items within the Order admin."""
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Order model.

    Uses the shared ORDER_STATUS_TIMESTAMP_MAP for automatic
    timestamp tracking when status is changed via the admin panel.
    """
    list_display = ('id', 'user', 'total_amount', 'status', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    list_editable = ('status',)
    inlines = [OrderItemInline]
    readonly_fields = (
        'created_at', 'packed_at', 'shipped_at',
        'out_for_delivery_at', 'delivered_at', 'cancelled_at',
    )
    fieldsets = (
        ('Order Info', {
            'fields': ('user', 'total_amount', 'status', 'payment_method')
        }),
        ('Shipping', {
            'fields': (
                'first_name', 'last_name', 'address_line_1',
                'city', 'state', 'postal_code', 'country', 'phone',
            )
        }),
        ('Payment', {
            'fields': ('razorpay_order_id', 'razorpay_payment_id'),
            'classes': ('collapse',),
        }),
        ('Tracking Timestamps', {
            'fields': (
                'created_at', 'packed_at', 'shipped_at',
                'out_for_delivery_at', 'delivered_at', 'cancelled_at',
            ),
        }),
    )

    def save_model(self, request, obj, form, change):
        """Auto-set tracking timestamps when status is changed via admin."""
        if change and 'status' in form.changed_data:
            if obj.status in ORDER_STATUS_TIMESTAMP_MAP:
                setattr(obj, ORDER_STATUS_TIMESTAMP_MAP[obj.status], timezone.now())
        super().save_model(request, obj, form, change)


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    """Admin configuration for the Favorite model."""
    list_display = ('user', 'product', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'user__username', 'product__name')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    """Admin configuration for the Review model."""
    list_display = ('user', 'product', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__email', 'product__name', 'comment')
    readonly_fields = ('created_at', 'updated_at')
