from rest_framework import serializers
from .models import Restaurant

class RestaurantSignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Restaurant
        fields = ['phone_number', 'name', 'password', 'city', 'state', 'delivery_price', 'coordinate']

    def create(self, validated_data):
        restaurant = Restaurant.objects.create_restaurant(
            phone_number=validated_data['phone_number'],
            name=validated_data['name'],
            password=validated_data['password'],
            city=validated_data.get('city', ''),
            state=validated_data.get('state', ''),
            delivery_price=validated_data.get('delivery_price', 0.0),
            coordinate=validated_data.get('coordinate', {}),
        )
        return restaurant
