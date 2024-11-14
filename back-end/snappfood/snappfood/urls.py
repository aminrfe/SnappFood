# snappfood/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin', admin.site.urls),
    path('api/auth/', include('user.urls')), 
    path('api/customer/', include('customer.urls')), 
    # path('api/restaurant/', include('restaurant.urls')),  
]
