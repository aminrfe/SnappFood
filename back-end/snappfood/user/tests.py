from user.models import User 
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


class ChangePasswordViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(phone_number='09939169381', password='oldpassword', first_name='mamad', last_name='mamadi')

        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

        self.url = '/api/auth/change-password'  

    def test_change_password_successful(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        data = {
            'old_password': 'oldpassword',
            'new_password': 'newsecurepassword'
        }
        response = self.client.put(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Password updated successfully.')

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newsecurepassword'))

    def test_change_password_incorrect_old_password(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        data = {
            'old_password': 'wrongpassword',
            'new_password': 'newpassword'
        }
        response = self.client.put(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Old password is incorrect.')


class CustomerSignUpViewTest(APITestCase):
    def setUp(self):
        self.url = '/api/auth/signup/customer' 

    def test_customer_signup_successful(self):
        data = {
            "phone_number": "09939161234",
            "password": "password123",
            "first_name": "mamad",
            "last_name": "mamadi"
        }
        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], 'Customer created successfully')

        self.assertTrue(User.objects.filter(phone_number='09939161234').exists())

    def test_customer_signup_missing_fields(self):
        data = {
            "phone_number": "09939161234"
        }
        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)