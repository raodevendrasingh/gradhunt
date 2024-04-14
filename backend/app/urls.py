from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

urlpatterns = [
    path('', home, name='home'),
    path('api/managers/', create_manager, name='create_manager'),
    path('api/check-username/', CheckUsernameView.as_view(), name='check-username'),
    path('api/check-email/', CheckEmailView.as_view(), name='check-email'),
]