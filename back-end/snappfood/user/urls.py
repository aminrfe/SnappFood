from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomTokenObtainPairView, CustomerSignUpView, TestAuthenticationView,RestaurantSignUpView, ChangePasswordView

urlpatterns = [
    path('signup/restaurant', RestaurantSignUpView.as_view(), name='restaurant_signup'),
    path('token', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/customer', CustomerSignUpView.as_view(), name='customer_signup'),
    path('test-auth', TestAuthenticationView.as_view(), name='test-auth'),
    path('change-password', ChangePasswordView.as_view(), name='change-password'),

]
