from django.urls import path
from .views import RestaurantProfileView, ItemListCreateView, ItemRetrieveUpdateView
from order.views import RestaurantOrderListView, UpdateOrderStatusView

urlpatterns = [
    path('<int:id>/profile', RestaurantProfileView.as_view(), name='restaurant-profile'),
    path('<int:restaurant_id>/items', ItemListCreateView.as_view(), name='item-list-create'),
    path('<int:restaurant_id>/items/<int:id>', ItemRetrieveUpdateView.as_view(), name='item-retrieve-update'),

    path('<int:restaurant_id>/orders', RestaurantOrderListView.as_view(), name='order-list'),
    path('<int:restaurant_id>/orders/<int:id>/status', UpdateOrderStatusView.as_view(), name='update-order-status'),

]
