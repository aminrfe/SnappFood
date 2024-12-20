from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from restaurant.models import RestaurantProfile, Item
from .models import CustomerProfile, Favorite, Cart, CartItem
from .serializers import CustomerProfileSerializer, FavoriteSerializer, AddToCartSerializer, UpdateCartItemSerializer, CartSerializer
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


class CartListCreateView(generics.ListCreateAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated, IsCustomer]

    def get_queryset(self):
        user = self.request.user
        restaurant_id = self.request.query_params.get('restaurant_id')

        if restaurant_id:
            return Cart.objects.filter(user=user, restaurant_id=restaurant_id)
        return Cart.objects.filter(user=user)

    @swagger_auto_schema(
        operation_summary="Retrieve the cart list",
        manual_parameters=[
            openapi.Parameter(
                name='restaurant_id',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                description="Filter cart items by restaurant ID",
                required=False
            )
        ],
        responses={
            200: openapi.Response(
                description="List of cart items retrieved successfully",
                schema=CartSerializer(many=True)
            ),
            401: openapi.Response(description="Unauthorized"),
        },
    )
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    @swagger_auto_schema(
        request_body=AddToCartSerializer,
        operation_summary="Add an item to the cart",
        responses={
            201: openapi.Response(
                description="Item successfully added to cart",
                schema=CartSerializer()
            ),
            400: openapi.Response(description="Invalid input"),
            401: openapi.Response(description="Unauthorized"),
            404: openapi.Response(description="Item or Restaurant not found"),
        },
    )
    def post(self, request, *args, **kwargs):
        serializer = AddToCartSerializer(data=request.data)
        if serializer.is_valid():
            restaurant_id = serializer.validated_data['restaurant_id']
            item_id = serializer.validated_data['item_id']
            count = serializer.validated_data['count']

            restaurant = get_object_or_404(RestaurantProfile, id=restaurant_id)
            item = get_object_or_404(Item, item_id=item_id)

            cart, created = Cart.objects.get_or_create(user=request.user, restaurant=restaurant)

            cart_item, item_created = CartItem.objects.get_or_create(
                cart=cart,
                item=item,
                defaults={
                    'count': count,
                    'price': item.price,
                    'discount': item.discount
                }
            )
            if not item_created:
                cart_item.count += count
                cart_item.save()

            cart.total_price = sum(
                (ci.price - ci.discount) * ci.count for ci in cart.cart_items.all()
            )
            cart.save()

            cart_serializer = CartSerializer(cart)
            return Response(cart_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CartDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated, IsCustomer]
    lookup_field = 'id'

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    @swagger_auto_schema(
        operation_summary="Retrieve a specific cart of the user",
        responses={
            200: openapi.Response(
                description="Cart details",
                schema=CartSerializer()
            ),
            401: openapi.Response(description="Unauthorized"),
            404: openapi.Response(description="Cart not found"),
        }
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['cart_item_id', 'count'],
            properties={
                'cart_item_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Cart item ID'),
                'count': openapi.Schema(type=openapi.TYPE_INTEGER, description='New quantity for the cart item'),
            },
        ),
        operation_summary="Update an item in the cart",
        responses={
            200: openapi.Response(
                description="Cart item successfully updated",
                schema=CartSerializer()
            ),
            400: openapi.Response(description="Invalid input"),
            401: openapi.Response(description="Unauthorized"),
            404: openapi.Response(description="Cart or Cart item not found"),
        },
    )
    def put(self, request, *args, **kwargs):
        cart = self.get_object()
        serializer = UpdateCartItemSerializer(data=request.data)
        if serializer.is_valid():
            cart_item_id = serializer.validated_data['cart_item_id']
            new_count = serializer.validated_data['count']

            cart_item = get_object_or_404(CartItem, id=cart_item_id, cart=cart)
            cart_item.count = new_count
            cart_item.save()

            cart.total_price = sum(
                (ci.price - ci.discount) * ci.count for ci in cart.cart_items.all()
            )
            cart.save()

            cart_serializer = CartSerializer(cart)
            return Response(cart_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_summary="Delete a specific cart",
        responses={
            200: openapi.Response(description="Cart successfully deleted"),
            401: openapi.Response(description="Unauthorized"),
            404: openapi.Response(description="Cart not found"),
        },
    )
    def delete(self, request, *args, **kwargs):
        cart = self.get_object()
        cart.delete()
        return Response({"message": "Cart deleted."}, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        return Response({"detail": "Method 'PATCH' not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

class CartItemDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsCustomer]

    @swagger_auto_schema(
        operation_summary="Delete a specific cart item",
        responses={
            200: openapi.Response(description="Cart item successfully deleted"),
            401: openapi.Response(description="Unauthorized"),
            404: openapi.Response(description="Cart or Cart item not found"),
        },
    )
    def delete(self, request, id, cart_item_id):
        cart = get_object_or_404(Cart, id=id, user=request.user)
        cart_item = get_object_or_404(CartItem, id=cart_item_id, cart=cart)

        cart_item.delete()

        cart.total_price = sum(
            (ci.price - ci.discount) * ci.count for ci in cart.cart_items.all()
        )
        cart.save()

        return Response({"message": "Cart item deleted."}, status=status.HTTP_200_OK)