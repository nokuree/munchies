from django.urls import path
from api import views
urlpatterns = [
    path('api/nearby_open_restaurants/', views.nearby_open_restaurants_view, name='nearby_open_restaurants'),
    path('api/save_location/', views.save_location_view, name='save_location'),
    path('api/chat/', views.chat, name='gpt')
]