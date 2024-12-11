from django.db import models
from user.models import User
from restaurant.models import RestaurantProfile
from django.conf import settings

class CustomerProfile(models.Model):
    STATE_CHOICES = [
        ("pending", "PENDING "),
        ("approved", "APPROVED"),
        ("rejected", "REJECTED"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="customer_profile", primary_key=True)
    state = models.CharField(max_length=30, choices=STATE_CHOICES, default='approved')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    address = models.TextField(blank=True, null=True) 

    def __str__(self):
        return f"Customer: {self.user.phone_number}"


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    restaurant = models.ForeignKey(RestaurantProfile, on_delete=models.CASCADE, related_name='favorited_by')

    class Meta:
        unique_together = ('user', 'restaurant')

