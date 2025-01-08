from django.db import models
from django.conf import settings 
from user.models import User

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
        ('pending', 'Pending'),
        ('preparing', 'Preparing'),
        ('ready_for_pickup', 'Ready For Pickup'),
        ('delivering', 'Delivering'),
        ('completed', 'Completed'),
    ]

    order_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    restaurant = models.ForeignKey('restaurant.RestaurantProfile', on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    state = models.CharField(max_length=20, choices=STATE_CHOICES, default='pending')
    delivery_method = models.CharField(max_length=20, choices=DELIVERY_METHOD_CHOICES, default='pickup')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='in_person')
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Order {self.order_id} by {self.user}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    item = models.ForeignKey('restaurant.Item', on_delete=models.CASCADE, related_name='order_items')
    count = models.PositiveIntegerField() 
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.PositiveIntegerField(default=0, help_text="Discount percentage (0 to 100)")


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='reviews')
    score = models.PositiveSmallIntegerField()
    description = models.TextField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'order')