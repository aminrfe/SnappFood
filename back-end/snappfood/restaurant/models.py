import os
import uuid
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Avg
from user.models import User
from order.models import Order, OrderItem, Review


def validate_photo_size(value):
    max_size_mb = 2
    if value.size > max_size_mb * 1024 * 1024:
        raise ValidationError(f"Photo size must not exceed {max_size_mb}MB.")
        
class RestaurantProfile(models.Model):
    def unique_image_path(instance, filename):
        ext = filename.split('.')[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        return os.path.join('restaurant-ptofile-images/', filename)

    STATE_CHOICES = [
        ("pending", "PENDING"),
        ("approved", "APPROVED"),
        ("rejected", "REJECTED"),
    ]

    BUSINESS_TYPES = [
        ("restaurant", "Restaurant"),
        ("cafe", "Cafe"),
        ("bakery", "Bakery"),
        ("sweets", "Sweets"),
        ("ice_cream", "Ice Cream"),
    ]

    manager = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name="restaurant_profile"
    )  
    name = models.CharField(max_length=255) 
    business_type = models.CharField(max_length=255, choices=BUSINESS_TYPES, default='restaurant')  
    city_name = models.CharField(max_length=255)  
    score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    delivery_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    address = models.TextField(blank=True, null=True) 
    description = models.TextField(blank=True, null=True)
    state = models.CharField(max_length=30, choices=STATE_CHOICES, default='pending')
    open_hour = models.TimeField(blank=True, default="9:00")
    close_hour = models.TimeField(blank=True, default="23:00")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    photo = models.ImageField(
        upload_to=unique_image_path,
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png']),
            validate_photo_size]
    )

    def calculate_score(self):
        reviews = Review.objects.filter(order__restaurant=self)
        avg_score = reviews.aggregate(average=Avg('score'))['average']
        return round(avg_score, 2) if avg_score else 0.0
    
    @property
    def score(self):
        return self.calculate_score()

    def __str__(self):
        return f"Restaurant: {self.name} ({self.manager.phone_number})"
    
class Item(models.Model):
    def unique_item_image_path(instance, filename):
        ext = filename.split('.')[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        return os.path.join('item_images/', filename)

    STATE_CHOICES = [
        ('available', 'Available'),
        ('unavailable', 'Unavailable'),
    ]

    item_id = models.AutoField(primary_key=True)
    restaurant = models.ForeignKey(RestaurantProfile, on_delete=models.CASCADE, related_name='items')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.PositiveIntegerField(default=0, help_text="Discount percentage (0 to 100)")
    name = models.CharField(max_length=100)
    score = models.FloatField(default=0.0)
    description = models.TextField(null=True, blank=True)
    state = models.CharField(max_length=50, choices=STATE_CHOICES, default='available')
    photo = models.ImageField(
        upload_to=unique_item_image_path,
        blank=True,
        null=True,
        validators=[
        FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png']),
        validate_photo_size]
    )

    def calculate_score(self):
        order_items = OrderItem.objects.filter(item=self)
        orders = Order.objects.filter(order_id__in=order_items.values_list('order_id', flat=True))
        avg_score = Review.objects.filter(order__in=orders).aggregate(average=Avg('score'))['average']
        return round(avg_score, 2) if avg_score else 0.0

    @property
    def score(self):
        return self.calculate_score()

    def __str__(self):
        return self.name

