from django.urls import path
from .views import CustomerProfileView, FavoriteView, CartListCreateView, CartDetailView, GetItemReviewsView, CartItemDeleteView, MenuItemsView, MenuItemDetailView, OrderListCreateView, CreateReviewView

urlpatterns = [
    path('carts', CartListCreateView.as_view(), name='cart-list-create'),
    path('carts/<int:id>', CartDetailView.as_view(), name='cart-detail'),
    path('carts/<int:id>/items/<int:cart_item_id>', CartItemDeleteView.as_view(), name='cart-item-delete'),
    path('restaurants/<int:restaurant_id>/items', MenuItemsView.as_view(), name='menu-items'),
    path('restaurants/<int:restaurant_id>/items/<int:item_id>', MenuItemDetailView.as_view(), name='menu-item-detail'),
    path('profile', CustomerProfileView.as_view(), name='customer-profile'),  
    path('favorites', FavoriteView.as_view(), name='customer-favorite-restaurants'),
    path('orders', OrderListCreateView.as_view(), name='order-list-create'),
    path('reviews/create', CreateReviewView.as_view(), name='create-review'),
    path('items/<int:item_id>/reviews/', GetItemReviewsView.as_view(), name='get-item-reviews'),
]
