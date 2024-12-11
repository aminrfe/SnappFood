# snappfood/urls.py
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="SnappFood API",
      default_version='v1',
      description="API documentation for SnappFood project",
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin', admin.site.urls),
    path('api/auth/', include('user.urls')), 
    path('api/customer/', include('customer.urls')), 
    path('api/restaurant/', include('restaurant.urls')),  
    path('swagger', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-ui'),
    path('redoc', schema_view.with_ui('redoc', cache_timeout=0), name='redoc-ui'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)