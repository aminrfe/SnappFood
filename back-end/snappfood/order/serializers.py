from rest_framework import serializers
from customer.models import Cart
from .models import Order, OrderItem, Review


class OrderItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="item.name", read_only=True)
    photo = serializers.ImageField(source="item.photo", read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'item', 'name', 'discount','count', 'price', 'photo']

class OrderListSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    latitude = serializers.DecimalField(source='user.customer_profile.latitude', max_digits=9, decimal_places=6, read_only=True)
    longitude = serializers.DecimalField(source='user.customer_profile.longitude', max_digits=9, decimal_places=6, read_only=True)
    address = serializers.CharField(source='user.customer_profile.address', read_only=True)

    class Meta:
        model = Order
        fields = ['order_id', 'restaurant', 'order_date', 'total_price', 'state', 'delivery_method', 
                  'payment_method', 'description', 'latitude', 'longitude', 'address', 'order_items']

class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['state']

class OrderCreateSerializer(serializers.Serializer):
    cart_id = serializers.IntegerField()
    delivery_method = serializers.ChoiceField(choices=Order.DELIVERY_METHOD_CHOICES)
    payment_method = serializers.ChoiceField(choices=Order.PAYMENT_METHOD_CHOICES)
    description = serializers.CharField(required=False, allow_blank=True)

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    latitude = serializers.DecimalField(source='user.customer_profile.latitude', max_digits=9, decimal_places=6, read_only=True)
    longitude = serializers.DecimalField(source='user.customer_profile.longitude', max_digits=9, decimal_places=6, read_only=True)
    address = serializers.CharField(source='user.customer_profile.address', read_only=True)

    class Meta:
        model = Order
        fields = ['order_id', 'restaurant', 'restaurant_name', 'order_date', 'total_price', 'state', 
                  'delivery_method', 'payment_method', 'description', 'latitude', 'longitude', 'address', 'order_items']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'user', 'order', 'score', 'description']
        read_only_fields = ['user']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
class GetReviewSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)

    class Meta:
        model = Review
        fields = ["id", "first_name", "last_name", "score", "description", "order"]
