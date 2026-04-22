"""
Shared permission classes for the PetKart API.

These permissions are used across multiple domain apps to enforce
consistent access control throughout the application.
"""

from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Allow read-only access to any request, but require admin (is_staff)
    privileges for any write operation (POST, PUT, PATCH, DELETE).

    Usage:
        permission_classes = [IsAdminOrReadOnly]
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Allow access only to the object owner or admin users.

    Requires the object to have a `user` attribute that references
    the owning user.

    Usage:
        permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    """

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.user == request.user
