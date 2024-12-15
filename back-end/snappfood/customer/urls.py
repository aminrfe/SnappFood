from django.urls import path
from .views import CustomerProfileView, FavoriteView

urlpatterns = [
    path('profile', CustomerProfileView.as_view(), name='user-customer-profile'),
    path('favorites', FavoriteView.as_view(), name='customer-favorite-restaurants'),
]
