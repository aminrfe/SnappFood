from django.urls import path
from .views import CustomerProfileView, FavoriteView, CartListCreateView, CartDetailView, CartItemDeleteView

urlpatterns = [
    path('carts', CartListCreateView.as_view(), name='cart-list-create'),
    path('carts/<int:id>', CartDetailView.as_view(), name='cart-detail'),
    path('carts/<int:id>/items/<int:cart_item_id>', CartItemDeleteView.as_view(), name='cart-item-delete'),
    path('profile', CustomerProfileView.as_view(), name='customer-profile'),  
    path('favorites', FavoriteView.as_view(), name='customer-favorite-restaurants'),
]
