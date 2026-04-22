"""
User URL configuration.

Clean RESTful routes for authentication and profile management.
All routes are prefixed with /api/ by the root URL conf.

Endpoints:
    POST /api/users/register/       → Register
    POST /api/users/login/          → Login (JWT)
    POST /api/users/token/refresh/  → Refresh JWT
    GET  /api/users/profile/        → Get profile
    PUT  /api/users/profile/        → Update profile
"""

from django.urls import path

from .views import RegisterView, LoginView, TokenRefreshAPIView, ProfileView

urlpatterns = [
    path('users/register/', RegisterView.as_view(), name='user-register'),
    path('users/login/', LoginView.as_view(), name='user-login'),
    path('users/token/refresh/', TokenRefreshAPIView.as_view(), name='token-refresh'),
    path('users/profile/', ProfileView.as_view(), name='user-profile'),
]
