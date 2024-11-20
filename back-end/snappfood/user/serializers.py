from rest_framework import serializers
from .models import User
from customer.models import CustomerProfile

class CustomerSignUpSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(max_length=30)
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30, required=False)
    state = serializers.CharField(max_length=30)
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
        state = validated_data.pop('state')
        role = 'customer'

        user = User.objects.create_user(**validated_data, role=role)
        
        CustomerProfile.objects.create(user=user, state=state)

        return user
