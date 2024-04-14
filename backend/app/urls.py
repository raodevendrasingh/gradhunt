from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

urlpatterns = [
    path('', home, name='home'),
    path('api/managers/', create_manager, name='create_manager'),
]