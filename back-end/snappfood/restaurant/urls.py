from django.urls import path
from .views import MyRestaurantProfileView, PublicRestaurantProfileView, ItemListCreateView, ItemDetailView, RestaurantListView, SalesReportView
from order.views import RestaurantOrderListView, UpdateOrderStatusView

urlpatterns = [
    path('profiles', RestaurantListView.as_view(), name='restaurant-profile-list'),
    path('profiles/me', MyRestaurantProfileView.as_view(), name='restaurant-profile'),
    path('profiles/<int:id>', PublicRestaurantProfileView.as_view(), name='public-restaurant-profile'),
    path('items', ItemListCreateView.as_view(), name='item-list-create'),
    path('items/<int:pk>', ItemDetailView.as_view(), name='item-detail'),
    path('orders', RestaurantOrderListView.as_view(), name='order-list'),
    path('orders/<int:id>/status', UpdateOrderStatusView.as_view(), name='update-order-status'),
    path('sales-reports', SalesReportView.as_view(), name='sales-report'),

]
