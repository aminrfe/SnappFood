from django.utils import timezone
from django.http import Http404
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from .models import RestaurantProfile, Item
from .serializers import RestaurantProfileSerializer, ItemSerializer
from .permissions import IsRestaurantManager
import pytz


class RestaurantProfileView(generics.RetrieveUpdateAPIView):
    queryset = RestaurantProfile.objects.all()
    serializer_class = RestaurantProfileSerializer
    lookup_field = 'id'
    # permission_classes = [permissions.IsAuthenticated, IsRestaurantManager]


    @swagger_auto_schema(
        operation_summary="Retrieve a restaurant's profile details.",
        responses={
            200: RestaurantProfileSerializer,
            404: 'Restaurant profile not found'
        }
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Update the restaurant's profile details",
        responses={
            200: RestaurantProfileSerializer,
            404: 'Restaurant profile not found'
        },
        request_body=RestaurantProfileSerializer
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    
class ItemListCreateView(generics.ListCreateAPIView):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated, IsRestaurantManager]

    @swagger_auto_schema(
        operation_summary="List Items",
        responses={
            200: ItemSerializer(many=True),
            401: "Unauthorized",
            403: "Forbidden"
        }
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Create Item",
        responses={
            201: ItemSerializer,
            401: "Unauthorized",
            403: "Forbidden"
        },
        request_body=ItemSerializer
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def get_queryset(self):
        restaurant = self.request.user.restaurant_profile 
        return Item.objects.filter(restaurant=restaurant)

    def perform_create(self, serializer):
        restaurant = self.request.user.restaurant_profile
        serializer.save(restaurant=restaurant)

class ItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated, IsRestaurantManager]

    @swagger_auto_schema(
        operation_summary="Retrieve Item",
        responses={
            200: ItemSerializer,
            401: "Unauthorized",
            403: "Forbidden",
            404: "Item not found"
        }
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Update Item",
        responses={
            200: ItemSerializer,
            401: "Unauthorized",
            403: "Forbidden",
            404: "Item not found"
        },
        request_body=ItemSerializer
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Delete Item",
        responses={
            204: "No Content",
            401: "Unauthorized",
            403: "Forbidden",
            404: "Item not found"
        }
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)

    def get_queryset(self):
        restaurant = self.request.user.restaurant_profile  
        return Item.objects.filter(restaurant=restaurant)
    
    def get_object(self):
        queryset = self.get_queryset()
        pk = self.kwargs.get('pk')
        try:
            return queryset.get(pk=pk)
        except Item.DoesNotExist:
            raise Http404("Item not found.")


class RestaurantListView(APIView):

    @swagger_auto_schema(
        operation_summary="Retrieve a list of restaurants filtered by name, business type, and open/closed status.",
        manual_parameters=[
            openapi.Parameter(
                'name',
                openapi.IN_QUERY,
                description="Filter by restaurant name (case-insensitive partial match).",
                type=openapi.TYPE_STRING
            ),
            openapi.Parameter(
                'business_type',
                openapi.IN_QUERY,
                description="Filter by business type (case-insensitive partial match).",
                type=openapi.TYPE_STRING
            ),
            openapi.Parameter(
                'is_open',
                openapi.IN_QUERY,
                description='Filter by open/closed status ("true" for open, "false" for closed).',
                type=openapi.TYPE_STRING,
                enum=["true", "false"]
            ),
        ],
        responses={
            200: openapi.Response(
                description="List of restaurants matching the filters.",
                schema=RestaurantProfileSerializer(many=True)
            ),
            400: "Invalid request parameters."
        }
    )
    def get(self, request):
        name = request.query_params.get('name', None)
        business_type = request.query_params.get('business_type', None)
        is_open = request.query_params.get('is_open', None)
        
        desired_timezone = pytz.timezone('Asia/Tehran')

        current_time = timezone.now()
        localized_time = current_time.astimezone(desired_timezone)

        queryset = RestaurantProfile.objects.all()

        if name:
            queryset = queryset.filter(name__icontains=name)
        
        if business_type:
            queryset = queryset.filter(business_type__icontains=business_type)
        
        if is_open is not None:
            if is_open.lower() == 'true':
                queryset = queryset.filter(open_hour__lte=localized_time, close_hour__gte=localized_time)
            elif is_open.lower() == 'false':
                queryset = queryset.exclude(open_hour__lte=localized_time, close_hour__gte=localized_time)

        serializer = RestaurantProfileSerializer(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)