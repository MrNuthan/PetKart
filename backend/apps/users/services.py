"""
User service layer.

Encapsulates business logic for user operations, keeping views thin.
"""

from api.models import User


class UserService:
    """Handles user-related business operations."""

    ALLOWED_PROFILE_FIELDS = ('first_name', 'last_name', 'email', 'phone', 'address')

    @staticmethod
    def update_profile(user: User, data: dict) -> User:
        """
        Update a user's profile with the provided data.

        Only fields in ALLOWED_PROFILE_FIELDS are updated; unknown keys
        are silently ignored so the view doesn't need to filter them.

        Args:
            user: The User instance to update.
            data: Dictionary of field names → new values.

        Returns:
            The updated User instance.
        """
        updated_fields = []
        for field in UserService.ALLOWED_PROFILE_FIELDS:
            if field in data:
                setattr(user, field, data[field])
                updated_fields.append(field)

        if updated_fields:
            user.save(update_fields=updated_fields)

        return user
