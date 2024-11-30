from django.urls import path
from .views import RestaurantProfileView

urlpatterns = [
    path('<int:pk>/profile', RestaurantProfileView.as_view(), name='restaurant-profile'),
]
