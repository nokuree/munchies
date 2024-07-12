from django.urls import path
from api import views
urlpatterns = [
    path('api/nearby_open_restaurants/', views.nearby_open_restaurants_view, name='nearby_open_restaurants'),
    
]