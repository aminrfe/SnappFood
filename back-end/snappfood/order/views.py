from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from restaurant.models import RestaurantProfile
from .models import Order
from .serializers import OrderListSerializer, OrderStatusUpdateSerializer

class RestaurantOrderListView(generics.ListAPIView):
    serializer_class = OrderListSerializer
    # permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Get all orders for a restaurant",
        responses={
            200: openapi.Response(
                description="List of orders",
                schema=OrderListSerializer(many=True)
            ),
            404: openapi.Response(
                description="Restaurant not found"
            )
        }    
    )
    def get(self, request, restaurant_id, *args, **kwargs):
        try:
            restaurant = RestaurantProfile.objects.get(id=restaurant_id)
        except RestaurantProfile.DoesNotExist:
            raise NotFound(detail="Restaurant not found.")

        queryset = Order.objects.filter(
            restaurant_id=restaurant_id
        ).exclude(state='shopping_cart')

        if not queryset.exists():
            return Response([], status=status.HTTP_200_OK)
        
        serializer = OrderListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UpdateOrderStatusView(APIView):
    # permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Update the status of a specific order",
        request_body=OrderStatusUpdateSerializer,
        responses={
            200: openapi.Response('Order status updated successfully', OrderStatusUpdateSerializer),
            404: openapi.Response('Order not found'),
            400: openapi.Response('Invalid input'),
        },
    )
    def patch(self, request, restaurant_id, id,*args, **kwargs):
        try:
            order = Order.objects.get(restaurant_id=restaurant_id, order_id=id)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderStatusUpdateSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Order status updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
