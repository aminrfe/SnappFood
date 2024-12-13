from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.shortcuts import get_object_or_404
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from restaurant.models import RestaurantProfile, Item
from .models import CustomerProfile, Favorite, Cart, CartItem
from .serializers import CustomerProfileSerializer, FavoriteSerializer, AddToCartSerializer, CartSerializer
from .permissions import IsCustomer

class CustomerProfileView(APIView):
    permission_classes = [IsAuthenticated, IsCustomer]

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
    permission_classes = [IsAuthenticated, IsCustomer]

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
                openapi.IN_QUERY,
                description="ID of the restaurant to remove from favorites.",
                type=openapi.TYPE_INTEGER,
            ),
        ],
        responses={
            204: openapi.Response(description="Favorite removed successfully."),
            404: openapi.Response(description="Favorite not found."),
        },
    )
    def delete(self, request):
        restaurant_id = request.query_params.get('restaurant_id')
        if not restaurant_id:
            return Response({'error': 'Restaurant ID is required as a query parameter.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            favorite = Favorite.objects.get(user=request.user, restaurant_id=restaurant_id)
            favorite.delete()
            return Response({'message': 'Favorite removed successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except Favorite.DoesNotExist:
            return Response({'error': 'Favorite not found.'}, status=status.HTTP_404_NOT_FOUND)


class CartView(APIView):
    permission_classes = [IsAuthenticated, IsCustomer]

    def get_cart(self, user, restaurant_id):
        restaurant = get_object_or_404(RestaurantProfile, id=restaurant_id)
        cart = Cart.objects.filter(user=user, restaurant=restaurant).first()
        if not cart:
            raise Http404("Cart does not exist.")
        return cart

    @swagger_auto_schema(
        operation_summary="Retrieve the current user's cart",
        responses={
            200: openapi.Response(
                description="Current user's cart details",
                schema=CartSerializer()
            ),
            401: openapi.Response(
                description="Unauthorized"
            ),
            403: openapi.Response(
                description="Forbidden"
            )
        }
    )
    def get(self, request, restaurant_id):
        cart = self.get_cart(request.user, restaurant_id)
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_summary="Add an item to the cart",
        request_body=AddToCartSerializer,
        responses={
            201: openapi.Response(
                description="Item successfully added to cart",
                examples={"application/json": {"message": "Item added to cart."}}
            ),
            400: openapi.Response(
                description="Invalid input"
            ),
            401: openapi.Response(
                description="Unauthorized"
            ),
            403: openapi.Response(
                description="Forbidden"
            ),
            404: openapi.Response(
                description="Item not found"
            )
        }
    )
    def post(self, request, restaurant_id):
        restaurant = get_object_or_404(RestaurantProfile, id=restaurant_id)
        cart = Cart.objects.get_or_create(user=request.user, restaurant=restaurant)
        serializer = AddToCartSerializer(data=request.data)
        if serializer.is_valid():
            item = get_object_or_404(Item, item_id=serializer.validated_data['item_id'])
            count = serializer.validated_data['count']

            cart_item = CartItem.objects.filter(cart=cart, item=item).first()
            if cart_item:
                cart_item.count += count
            else:
                cart_item = CartItem(cart=cart, item=item, count=count, price=item.price)

            cart_item.save()

            cart.total_price = sum(item.price * item.count for item in cart.cart_items.all())
            cart.save()

            return Response({"message": "Item added to cart."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_summary="Update an item in the cart",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'cart_item_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Cart item ID'),
                'count': openapi.Schema(type=openapi.TYPE_INTEGER, description='New quantity for the cart item')
            }
        ),
        responses={
            200: openapi.Response(
                description="Cart item successfully updated",
                examples={"application/json": {"message": "Cart updated."}}
            ),
            400: openapi.Response(
                description="Invalid input"
            ),
            401: openapi.Response(
                description="Unauthorized"
            ),
            403: openapi.Response(
                description="Forbidden"
            ),
            404: openapi.Response(
                description="Cart item not found"
            )
        }
    )
    def put(self, request, restaurant_id):
        cart = self.get_cart(request.user, restaurant_id)
        data = request.data
        cart_item = get_object_or_404(CartItem, id=data.get('cart_item_id'), cart=cart)
        cart_item.count = data.get('count', cart_item.count)
        cart_item.save()

        cart.total_price = sum(item.price * item.count for item in cart.cart_items.all())
        cart.save()

        return Response({"message": "Cart updated."}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_summary="Remove an item from the cart",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'cart_item_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Cart item ID')
            }
        ),
        responses={
            200: openapi.Response(
                description="Cart item successfully removed",
                examples={"application/json": {"message": "Item removed from cart."}}
            ),
            400: openapi.Response(
                description="Invalid input"
            ),
            401: openapi.Response(
                description="Unauthorized"
            ),
            403: openapi.Response(
                description="Forbidden"
            ),
            404: openapi.Response(
                description="Cart item not found"
            )
        }
    )
    def delete(self, request, restaurant_id):
        cart = self.get_cart(request.user, restaurant_id)
        data = request.data
        cart_item = get_object_or_404(CartItem, id=data.get('cart_item_id'), cart=cart)
        cart_item.delete()

        cart.total_price = sum(item.price * item.count for item in cart.cart_items.all())
        cart.save()

        return Response({"message": "Item removed from cart."}, status=status.HTTP_200_OK)