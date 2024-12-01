from rest_framework import permissions
from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics
from .models import RestaurantProfile
from .serializers import RestaurantProfileSerializer
from .permissions import IsRestaurantManager


class RestaurantProfileView(generics.RetrieveUpdateAPIView):
    queryset = RestaurantProfile.objects.all()
    serializer_class = RestaurantProfileSerializer
    # permission_classes = [permissions.IsAuthenticated, IsRestaurantManager]


    @swagger_auto_schema(
        operation_description="Retrieve a restaurant's profile details.",
        responses={
            200: RestaurantProfileSerializer,
            404: 'Restaurant profile not found'
        }
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Update the restaurant's profile details.",
        responses={
            200: RestaurantProfileSerializer,
            404: 'Restaurant profile not found'
        },
        request_body=RestaurantProfileSerializer
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
