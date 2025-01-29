from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User
from customer.models import CustomerProfile
from restaurant.models import RestaurantProfile

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        if self.user.role == "restaurant_manager":
            restaurant = RestaurantProfile.objects.get(manager_id=self.user.id)
            data['restaurant_id'] = restaurant.id
            data['state'] = restaurant.state

        return data
    
class CustomerSignUpSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(max_length=30)
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    state = serializers.CharField(max_length=30, required=False)
    role = 'customer'

    class Meta:
        model = User
        fields = ['phone_number', 'first_name', 'last_name', 'password', 'state']
        extra_kwargs = {
            'password': {'write_only': True} 
        }

    def validate_phone_number(self, value):
        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("A user with this phone number already exists.")
        return value
    
    def create(self, validated_data):
        state = validated_data.pop('state', 'approved')
        role = 'customer'

        user = User.objects.create_user(**validated_data, role=role)
        
        CustomerProfile.objects.create(user=user, state=state)

        return user

class RestaurantSignUpSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(max_length=30)
    name = serializers.CharField(max_length=255) 
    business_type = serializers.CharField(max_length=255) 
    city_name = serializers.CharField(max_length=255)

    class Meta:
        model = User
        fields = ['phone_number', 'password', 'name', 'business_type', 'city_name']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_phone_number(self, value):
        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("A user with this phone number already exists.")
        return value

    def create(self, validated_data):
        name = validated_data.pop('name')
        business_type = validated_data.pop('business_type')
        city_name = validated_data.pop('city_name')
        state = 'pending'
        role = 'restaurant_manager'

        manager = User.objects.create_user(
            **validated_data,
            role=role,
        )

        RestaurantProfile.objects.create(
            manager=manager,
            name=name,
            business_type=business_type,
            city_name=city_name,
            state = state
        )

        return manager
        
class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)