from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

from .models import CustomerProfile, Favorite, Cart, CartItem
from restaurant.models import RestaurantProfile, Item
from .serializers import CustomerProfileSerializer

User = get_user_model()

class TestCustomerProfileView(APITestCase):
    def setUp(self):
        self.customer_user = User.objects.create_user(
            phone_number="1112223333",
            password="customer_pass",
            first_name="John",
            role="customer",
        )
        self.customer_profile = CustomerProfile.objects.create(
            user=self.customer_user,
        )
        self.client.force_authenticate(user=self.customer_user)

        self.url = reverse("customer-profile")

    def test_get_profile_success(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("address", response.data)
        self.assertEqual(response.data["address"], self.customer_profile.address)

    def test_put_update_profile_success(self):
        data = {
            "user": {"id":1},
            "address": "456 New Address",
            "state": "approved",  
        }
        response = self.client.put(self.url, data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["message"], "Customer profile updated successfully.")

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

        self.restaurant1 = RestaurantProfile.objects.create(manager=self.manager_user, name="Restaurant A")
        self.restaurant2 = RestaurantProfile.objects.create(manager=self.manager_user2, name="Restaurant B")

        self.client.force_authenticate(user=self.customer_user)

        self.url = reverse("customer-favorite-restaurants")


    def test_get_favorites(self):
        Favorite.objects.create(user=self.customer_user, restaurant=self.restaurant1)
        Favorite.objects.create(user=self.customer_user, restaurant=self.restaurant2)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_post_add_favorite_success(self):
        data = {"restaurant_id": self.restaurant1.id}
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("restaurant", response.data)
        self.assertTrue(Favorite.objects.filter(user=self.customer_user, restaurant=self.restaurant1).exists())

    def test_delete_favorite_success(self):
        favorite = Favorite.objects.create(user=self.customer_user, restaurant=self.restaurant1)
        delete_url = f"{self.url}?restaurant_id={self.restaurant1.id}"
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Favorite.objects.filter(id=favorite.id).exists())


class TestCartListCreateView(APITestCase):
    def setUp(self):
        self.customer_user = User.objects.create_user(
            phone_number="9998887777",
            password="cart_pass",
            first_name="Bob",
            role="customer",
        )
        self.customer_profile = CustomerProfile.objects.create(
            user=self.customer_user,
            address="Cart Street",
        )

        self.manager_user = User.objects.create_user(
            phone_number="6665554444",
            password="manager_cart_pass",
            first_name="ManagerCart",
            role="restaurant_manager",
        )

        self.restaurant = RestaurantProfile.objects.create(manager=self.manager_user, name="Cart Restaurant", delivery_price=5.00)
        self.item = Item.objects.create(
            item_id=1,
            name="Burger",
            price=10.00,
            discount=0,
            restaurant=self.restaurant
        )
        self.client.force_authenticate(user=self.customer_user)

        self.list_create_url = reverse("cart-list-create")

    def test_post_add_item_to_cart_success(self):
        data = {
            "restaurant_id": self.restaurant.id,
            "item_id": self.item.item_id,
            "count": 2
        }
        response = self.client.post(self.list_create_url, data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("restaurant", response.data)
        self.assertIn("cart_items", response.data)

        cart = Cart.objects.get(user=self.customer_user, restaurant=self.restaurant)
        self.assertEqual(cart.cart_items.count(), 1)
        self.assertEqual(cart.total_price, 20.00)  

    def test_post_add_item_to_cart_item_not_found(self):
        data = {
            "restaurant_id": self.restaurant.id,
            "item_id": 999,  
            "count": 1
        }
        response = self.client.post(self.list_create_url, data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class TestCartDetailView(APITestCase):
    def setUp(self):
        self.customer_user = User.objects.create_user(
            phone_number="7776665555",
            password="cart_detail_pass",
            first_name="Charlie",
            role="customer",
        )
        self.customer_profile = CustomerProfile.objects.create(
            user=self.customer_user,
            address="Detail St",
        )

        self.manager_user = User.objects.create_user(
            phone_number="3334445555",
            password="manager_detail_pass",
            first_name="ManagerDetail",
            role="restaurant_manager",
        )

        self.restaurant = RestaurantProfile.objects.create(manager=self.manager_user, name="Detail Restaurant", delivery_price=5.00)
        self.item = Item.objects.create(
            item_id=1,
            name="Salad",
            price=5.00,
            discount=0,
            restaurant=self.restaurant
        )

        self.cart = Cart.objects.create(user=self.customer_user, restaurant=self.restaurant, total_price=5.00)
        self.cart_item = CartItem.objects.create(
            cart=self.cart, item=self.item, count=1, price=5.00, discount=0
        )
        self.client.force_authenticate(user=self.customer_user)

        self.detail_url = reverse("cart-detail", kwargs={"id": self.cart.id})

    def test_get_cart_detail_success(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.cart.id)
        self.assertEqual(len(response.data["cart_items"]), 1)

    def test_put_update_cart_item_success(self):
        data = {
            "cart_item_id": self.cart_item.id,
            "count": 3,
        }
        response = self.client.put(self.detail_url, data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.cart_item.refresh_from_db()
        self.assertEqual(self.cart_item.count, 3)
        self.cart.refresh_from_db()
        self.assertEqual(self.cart.total_price, 15.00) 

    def test_delete_cart_success(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Cart.objects.filter(id=self.cart.id).exists())
