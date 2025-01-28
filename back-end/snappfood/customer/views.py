from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from restaurant.models import RestaurantProfile, Item
from restaurant.serializers import ItemSerializer
from order.serializers import OrderCreateSerializer, OrderSerializer, ReviewSerializer, GetReviewSerializer
from order.models import Order, OrderItem, Review
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
            500: openapi.Response(description="Internal server error"),
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
            500: openapi.Response(description="Internal server error"),
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
        operation_summary="List Favorite Restaurants",
        operation_description="Retrieve a list of favorite restaurants for the currently authenticated user.",
        responses={
            200: FavoriteSerializer(many=True),
            500: openapi.Response(description="Internal server error"),
        },
    )
    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_summary="Add to Favorite Restaurants",
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
            500: openapi.Response(description="Internal server error"),
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
        operation_summary="Remove from Favorite Restaurants",
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
            500: openapi.Response(description="Internal server error"),
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
            403: openapi.Response(description="Forbidden"),
            500: openapi.Response(description="Internal server error"),
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
            403: openapi.Response(description="Forbidden"),
            404: openapi.Response(description="Item or Restaurant not found"),
            500: openapi.Response(description="Internal server error"),
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

            cart.total_price = sum(ci.price * ci.count for ci in cart.cart_items.all())
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
            403: openapi.Response(description="Forbidden"),
            404: openapi.Response(description="Cart not found"),
            500: openapi.Response(description="Internal server error"),
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
            403: openapi.Response(description="Forbidden"),
            404: openapi.Response(description="Cart or Cart item not found"),
            500: openapi.Response(description="Internal server error"),
        },
    )
    def put(self, request, *args, **kwargs):
        cart = self.get_object()
        serializer = UpdateCartItemSerializer(data=request.data)
        if serializer.is_valid():
            cart_item_id = serializer.validated_data['cart_item_id']
            new_count = serializer.validated_data['count']

            cart_item = get_object_or_404(CartItem, id=cart_item_id, cart=cart)

            if new_count == 0:
                cart_item.delete()
            else:
                cart_item.count = new_count
                cart_item.save()

            cart.total_price = sum(ci.price * ci.count for ci in cart.cart_items.all())
            cart.save()

            cart_serializer = CartSerializer(cart)
            return Response(cart_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_summary="Delete a specific cart",
        responses={
            200: openapi.Response(description="Cart successfully deleted"),
            401: openapi.Response(description="Unauthorized"),
            403: openapi.Response(description="Forbidden"),
            404: openapi.Response(description="Cart not found"),
            500: openapi.Response(description="Internal server error"),
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
            403: openapi.Response(description="Forbidden"),
            404: openapi.Response(description="Cart or Cart item not found"),
            500: openapi.Response(description="Internal server error"),
        },
    )
    def delete(self, request, id, cart_item_id):
        cart = get_object_or_404(Cart, id=id, user=request.user)
        cart_item = get_object_or_404(CartItem, id=cart_item_id, cart=cart)

        cart_item.delete()
        
        if cart.cart_items.count() == 0:
            cart.delete()
        else:
            cart.total_price = sum(ci.price * ci.count for ci in cart.cart_items.all())
            cart.save()

        return Response({"message": "Cart item deleted."}, status=status.HTTP_200_OK)
    
class MenuItemsView(generics.ListAPIView):
    serializer_class = ItemSerializer

    @swagger_auto_schema(
        operation_summary="List All Items of a Restaurant",
        responses={
            200: ItemSerializer(many=True),
            404: openapi.Response(description="Restaurant not found"),
            500: openapi.Response(description="Internal server error"),
        },
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        if not RestaurantProfile.objects.filter(pk=restaurant_id).exists():
            raise NotFound("Restaurant not found")
        return Item.objects.filter(restaurant_id=restaurant_id)

class MenuItemDetailView(generics.RetrieveAPIView):
    serializer_class = ItemSerializer
    lookup_field = 'item_id'
    
    @swagger_auto_schema(
        operation_summary="Retrieve a Specific Item of a Restaurant",
        responses={
            200: ItemSerializer,
            404: openapi.Response(description="Item not found"),
            500: openapi.Response(description="Internal server error"),
        },
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_object(self):
        restaurant_id = self.kwargs.get('restaurant_id')
        item_id = self.kwargs.get('item_id')
        try:
            return Item.objects.get(restaurant_id=restaurant_id, item_id=item_id)
        except Item.DoesNotExist:
            raise NotFound("Item not found")

class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsCustomer]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    @swagger_auto_schema(
        operation_summary="Retrieve the order list",
        responses={
            200: openapi.Response(
                description="List of orders retrieved successfully",
                schema=OrderSerializer(many=True)
            ),
            401: openapi.Response(description="Unauthorized"),
            403: openapi.Response(description="Forbidden"),
            500: openapi.Response(description="Internal server error"),
        },
    )
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Create an order",
        request_body=OrderCreateSerializer,
        responses={
            201: openapi.Response("Order created successfully!"),
            400: openapi.Response(description="Invalid input"),
            401: openapi.Response(description="Unauthorized"),
            403: openapi.Response(description="Forbidden"),
            500: openapi.Response(description="Internal server error"),
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = OrderCreateSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            cart_id = validated_data['cart_id']
            cart = get_object_or_404(Cart, id=cart_id)
            restaurant = cart.restaurant
            delivery_method = validated_data['delivery_method']
            payment_method = validated_data['payment_method']
            description = validated_data.get('description', '')

            delivery_price = 0 if delivery_method == 'delivery' else restaurant.delivery_price
            total_price = cart.total_price + delivery_price

            order = Order.objects.create(
                user=cart.user,
                restaurant=cart.restaurant,
                total_price=total_price,
                delivery_method=delivery_method,
                payment_method=payment_method,
                description=description,
            )

            cart_items = cart.cart_items.all()
            for cart_item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    item=cart_item.item,
                    count=cart_item.count,
                    price=cart_item.price,
                    discount=cart_item.discount,
                )
 
            cart.delete()

            return Response({
                "order_id": order.order_id,
                "message": "Order created successfully!"
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateReviewView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated, IsCustomer]

    @swagger_auto_schema(
        operation_summary="Create a new review for an order",
        operation_description=(
            "This endpoint allows a customer to create a review for an order. "
            "The customer must be authenticated and the order must belong to the customer."
        ),
        responses={
            201: openapi.Response(
                description="Review successfully created",
                schema=ReviewSerializer,
            ),
            400: openapi.Response(description="Invalid data or review already exists for this order"),
            401: openapi.Response(description="Unauthorized"),
            403: openapi.Response(description="Forbidden"),
            500: openapi.Response(description="Internal server error"),
        },
    )
    def post(self, request, *args, **kwargs):
        order_id = request.data.get('order')
        user = request.user

        try:
            order = Order.objects.get(order_id=order_id, user=user)
        except Order.DoesNotExist:
            return Response(
                {"detail": "You can only review orders that you have placed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if Review.objects.filter(order=order, user=user).exists():
            return Response(
                {"detail": "You have already reviewed this order."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return super().post(request, *args, **kwargs)


class GetItemReviewsView(generics.ListAPIView):
    serializer_class = GetReviewSerializer

    @swagger_auto_schema(
        operation_summary="Get reviews for an item",
        operation_description="Retrieve all reviews associated with a specific item.",
        manual_parameters=[
            openapi.Parameter(
                name="item_id",
                in_=openapi.IN_PATH,
                description="ID of the item to fetch reviews for",
                type=openapi.TYPE_INTEGER,
                required=True
            ),
        ],
        responses={
            200: openapi.Response(
                description="Reviews retrieved successfully",
                schema=GetReviewSerializer(many=True),
            ),
            400: openapi.Response(description="Invalid item ID"),
            401: openapi.Response(description="Unauthorized"),
            404: openapi.Response(description="Item not found"),
            500: openapi.Response(description="Internal server error"),
        },
    )
    def get_queryset(self):
        item_id = self.kwargs.get('item_id')
        try:
            item = Item.objects.get(item_id=item_id)
        except Item.DoesNotExist:
            raise NotFound("Item not found.")


        order_ids = OrderItem.objects.filter(item=item).values_list('order_id', flat=True)
        return Review.objects.filter(order_id__in=order_ids).select_related("user", "order")

    
class OrderHistoryView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsCustomer]

    DEFAULT_LIMIT = 10

    @swagger_auto_schema(
        operation_description="Retrieve the authenticated user's order history limited to a specified number of most recent orders.",
        manual_parameters=[openapi.Parameter(
            'limit',
            openapi.IN_QUERY,
            description=f"Maximum number of orders to return (default: {DEFAULT_LIMIT})",
            type=openapi.TYPE_INTEGER,
            minimum=1
        )],
        responses={
            200: OrderSerializer(many=True),
            400: openapi.Response(description="Bad Request"),
            401: openapi.Response(description="Unauthorized"),
            403: openapi.Response(description="Forbidden"),
            500: openapi.Response(description="Internal server error"),
        },
    )
    def get(self, request, *args, **kwargs):
        user = request.user

        limit = request.query_params.get('limit', self.DEFAULT_LIMIT)

        try:
            limit = int(limit)
            if limit < 1:
                raise ValueError("Limit must be a positive integer.")
        except ValueError:
            return Response(
                {"error": "Invalid 'limit' parameter. It must be a positive integer."},
                status=status.HTTP_400_BAD_REQUEST
            )

        orders = Order.objects.filter(user=user).order_by('-order_date')[:limit]
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)