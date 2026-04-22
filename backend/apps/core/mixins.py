"""
Shared mixins and utility functions used across multiple apps.

Centralizing these prevents duplication and ensures consistent
behavior throughout the API.
"""


def get_image_absolute_url(image_field, request=None):
    """
    Build an absolute URL for an ImageField value.

    Args:
        image_field: A Django ImageField instance (e.g., product.image).
        request: The current HTTP request (used to build absolute URI).

    Returns:
        str | None: The absolute URL string, or None if no image is set.
    """
    if not image_field:
        return None
    if request:
        return request.build_absolute_uri(image_field.url)
    return image_field.url


def get_full_name(user):
    """
    Return the user's full name, falling back to username.

    Args:
        user: A User model instance.

    Returns:
        str: Full name or username.
    """
    full_name = f"{user.first_name} {user.last_name}".strip()
    return full_name or user.username


# Order status → timestamp field mapping.
# Used by OrderService, OrderAdmin, and AdminOrderViewSet.
ORDER_STATUS_TIMESTAMP_MAP = {
    'Packed': 'packed_at',
    'Shipped': 'shipped_at',
    'Out for Delivery': 'out_for_delivery_at',
    'Delivered': 'delivered_at',
    'Cancelled': 'cancelled_at',
}
