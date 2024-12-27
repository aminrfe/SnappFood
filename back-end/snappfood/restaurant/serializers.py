from rest_framework import serializers
from .models import RestaurantProfile, Item

class RestaurantProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantProfile
        fields = [
            'id', 'name', 'business_type', 'city_name', 'score','delivery_price', 'address',
            'description', 'open_hour', 'close_hour', 'latitude', 'longitude', 'photo'
        ]

    def validate_photo(self, value):
        if value and not value.name.lower().endswith(('jpg', 'jpeg', 'png')):
            raise serializers.ValidationError("Photo must be in JPEG or PNG format.")
        return value
    

class ItemSerializer(serializers.ModelSerializer):
    restaurant = serializers.PrimaryKeyRelatedField(read_only=True)
    score = serializers.FloatField(read_only=True) 

    class Meta:
        model = Item
        fields = ['item_id', 'restaurant', 'price', 'discount', 'name', 'description', 'state', 'photo', 'score']

