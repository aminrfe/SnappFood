from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

from .models import CustomerProfile
from .serializers import CustomerProfileSerializer

User = get_user_model()

class TestCustomerProfileView(APITestCase):
    def setUp(self):
        # Create a user with 'customer' role
        self.customer_user = User.objects.create_user(
            phone_number="1112223333",
            password="customer_pass",
            first_name="John",
            role="customer",
        )
        # Create a CustomerProfile for that user
        self.customer_profile = CustomerProfile.objects.create(
            user=self.customer_user,
        )
        # Authenticate as this customer
        self.client.force_authenticate(user=self.customer_user)

        # Assume your URL for this view is named 'customer-profile'
        self.url = reverse("customer-profile")

    def test_get_profile_success(self):
        """
        Ensure we can retrieve the currently authenticated user's customer profile.
        """
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("address", response.data)
        self.assertEqual(response.data["address"], self.customer_profile.address)

    def test_put_update_profile_success(self):
        """
        Test updating the entire profile (PUT).
        """
        data = {
            "user": {"id":1},
            "address": "456 New Address",
            "state": "approved",  # Assuming 'state' is part of the serializer
            # Include 'latitude' and 'longitude' if they are updatable
        }
        response = self.client.put(self.url, data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["message"], "Customer profile updated successfully.")

        # Verify changes in DB
        self.customer_profile.refresh_from_db()
        self.assertEqual(self.customer_profile.address, "456 New Address")


