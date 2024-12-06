from django.urls import path
from .views import RestaurantProfileView, ItemView

urlpatterns = [
    path('<int:id>/profile', RestaurantProfileView.as_view(), name='restaurant-profile'),
    path('<int:restaurant_id>/items/', ItemView.as_view(), name='item-list-create'),
    path('<int:restaurant_id>/items/<int:id>/', ItemView.as_view(), name='item-detail'),
]
