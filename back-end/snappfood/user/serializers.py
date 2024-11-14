from rest_framework import serializers
from .models import User
from customer.models import CustomerProfile

class CustomerSignUpSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(max_length=30)
    first_name = serializers.CharField(max_length=30)
    state = serializers.CharField(max_length=30)

    class Meta:
        model = User
        fields = ['phone_number', 'first_name', 'last_name', 'password', 'state']
        extra_kwargs = {
            'password': {'write_only': True} 
        }

    def create(self, validated_data):
        state = validated_data.pop('state')
        
        user = User.objects.create_user(**validated_data)
        CustomerProfile.objects.create(user=user, state=state)

        return user
