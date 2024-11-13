from django.urls import path
from .views import CustomerSignUpView

urlpatterns = [
    path('signup/', CustomerSignUpView.as_view(), name='customer_signup'),
]
