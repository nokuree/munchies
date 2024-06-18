from django.urls import path
from .views import MyView

urlpatterns = [

    path('views/', MyView.as_view(), name='home'),

]