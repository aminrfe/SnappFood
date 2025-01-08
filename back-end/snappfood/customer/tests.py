from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

from .models import CustomerProfile, Favorite
from restaurant.models import RestaurantProfile
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


class TestFavoriteView(APITestCase):
    def setUp(self):
        self.customer_user = User.objects.create_user(
            phone_number="4445556666",
            password="test_pass",
            first_name="Alice",
            role="customer",
        )
        self.customer_profile = CustomerProfile.objects.create(
            user=self.customer_user,
            address="Test Address",
        )

        self.manager_user = User.objects.create_user(
            phone_number="7778889999",
            password="manager_pass",
            first_name="Bob",
            role="restaurant_manager",
        )

        self.manager_user2 = User.objects.create_user(
            phone_number="6778889999",
            password="manager_pass",
            first_name="Bob2",
            role="restaurant_manager",
        )

        # Create restaurants
        self.restaurant1 = RestaurantProfile.objects.create(manager=self.manager_user, name="Restaurant A")
        self.restaurant2 = RestaurantProfile.objects.create(manager=self.manager_user2, name="Restaurant B")

        # Authenticate as the customer
        self.client.force_authenticate(user=self.customer_user)

        # Assume your URL for this view is named 'favorite-list'
        self.url = reverse("customer-favorite-restaurants")


    def test_get_favorites(self):
        Favorite.objects.create(user=self.customer_user, restaurant=self.restaurant1)
        Favorite.objects.create(user=self.customer_user, restaurant=self.restaurant2)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_post_add_favorite_success(self):
        """
        Test adding a restaurant to favorites successfully.
        """
        data = {"restaurant_id": self.restaurant1.id}
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("restaurant", response.data)
        # Verify that the favorite was created in the database
        self.assertTrue(Favorite.objects.filter(user=self.customer_user, restaurant=self.restaurant1).exists())

    def test_delete_favorite_success(self):
        """
        Test removing a restaurant from favorites successfully.
        """
        # First, add a favorite
        favorite = Favorite.objects.create(user=self.customer_user, restaurant=self.restaurant1)
        # Now delete it using query param ?restaurant_id=<id>
        delete_url = f"{self.url}?restaurant_id={self.restaurant1.id}"
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Favorite.objects.filter(id=favorite.id).exists())