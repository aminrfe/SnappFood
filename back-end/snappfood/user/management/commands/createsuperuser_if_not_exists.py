from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

class Command(BaseCommand):
    help = "Create a superuser if it doesn't already exist"

    def handle(self, *args, **kwargs):
        User = get_user_model()

        # Fetch environment variables for superuser creation
        phone_number = os.getenv("DJANGO_SUPERUSER_PHONE_NUMBER", "989114098712")
        first_name = os.getenv("DJANGO_SUPERUSER_FIRST_NAME", "Amin")
        last_name = os.getenv("DJANGO_SUPERUSER_LAST_NAME", "Rafiee")
        password = os.getenv("DJANGO_SUPERUSER_PASSWORD", "admin123")
        role = os.getenv("DJANGO_SUPERUSER_ROLE", "admin")  

        if not User.objects.filter(phone_number=phone_number, is_superuser=True).exists():
            User.objects.create_superuser(
                phone_number=phone_number,
                password=password,
                first_name=first_name,
                last_name=last_name,
                role=role,
            )
            self.stdout.write(self.style.SUCCESS(f"Superuser created successfully with phone number {phone_number}."))
        else:
            self.stdout.write(self.style.WARNING("Superuser already exists."))

