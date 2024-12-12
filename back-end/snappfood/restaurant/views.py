from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from .models import RestaurantProfile, Item
from .serializers import RestaurantProfileSerializer, ItemCreateUpdateSerializer, ItemListSerializer
from .permissions import IsRestaurantManager
from django.utils import timezone
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

    
class ItemListCreateView(APIView):
    def get_queryset(self, restaurant_id):
        return Item.objects.filter(restaurant_id=restaurant_id)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ItemCreateUpdateSerializer
        return ItemListSerializer

    @swagger_auto_schema(
        operation_summary="Retrieve a list of items for a specific restaurant",
        responses={
            200: ItemListSerializer(many=True),
            404: "Restaurant not found",
        }
    )
    def get(self, request, restaurant_id, *args, **kwargs):
        queryset = self.get_queryset(restaurant_id)
        if not queryset.exists():
            return Response({"detail": "Restaurant not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ItemListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_summary="Create a new item for a specific restaurant",
        request_body=ItemCreateUpdateSerializer,
        responses={
            201: ItemCreateUpdateSerializer,
            400: "Invalid input data",
        }
    )
    def post(self, request, restaurant_id, *args, **kwargs):
        serializer = ItemCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(restaurant_id=restaurant_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class ItemRetrieveUpdateView(APIView):
    def get_queryset(self, restaurant_id):
        return Item.objects.filter(restaurant_id=restaurant_id)

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ItemCreateUpdateSerializer
        return ItemListSerializer

    @swagger_auto_schema(
        operation_summary="Retrieve a specific item for a specific restaurant",
        responses={
            200: ItemListSerializer,
            404: "Item not found",
        }
    )
    def get(self, request, restaurant_id, id, *args, **kwargs):
        item = self.get_queryset(restaurant_id).filter(id=id).first()
        if not item:
            return Response({"detail": "Item not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ItemListSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_summary="Update an existing item for a specific restaurant",
        request_body=ItemCreateUpdateSerializer,
        responses={
            200: ItemCreateUpdateSerializer,
            400: "Invalid input data",
            404: "Item not found",
        }
    )
    def put(self, request, restaurant_id, id, *args, **kwargs):
        item = self.get_queryset(restaurant_id).filter(id=id).first()
        if not item:
            return Response({"detail": "Item not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ItemCreateUpdateSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_summary="Partially update an existing item for a specific restaurant",
        request_body=ItemCreateUpdateSerializer,
        responses={
            200: ItemCreateUpdateSerializer,
            400: "Invalid input data",
            404: "Item not found",
        }
    )
    def patch(self, request, restaurant_id, id, *args, **kwargs):
        item = self.get_queryset(restaurant_id).filter(id=id).first()
        if not item:
            return Response({"detail": "Item not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ItemCreateUpdateSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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