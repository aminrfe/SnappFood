from django.urls import path
from .views import CustomerProfileView, FavoriteView, CartView

urlpatterns = [
    path('cart/<int:restaurant_id>', CartView.as_view(), name='cart-detail'),
    path('profile', CustomerProfileView.as_view(), name='customer-profile'),
    path('favorites', FavoriteView.as_view(), name='customer-favorite-restaurants'),
]
