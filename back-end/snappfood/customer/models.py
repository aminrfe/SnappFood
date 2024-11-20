from django.db import models
from user.models import User

class CustomerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="customer_profile", primary_key=True)
    state = models.CharField(max_length=30)
    
    def __str__(self):
        return f"Customer: {self.user.phone_number}"
