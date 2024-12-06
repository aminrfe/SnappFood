from django.urls import path
from .views import RestaurantProfileView, ItemListCreateView, ItemRetrieveUpdateView

urlpatterns = [
    path('<int:id>/profile', RestaurantProfileView.as_view(), name='restaurant-profile'),

    path('restaurants/<int:restaurant_id>/items', ItemListCreateView.as_view(), name='item-list-create'),
    path('restaurants/<int:restaurant_id>/items/<int:id>', ItemRetrieveUpdateView.as_view(), name='item-retrieve-update'),
]
