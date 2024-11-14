from django.urls import path
from .views import TokenObtainPairView, TokenRefreshView, CustomerSignUpView, TestAuthenticationView

urlpatterns = [
    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/customer', CustomerSignUpView.as_view(), name='customer_signup'),
    path('test-auth', TestAuthenticationView.as_view(), name='test-auth'),

]
