from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser, Group, Permission
from user.models import User

class RestaurantProfile(models.Model):
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name="restaurant_profile", 
        primary_key=True
    )  
    name = models.CharField(max_length=255) 
    business_type = models.CharField(max_length=255)  
    city_name = models.CharField(max_length=255)  
    score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    delivery_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    coordinate = models.JSONField(null=True, blank=True)
    state = models.CharField(max_length=30, default='Ok')

    def __str__(self):
        return f"Restaurant: {self.name} ({self.user.phone_number})"