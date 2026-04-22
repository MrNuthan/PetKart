"""
Custom exception classes for consistent API error responses.

All exceptions inherit from DRF's APIException so they are automatically
caught by DRF's exception handler and converted to proper JSON responses
with appropriate HTTP status codes.
"""

from rest_framework.exceptions import APIException
from rest_framework import status


class ServiceException(APIException):
    """
    Base exception for service-layer errors.

    Raise this (or a subclass) from any service method to return
    a structured error response to the client.
    """
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "A service error occurred."
    default_code = "service_error"


class PaymentGatewayError(ServiceException):
    """Raised when a payment gateway operation fails."""
    status_code = status.HTTP_502_BAD_GATEWAY
    default_detail = "Payment gateway error. Please try again later."
    default_code = "payment_gateway_error"


class PaymentNotConfiguredError(ServiceException):
    """Raised when payment gateway credentials are missing."""
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = "Payment gateway is not configured. Please contact support."
    default_code = "payment_not_configured"


class InsufficientStockError(ServiceException):
    """Raised when a product does not have enough stock."""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Insufficient stock for one or more products."
    default_code = "insufficient_stock"


class EmptyCartError(ServiceException):
    """Raised when attempting to place an order with an empty cart."""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Cart is empty. Add items before placing an order."
    default_code = "empty_cart"


class InvalidStatusTransitionError(ServiceException):
    """Raised when an invalid order status transition is attempted."""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Invalid status transition."
    default_code = "invalid_status"
