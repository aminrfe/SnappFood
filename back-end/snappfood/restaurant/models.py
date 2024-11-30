from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
from django.db import models
from user.models import User

def validate_photo_size(value):
    max_size_mb = 2
    if value.size > max_size_mb * 1024 * 1024:
        raise ValidationError(f"Photo size must not exceed {max_size_mb}MB.")
        
class RestaurantProfile(models.Model):
        
    STATE_CHOICES = [
        ("pending", "PENDING "),
        ("approved", "APPROVED"),
        ("rejected", "REJECTED"),
    ]

    manager = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name="restaurant_profile"
    )  
    name = models.CharField(max_length=255) 
    business_type = models.CharField(max_length=255)  
    city_name = models.CharField(max_length=255)  
    score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    delivery_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    address = models.TextField(blank=True, null=True) 
    description = models.TextField(blank=True, null=True)  
    coordinate = models.JSONField(null=True, blank=True)
    state = models.CharField(max_length=30, default='approved')
    open_hour = models.TimeField(blank=True, default="9:00")
    close_hour = models.TimeField(blank=True, default="23:00")
    photo = models.ImageField(
        upload_to='restaurant_profile_photos/',
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png']),
            validate_photo_size]
    )

    def __str__(self):
        return f"Restaurant: {self.name} ({self.user.phone_number})"
    
    
