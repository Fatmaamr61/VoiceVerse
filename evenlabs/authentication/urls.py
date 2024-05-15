from rest_framework.routers import DefaultRouter
from .views import LoginView, UserViewSet, PasswordResetViewSet
from knox.views import LogoutView, LogoutAllView
from django.urls import path


router = DefaultRouter()
router.register(r"users", UserViewSet, basename='user')
router.register(r'password-reset', PasswordResetViewSet, basename='password-reset')

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('logoutAll/', LogoutAllView.as_view(), name='logout-all'),

]

urlpatterns += router.urls
