from rest_framework import serializers
from .models import RestaurantProfile, Item

class RestaurantProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantProfile
        fields = [
            'name', 'business_type', 'delivery_price', 'address',
            'description', 'open_hour', 'close_hour', 'latitude', 'longitude', 'photo'
        ]

    def validate_photo(self, value):
        if value and not value.name.lower().endswith(('jpg', 'jpeg', 'png')):
            raise serializers.ValidationError("Photo must be in JPEG or PNG format.")
        return value
    

class ItemCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['price', 'discount', 'name', 'description', 'state', 'photo']


class ItemListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['item_id', 'price', 'discount', 'name', 'score', 'description', 'state', 'photo']

