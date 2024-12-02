from django.urls import path
from .views import CustomTokenObtainPairView, TokenRefreshView, CustomerSignUpView, TestAuthenticationView,RestaurantSignUpView

urlpatterns = [
    path('signup/restaurant', RestaurantSignUpView.as_view(), name='restaurant_signup'),
    path('token', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/customer', CustomerSignUpView.as_view(), name='customer_signup'),
    path('test-auth', TestAuthenticationView.as_view(), name='test-auth'),

]
