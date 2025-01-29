from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.utils import timezone
from django.http import Http404
from django.db import models
from django.utils.timezone import now, timedelta
from django.db.models import Sum, F
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework import status
from .models import RestaurantProfile, Item
from .serializers import RestaurantProfileSerializer, ItemSerializer
from .permissions import IsRestaurantManager
import pytz


class MyRestaurantProfileView(APIView):
    permission_classes = [IsAuthenticated, IsRestaurantManager]

    @swagger_auto_schema(
        operation_summary="Retrieve your restaurant's profile details.",
        responses={
            200: RestaurantProfileSerializer,
            401: 'Authentication credentials were not provided or invalid.',
            403: 'You do not have permission to perform this action.',
            404: 'Restaurant profile not found',
            500: 'Internal server error',
        },
    )
    def get(self, request):
        try:
            restaurant_profile = RestaurantProfile.objects.get(manager=request.user)
            serializer = RestaurantProfileSerializer(restaurant_profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except RestaurantProfile.DoesNotExist:
            return Response(
                {"detail": "Restaurant profile not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @swagger_auto_schema(
        operation_summary="Update your restaurant's profile details.",
        responses={
            200: RestaurantProfileSerializer,
            400: 'Invalid request data.',
            401: 'Authentication credentials were not provided or invalid.',
            403: 'You do not have permission to perform this action.',
            404: 'Restaurant profile not found',
            500: 'Internal server error',
        },
        request_body=RestaurantProfileSerializer,
    )
    def put(self, request):
        try:
            restaurant_profile = RestaurantProfile.objects.get(manager=request.user)
            serializer = RestaurantProfileSerializer(restaurant_profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except RestaurantProfile.DoesNotExist:
            return Response(
                {"detail": "Restaurant profile not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )

class PublicRestaurantProfileView(generics.RetrieveAPIView):
    queryset = RestaurantProfile.objects.all()
    serializer_class = RestaurantProfileSerializer
    lookup_field = 'id'

    @swagger_auto_schema(
        operation_summary="Retrieve a restaurant's profile by ID.",
        responses={
            200: RestaurantProfileSerializer,
            404: 'Restaurant profile not found',
            500: 'Internal server error',
        },
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

   
class ItemListCreateView(generics.ListCreateAPIView):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated, IsRestaurantManager]

    @swagger_auto_schema(
        operation_summary="List Items",
        responses={
            200: ItemSerializer(many=True),
            401: "Unauthorized",
            403: "Forbidden",
            500: "Internal server error",
        }
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Create Item",
        responses={
            201: ItemSerializer,
            401: "Unauthorized",
            403: "Forbidden",
            500: "Internal server error",
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
            404: "Item not found",
            500: "Internal server error",
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
            404: "Item not found",
            500: "Internal server error",
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
            404: "Item not found",
            500: "Internal server error",
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
        operation_summary="Search and filter restaurants and items by various criteria.",
        manual_parameters=[
            openapi.Parameter(
                'query',
                openapi.IN_QUERY,
                description="Search term to find matching restaurants and items.",
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
                description="Search results including filtered restaurants and items.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'restaurants': openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(type=openapi.TYPE_OBJECT)
                        ),
                        'items': openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(type=openapi.TYPE_OBJECT)
                        )
                    }
                )
            ),
            400: "Invalid request parameters.",
            500: "Internal server error",
        }
    )
    def get(self, request):
        query = request.query_params.get('query', '').strip()
        business_type = request.query_params.get('business_type', None)
        is_open = request.query_params.get('is_open', None)
        
        desired_timezone = pytz.timezone('Asia/Tehran')
        current_time = timezone.now()
        localized_time = current_time.astimezone(desired_timezone)

        restaurant_queryset = RestaurantProfile.objects.filter(state='approved')
        item_queryset = Item.objects.all()

        if query:
            restaurant_queryset = restaurant_queryset.filter(name__icontains=query)
            item_queryset = item_queryset.filter(name__icontains=query)

        if business_type:
            restaurant_queryset = restaurant_queryset.filter(business_type__icontains=business_type)

        if is_open is not None:
            if is_open.lower() == 'true':
                restaurant_queryset = restaurant_queryset.filter(
                    open_hour__lte=localized_time, close_hour__gte=localized_time
                )
            elif is_open.lower() == 'false':
                restaurant_queryset = restaurant_queryset.exclude(
                    open_hour__lte=localized_time, close_hour__gte=localized_time
                )

        restaurant_serializer = RestaurantProfileSerializer(restaurant_queryset.distinct(), many=True)
        item_serializer = ItemSerializer(item_queryset.distinct(), many=True)

        return Response(
            {
                "restaurants": restaurant_serializer.data,
                "items": item_serializer.data,
            },
            status=status.HTTP_200_OK
        )

    

class SalesReportView(APIView):
    permission_classes = [IsAuthenticated, IsRestaurantManager]

    @swagger_auto_schema(
        operation_summary="Sales Report",
        manual_parameters=[
            openapi.Parameter(
                'filter',
                openapi.IN_QUERY,
                description="Filter sales report by time period. Options: 'today', 'last_week', 'last_month'.",
                type=openapi.TYPE_STRING,
                required=True,
                enum=['today', 'last_week', 'last_month']
            )
        ],
        responses={
            200: "Successful response with sales report data",
            400: "Invalid filter option",
            401: "Unauthorized",
            403: "Forbidden",
            500: "Internal server error",
        }
    )
    def get(self, request, *args, **kwargs):
        filter_option = request.query_params.get('filter')
        restaurant = request.user.restaurant_profile

        if filter_option == 'today':
            start_date = now().replace(hour=0, minute=0, second=0, microsecond=0)
            end_date = now()
        elif filter_option == 'last_week':
            start_date = now() - timedelta(days=7)
            end_date = now()
        elif filter_option == 'last_month':
            start_date = now() - timedelta(days=30)
            end_date = now()
        else:
            raise ValidationError("Invalid filter option. Use 'today', 'last_week', or 'last_month'.")

        order_items = Item.objects.filter(
            order_items__order__restaurant=restaurant,
            order_items__order__order_date__range=(start_date, end_date),
            order_items__order__state='completed'
        ).annotate(
            total_count=Sum('order_items__count'),
            total_price=Sum(
                F('order_items__price') * F('order_items__count') * (1 - F('order_items__discount') / 100.0),
                output_field=models.DecimalField()
            )
        ).values('name', 'photo', 'total_count', 'total_price')

        total_income = sum(item['total_price'] for item in order_items)

        return Response({
            "filter": filter_option,
            "total_income": total_income,
            "items": order_items
        })