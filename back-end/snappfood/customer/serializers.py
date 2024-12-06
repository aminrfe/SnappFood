from rest_framework import serializers
from .models import CustomerProfile, User

class NestedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['phone_number', 'first_name', 'last_name', 'role']
        read_only_fields = ['phone_number', 'role']

class CustomerProfileSerializer(serializers.ModelSerializer):
    user = NestedUserSerializer()

    class Meta:
        model = CustomerProfile
        fields = ['user', 'state'] 
        read_only_fields = ['state']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)

        if user_data:
            for attr, value in user_data.items():
                if attr in ['first_name', 'last_name']:
                    setattr(instance.user, attr, value)
            instance.user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        instance.save()
        return instance