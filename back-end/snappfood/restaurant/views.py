from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from .models import RestaurantProfile, Item
from .serializers import RestaurantProfileSerializer, ItemCreateUpdateSerializer, ItemListSerializer
from .permissions import IsRestaurantManager


class RestaurantProfileView(generics.RetrieveUpdateAPIView):
    queryset = RestaurantProfile.objects.all()
    serializer_class = RestaurantProfileSerializer
    lookup_field = 'id'
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

    
class ItemListCreateView(APIView):
    def get_queryset(self, restaurant_id):
        return Item.objects.filter(restaurant_id=restaurant_id)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ItemCreateUpdateSerializer
        return ItemListSerializer

    @swagger_auto_schema(
        operation_description="Retrieve a list of items for a specific restaurant.",
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
        operation_description="Create a new item for a specific restaurant.",
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
        operation_description="Retrieve a specific item for a specific restaurant.",
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
        operation_description="Update an existing item for a specific restaurant.",
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
        operation_description="Partially update an existing item for a specific restaurant.",
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


