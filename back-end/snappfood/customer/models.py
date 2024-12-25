from django.db import models
from django.db.models.signals import pre_delete
from django.dispatch import receiver
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


class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="carts")
    restaurant = models.ForeignKey('restaurant.RestaurantProfile', on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    
    class Meta:
        unique_together = ('user', 'restaurant')

    def __str__(self):
        return f"Cart for {self.user}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="cart_items")
    item = models.ForeignKey('restaurant.Item', on_delete=models.CASCADE, related_name="cart_items")
    count = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.PositiveIntegerField(default=0, help_text="Discount percentage (0 to 100)")

    def __str__(self):
        return f"{self.count} x {self.item.name} in cart for {self.cart.user}"