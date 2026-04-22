"""
User views.

Clean RESTful endpoints for authentication and profile management.
All business logic is delegated to UserService.

Endpoints:
    POST /api/users/register/   → Register a new user
    POST /api/users/login/      → Login (JWT token pair)
    POST /api/users/token/refresh/ → Refresh JWT token
    GET  /api/users/profile/    → Get current user's profile
    PUT  /api/users/profile/    → Update current user's profile
"""

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import UserSerializer
from .services import UserService


class RegisterView(APIView):
    """
    POST /api/users/register/

    Create a new user account. No authentication required.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """Register a new user with email, username, and password."""
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    """
    POST /api/users/login/

    Authenticate user and return JWT access + refresh tokens.
    Accepts email and password in the request body.
    """
    permission_classes = [permissions.AllowAny]


class TokenRefreshAPIView(TokenRefreshView):
    """
    POST /api/users/token/refresh/

    Refresh an expired access token using a valid refresh token.
    """
    permission_classes = [permissions.AllowAny]


class ProfileView(APIView):
    """
    GET /api/users/profile/  → Retrieve authenticated user's profile
    PUT /api/users/profile/  → Update authenticated user's profile

    Accepts any subset of: first_name, last_name, email, phone, address.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Return the authenticated user's profile."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        """Update the authenticated user's profile."""
        user = UserService.update_profile(request.user, request.data)
        serializer = UserSerializer(user)
        return Response(serializer.data)
