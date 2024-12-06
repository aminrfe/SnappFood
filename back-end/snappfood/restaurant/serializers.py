from rest_framework import serializers
from .models import RestaurantProfile

class RestaurantProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantProfile
        fields = [
            'name', 'business_type', 'delivery_price', 'address',
            'description', 'open_hour', 'close_hour', 'photo', 'latitude', 'longitude'
        ]

    def validate_photo(self, value):
        if value and not value.name.lower().endswith(('jpg', 'jpeg', 'png')):
            raise serializers.ValidationError("Photo must be in JPEG or PNG format.")
        return value