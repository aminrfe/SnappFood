from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

from .models import CustomerProfile, Favorite, Cart, CartItem
from restaurant.models import RestaurantProfile, Item
from order.models import Order, OrderItem, Review
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

class TestCartItemDeleteView(APITestCase):
    def setUp(self):
        self.customer_user = User.objects.create_user(
            phone_number="5554443333",
            password="cart_item_pass",
            first_name="Dave",
            role="customer"
        )
        self.customer_profile = CustomerProfile.objects.create(
            user=self.customer_user,
            address="ItemDelete Address",
        )

        self.manager_user = User.objects.create_user(
            phone_number="2223334444",
            password="manager_item_delete_pass",
            first_name="ManagerItemDelete",
            role="restaurant_manager",
        )

        self.restaurant = RestaurantProfile.objects.create(manager=self.manager_user, name="ItemDelete Restaurant", delivery_price=5.00)
        self.item = Item.objects.create(
            item_id=2,
            name="Pizza",
            price=12.00,
            discount=0,
            restaurant=self.restaurant
        )

        self.client.force_authenticate(user=self.customer_user)

        self.cart = Cart.objects.create(user=self.customer_user, restaurant=self.restaurant, total_price=12.00)
        self.cart_item = CartItem.objects.create(cart=self.cart, item=self.item, count=1, price=12.00, discount=0)

        self.delete_url = reverse("cart-item-delete", kwargs={
            "id": self.cart.id,
            "cart_item_id": self.cart_item.id,
        })

    def test_delete_cart_item_success(self):
        response = self.client.delete(self.delete_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(CartItem.objects.filter(id=self.cart_item.id).exists())
        self.assertFalse(Cart.objects.filter(id=self.cart.id).exists())

    def test_delete_cart_item_not_found(self):
        url = reverse("cart-item-delete", kwargs={
            "id": self.cart.id,
            "cart_item_id": 9999,
        })
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TestMenuItemsView(APITestCase):
    def setUp(self):
        self.manager_user = User.objects.create_user(
            phone_number="1234567890",
            password="manager_menu_pass",
            first_name="ManagerMenu",
            role="restaurant_manager",
        )
        self.restaurant = RestaurantProfile.objects.create(manager=self.manager_user, name="Menu Restaurant", delivery_price=5.00)
        self.item1 = Item.objects.create(
            item_id=10,
            name="Steak",
            price=20.00,
            discount=0,
            restaurant=self.restaurant
        )
        self.item2 = Item.objects.create(
            item_id=20,
            name="Fries",
            price=5.00,
            discount=0,
            restaurant=self.restaurant
        )

        self.url = reverse("menu-items", kwargs={"restaurant_id": self.restaurant.id})

    def test_get_menu_items_success(self):

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["name"], "Steak")
        self.assertEqual(response.data[1]["name"], "Fries")

    def test_get_menu_items_restaurant_not_found(self):

        url = reverse("menu-items", kwargs={"restaurant_id": 999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("detail", response.data)

class TestMenuItemDetailView(APITestCase):
    def setUp(self):
        self.manager_user = User.objects.create_user(
            phone_number="0987654321",
            password="manager_item_detail_pass",
            first_name="ManagerItemDetail",
            role="restaurant_manager",
        )
        self.restaurant = RestaurantProfile.objects.create(manager=self.manager_user, name="Detail Menu Restaurant", delivery_price=5.00)
        self.item = Item.objects.create(
            item_id=100,
            name="Soup",
            price=3.00,
            discount=0,
            restaurant=self.restaurant
        )
        self.url = reverse("menu-item-detail", kwargs={
            "restaurant_id": self.restaurant.id,
            "item_id": self.item.item_id
        })

    def test_get_menu_item_success(self):

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Soup")
        self.assertEqual(response.data["price"], "3.00") 

    def test_get_menu_item_not_found(self):

        url = reverse("menu-item-detail", kwargs={
            "restaurant_id": self.restaurant.id,
            "item_id": 999
        })
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("detail", response.data)

class TestOrderListCreateView(APITestCase):
    def setUp(self):
        self.customer_user = User.objects.create_user(
            phone_number="1230984567",
            password="order_pass",
            first_name="Eve",
            role="customer",
        )
        self.customer_profile = CustomerProfile.objects.create(
            user=self.customer_user,
            address="Order Lane",
        )

        self.manager_user = User.objects.create_user(
            phone_number="4567891230",
            password="manager_order_pass",
            first_name="ManagerOrder",
            role="restaurant_manager",
        )

        self.restaurant = RestaurantProfile.objects.create(manager=self.manager_user, name="Order Restaurant", delivery_price=5.00)
        self.item = Item.objects.create(
            item_id=50,
            name="Taco",
            price=8.00,
            discount=0,
            restaurant=self.restaurant
        )
        self.cart = Cart.objects.create(user=self.customer_user, restaurant=self.restaurant, total_price=8.00)
        self.cart_item = CartItem.objects.create(
            cart=self.cart, item=self.item, count=1, price=8.00, discount=0
        )
        self.client.force_authenticate(user=self.customer_user)

        self.list_create_url = reverse("order-list-create")


    def test_post_create_order_success(self):
        data = {
            "cart_id": self.cart.id,
            "delivery_method": "delivery",  
            "payment_method": "online",    
            "description": "No onions please",
        }
        response = self.client.post(self.list_create_url, data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("order_id", response.data)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["message"], "Order created successfully!")

        self.assertFalse(Cart.objects.filter(id=self.cart.id).exists())

        order = Order.objects.filter(user=self.customer_user).first()
        self.assertIsNotNone(order)
        self.assertEqual(order.restaurant, self.restaurant)
        self.assertEqual(order.total_price, 8.00) 
        self.assertEqual(order.delivery_method, "delivery")
        self.assertEqual(order.payment_method, "online")
        self.assertEqual(order.description, "No onions please")

        order_item = OrderItem.objects.filter(order=order, item=self.item).first()
        self.assertIsNotNone(order_item)
        self.assertEqual(order_item.count, 1)
        self.assertEqual(order_item.price, 8.00)

class TestCreateReviewView(APITestCase):
    def setUp(self):
        self.customer_user = User.objects.create_user(
            phone_number="9991112222",
            password="review_pass",
            first_name="Zoe",
            role="customer",
        )
        self.customer_profile = CustomerProfile.objects.create(
            user=self.customer_user,
            address="Review Address",
        )
        self.client.force_authenticate(user=self.customer_user)

        self.manager_user = User.objects.create_user(
            phone_number="3334445555",
            password="manager_review_pass",
            first_name="ManagerReview",
            role="restaurant_manager",
        )
        self.restaurant = RestaurantProfile.objects.create(manager=self.manager_user, name="Review Restaurant", delivery_price=5.00)
        self.order = Order.objects.create(
            user=self.customer_user,
            restaurant=self.restaurant,
            total_price=25.00,
            delivery_method="pickup",
            payment_method="online",
            state="completed",
        )
        self.url = reverse("create-review")

    def test_create_review_success(self):
        data = {
            "order": self.order.order_id,
            "score": 5,
            "description": "Great food!"
        }
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("score", response.data)
        self.assertIn("description", response.data)

        review = Review.objects.filter(order=self.order, user=self.customer_user).first()
        self.assertIsNotNone(review)
        self.assertEqual(review.score, 5)
        self.assertEqual(review.description, "Great food!")

    def test_create_review_for_non_existent_order(self):
        data = {
            "order": 9999,  
            "score": 4,
            "description": "This won't work"
        }
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)

    def test_create_review_already_exists(self):
        data = {
            "order": self.order.order_id,
            "score": 5,
            "description": "Awesome!"
        }
        self.client.post(self.url, data=data, format="json")
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)

class TestGetItemReviewsView(APITestCase):
    def setUp(self):
        self.customer_user = User.objects.create_user(
            phone_number="9991112222",
            password="test_pass",
            first_name="John",
            role="customer",
        )
        self.client.force_authenticate(user=self.customer_user)

        self.manager_user = User.objects.create_user(
            phone_number="3334445555",
            password="manager_pass",
            first_name="Manager",
            role="restaurant_manager",
        )
        self.restaurant = RestaurantProfile.objects.create(
            manager=self.manager_user, 
            name="Test Restaurant", 
            delivery_price=5.00,
        )

        self.item = Item.objects.create(
            restaurant=self.restaurant,
            name="Pizza",
            price=10.00,
            description="Delicious pizza.",
        )
        self.order = Order.objects.create(
            user=self.customer_user,
            restaurant=self.restaurant,
            total_price=10.00,
            delivery_method="pickup",
            payment_method="online",
            state="completed",
        )
        self.order_item = OrderItem.objects.create(
            order=self.order,
            item=self.item,
            count=1,
            price=10.00,
        )

        self.review = Review.objects.create(
            user=self.customer_user,
            order=self.order,
            score=5,
            description="Amazing pizza!",
        )

        self.url = reverse("get-item-reviews", kwargs={"item_id": self.item.item_id})

    def test_get_reviews_success(self):
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["score"], 5)
        self.assertEqual(response.data[0]["description"], "Amazing pizza!")

    def test_get_reviews_item_not_found(self):
        url = reverse("get-item-reviews", kwargs={"item_id": 9999})
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("detail", response.data)
        self.assertEqual(response.data["detail"], "Item not found.")