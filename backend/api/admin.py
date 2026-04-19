from django.contrib import admin
from .models import User, Category, Product, Cart, CartItem, Order, OrderItem, Favorite, Review

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_staff', 'date_joined')
    search_fields = ('username', 'email')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock', 'rating', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    inlines = [CartItemInline]

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_amount', 'status', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    list_editable = ('status',)
    inlines = [OrderItemInline]
    readonly_fields = ('created_at', 'packed_at', 'shipped_at', 'out_for_delivery_at', 'delivered_at', 'cancelled_at')
    fieldsets = (
        ('Order Info', {
            'fields': ('user', 'total_amount', 'status', 'payment_method')
        }),
        ('Shipping', {
            'fields': ('first_name', 'last_name', 'address_line_1', 'city', 'state', 'postal_code', 'country', 'phone')
        }),
        ('Payment', {
            'fields': ('razorpay_order_id', 'razorpay_payment_id'),
            'classes': ('collapse',)
        }),
        ('Tracking Timestamps', {
            'fields': ('created_at', 'packed_at', 'shipped_at', 'out_for_delivery_at', 'delivered_at', 'cancelled_at'),
        }),
    )

    def save_model(self, request, obj, form, change):
        """Auto-set tracking timestamps when status is changed via admin."""
        if change and 'status' in form.changed_data:
            from django.utils import timezone
            now = timezone.now()
            timestamp_map = {
                'Packed': 'packed_at',
                'Shipped': 'shipped_at',
                'Out for Delivery': 'out_for_delivery_at',
                'Delivered': 'delivered_at',
                'Cancelled': 'cancelled_at',
            }
            if obj.status in timestamp_map:
                setattr(obj, timestamp_map[obj.status], now)
        super().save_model(request, obj, form, change)

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'user__username', 'product__name')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__email', 'product__name', 'comment')
    readonly_fields = ('created_at', 'updated_at')
