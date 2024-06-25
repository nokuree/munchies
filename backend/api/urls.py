from django.urls import path
from .views import nearby_open_restaurants_view

urlpatterns = [
    path('api/nearby_open_restaurants/', nearby_open_restaurants_view, name='nearby_open_restaurants'),
]