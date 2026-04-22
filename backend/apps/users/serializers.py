"""
User serializers.

Handles serialization and validation for user registration,
profile retrieval, and profile updates.
"""

from rest_framework import serializers
from api.models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration and profile display.

    - Accepts password on write (create) but never exposes it on read.
    - Validates email uniqueness on creation.
    """

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'address', 'phone', 'is_staff', 'password',
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 8},
        }

    def validate_email(self, value):
        """Ensure email is unique (case-insensitive)."""
        qs = User.objects.filter(email__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def create(self, validated_data):
        """Create user with properly hashed password."""
        return User.objects.create_user(**validated_data)
