from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import CustomerProfile, Favorite, RestaurantProfile
from .serializers import CustomerProfileSerializer, FavoriteSerializer

class CustomerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Retrieve Customer Profile",
        operation_description="Fetch the customer profile for the currently authenticated user.",
        responses={
            200: CustomerProfileSerializer,
            404: openapi.Response(description="Customer profile not found."),
        },
    )
    def get(self, request):
        try:
            customer_profile = request.user.customer_profile
        except CustomerProfile.DoesNotExist:
            return Response({'error': 'Customer profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CustomerProfileSerializer(customer_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_summary="Update Customer Profile",
        operation_description="Update the customer profile for the currently authenticated user.",
        request_body=CustomerProfileSerializer,
        responses={
            200: openapi.Response(description="Customer profile updated successfully."),
            400: openapi.Response(description="Invalid data."),
            404: openapi.Response(description="Customer profile not found."),
        },
    )
    def put(self, request):
        try:
            customer_profile = request.user.customer_profile
        except CustomerProfile.DoesNotExist:
            return Response({'error': 'Customer profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CustomerProfileSerializer(customer_profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Customer profile updated successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_summary="Partially Update Customer Profile",
        operation_description="Partially update the customer profile for the currently authenticated user.",
        request_body=CustomerProfileSerializer,
        responses={
            200: openapi.Response(description="Customer profile updated successfully."),
            400: openapi.Response(description="Invalid data."),
            404: openapi.Response(description="Customer profile not found."),
        },
    )
    def patch(self, request):
        try:
            customer_profile = request.user.customer_profile
        except CustomerProfile.DoesNotExist:
            return Response({'error': 'Customer profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CustomerProfileSerializer(customer_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Customer profile updated successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FavoriteView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="List Favorites",
        operation_description="Retrieve a list of favorite restaurants for the currently authenticated user.",
        responses={200: FavoriteSerializer(many=True)},
    )
    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_summary="Add to Favorites",
        operation_description="Add a restaurant to the authenticated user's list of favorites.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'restaurant_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID of the restaurant'),
            },
            required=['restaurant_id'],
        ),
        responses={
            201: FavoriteSerializer,
            400: openapi.Response(description="Invalid data."),
            404: openapi.Response(description="Restaurant not found."),
        },
    )
    def post(self, request):
        restaurant_id = request.data.get('restaurant_id')
        if not restaurant_id:
            return Response({'error': 'Restaurant ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            restaurant = RestaurantProfile.objects.get(id=restaurant_id)
        except RestaurantProfile.DoesNotExist:
            return Response({'error': 'Restaurant not found.'}, status=status.HTTP_404_NOT_FOUND)

        data = {'restaurant': restaurant.id, 'user': request.user.id}
        serializer = FavoriteSerializer(data=data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_summary="Remove from Favorites",
        operation_description="Remove a restaurant from the authenticated user's list of favorites.",
        manual_parameters=[
            openapi.Parameter(
                'restaurant_id',
                openapi.IN_PATH,
                description="ID of the restaurant to remove from favorites.",
                type=openapi.TYPE_INTEGER,
            ),
        ],
        responses={
            204: openapi.Response(description="Favorite removed successfully."),
            404: openapi.Response(description="Favorite not found."),
        },
    )
    def delete(self, request, restaurant_id):
        try:
            favorite = Favorite.objects.get(user=request.user, restaurant_id=restaurant_id)
            favorite.delete()
            return Response({'message': 'Favorite removed successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except Favorite.DoesNotExist:
            return Response({'error': 'Favorite not found.'}, status=status.HTTP_404_NOT_FOUND)
