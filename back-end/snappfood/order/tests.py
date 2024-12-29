from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from restaurant.models import RestaurantProfile
from .models import Order

User = get_user_model()


class TestRestaurantOrderListView(APITestCase):
    def setUp(self):
        self.manager = User.objects.create_user(
            phone_number="1234567890",
            password="manager_password",
            first_name="Manager",
            role="restaurant_manager"
        )
        
        self.restaurant = RestaurantProfile.objects.create(manager=self.manager, name="Test Restaurant")
        self.client.force_authenticate(user=self.manager)

        self.order1 = Order.objects.create(
            user=self.manager,
            restaurant=self.restaurant,
            total_price=100,
            state="pending",
            delivery_method="pickup",
            payment_method="in_person"
        )
        self.order2 = Order.objects.create(
            user=self.manager,
            restaurant=self.restaurant,
            total_price=200,
            state="preparing",
            delivery_method="delivery",
            payment_method="online"
        )

    def test_get_orders_success(self):
        response = self.client.get("/api/restaurant/orders")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  

    def test_get_orders_no_orders(self):
        Order.objects.all().delete()  
        response = self.client.get("/api/restaurant/orders")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0) 


class TestUpdateOrderStatusView(APITestCase):
    def setUp(self):
        self.manager = User.objects.create_user(
            phone_number="0987654321",
            password="manager_password",
            first_name="Manager",
            role="restaurant_manager"
        )
        self.restaurant = RestaurantProfile.objects.create(manager=self.manager, name="Sample Restaurant")
        self.client.force_authenticate(user=self.manager)

        self.order = Order.objects.create(
            user=self.manager,
            restaurant=self.restaurant,
            total_price=100,
            state="pending",
            delivery_method="pickup",
            payment_method="in_person"
        )

        self.valid_payload = {
            "state": "completed"
        }
        self.invalid_payload = {
            "state": "invalid_state"  
        }

    def test_update_order_status_success(self):
        response = self.client.patch(f"/api/restaurant/orders/{self.order.order_id}/status", data=self.valid_payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.order.refresh_from_db()  
        self.assertEqual(self.order.state, "completed")  

    def test_update_order_status_invalid_payload(self):
        response = self.client.patch(f"/api/restaurant/orders/{self.order.order_id}/status", data=self.invalid_payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.order.refresh_from_db()
        self.assertEqual(self.order.state, "pending")  

