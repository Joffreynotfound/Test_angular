from django.urls import path
from .views import surface_view, resistance_view, register_view
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("surface/", surface_view, name="surface"),            
    path("resistance/", resistance_view, name="resistance"),
    path("register/", register_view, name="register"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
