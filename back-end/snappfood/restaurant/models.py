from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser, Group, Permission

class RestaurantManager(BaseUserManager):
    def create_restaurant(self, phone_number, name, password=None, **extra_fields):
        if not phone_number:
            raise ValueError("The Phone Number field must be set")
        restaurant = self.model(phone_number=phone_number, name=name, **extra_fields)
        restaurant.set_password(password)
        restaurant.save(using=self._db)
        return restaurant

    def create_superuser(self, phone_number, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_restaurant(phone_number, name, password, **extra_fields)

class Restaurant(AbstractBaseUser, PermissionsMixin):
    phone_number = models.CharField(max_length=15, unique=True)
    name = models.CharField(max_length=255)
    city = models.CharField(max_length=255, blank=True)
    state = models.CharField(max_length=255, blank=True)
    score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    delivery_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    coordinate = models.JSONField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        Group,
        related_name='restaurant_groups',  # Custom reverse accessor name
        blank=True
    )

    user_permissions = models.ManyToManyField(
        Permission,
        related_name='restaurant_permissions',  # Custom reverse accessor name
        blank=True
    )

    objects = RestaurantManager()

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.name
