from rest_framework import permissions
from drf_yasg.utils import swagger_auto_schema
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
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


class ItemView(APIView):
    # permission_classes = [IsAuthenticated]  # Uncomment if needed

    def get_queryset(self, restaurant_id):
        return Item.objects.filter(restaurant_id=restaurant_id)

    @swagger_auto_schema(
        operation_description="Retrieve a list of items for a specific restaurant.",
        responses={200: ItemListSerializer(many=True)}
    )
    def get(self, request, restaurant_id, id=None):
        if id:
            item = get_object_or_404(self.get_queryset(restaurant_id), id=id)
            serializer = ItemListSerializer(item)
        else:
            items = self.get_queryset(restaurant_id)
            serializer = ItemListSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="Create a new item for a specific restaurant.",
        request_body=ItemCreateUpdateSerializer,
        responses={201: ItemCreateUpdateSerializer()}
    )
    def post(self, request, restaurant_id):
        serializer = ItemCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(restaurant_id=restaurant_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Update an existing item for a specific restaurant.",
        request_body=ItemCreateUpdateSerializer,
        responses={200: ItemCreateUpdateSerializer()}
    )
    def put(self, request, restaurant_id, id):
        item = get_object_or_404(self.get_queryset(restaurant_id), id=id)
        serializer = ItemCreateUpdateSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Partially update an existing item for a specific restaurant.",
        request_body=ItemCreateUpdateSerializer,
        responses={200: ItemCreateUpdateSerializer()}
    )
    def patch(self, request, restaurant_id, id):
        item = get_object_or_404(self.get_queryset(restaurant_id), id=id)
        serializer = ItemCreateUpdateSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)