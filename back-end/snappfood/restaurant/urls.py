from django.urls import path
from .views import RestaurantProfileView, ItemListCreateView, ItemDetailView, RestaurantListView, SalesReportView
from order.views import RestaurantOrderListView, UpdateOrderStatusView

urlpatterns = [
    path('<int:id>/profile', RestaurantProfileView.as_view(), name='restaurant-profile'),
    path('items', ItemListCreateView.as_view(), name='item-list-create'),
    path('items/<int:pk>', ItemDetailView.as_view(), name='item-detail'),

    path('orders', RestaurantOrderListView.as_view(), name='order-list'),
    path('orders/<int:id>/status', UpdateOrderStatusView.as_view(), name='update-order-status'),
    path('profiles', RestaurantListView.as_view(), name='restaurant-profile-list'),
    path('sales-reports', SalesReportView.as_view(), name='sales-report'),

]
