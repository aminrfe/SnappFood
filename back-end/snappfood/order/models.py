from django.db import models
from django.conf import settings 
from restaurant.models import RestaurantProfile, Item

class Order(models.Model):
    DELIVERY_METHOD_CHOICES = [
        ('pickup', 'Pickup'),
        ('delivery', 'Delivery'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('in_person', 'In Person'),
        ('online', 'Online Payment'),
    ]

    STATE_CHOICES = [
        ('shopping_cart', 'Shopping Cart'),
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('preparing', 'Preparing'),
        ('ready_for_pickup', 'Ready For Pickup'),
        ('delivering', 'Delivering'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    order_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(RestaurantProfile, on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    state = models.CharField(max_length=20, choices=STATE_CHOICES, default='shopping_cart')
    delivery_method = models.CharField(max_length=20, choices=DELIVERY_METHOD_CHOICES)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)

    def __str__(self):
        return f"Order {self.order_id} by {self.user}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='order_items')
    count = models.PositiveIntegerField() 
    price = models.DecimalField(max_digits=10, decimal_places=2)
