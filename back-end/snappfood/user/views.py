from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .serializers import CustomTokenObtainPairSerializer, CustomerSignUpSerializer, RestaurantSignUpSerializer
from .serializers import PasswordChangeSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Change user password",
        operation_description="Allows authenticated users to change their password by providing the old and new passwords.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'old_password': openapi.Schema(type=openapi.TYPE_STRING, description="Current password of the user."),
                'new_password': openapi.Schema(type=openapi.TYPE_STRING, description="New password to set."),
            },
            required=['old_password', 'new_password']
        ),
        responses={
            200: openapi.Response("Password updated successfully", examples={"application/json": {"message": "Password updated successfully."}}),
            400: openapi.Response("Invalid input or incorrect old password", examples={"application/json": {"error": "Old password is incorrect."}}),
            500: openapi.Response("Internal server error"),
        }
    )

    def put(self, request):
        user = request.user
        serializer = PasswordChangeSerializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if not user.check_password(old_password):
                return Response({"error": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CustomerSignUpView(APIView):

    @swagger_auto_schema(
        operation_summary="Customer Sign Up",
        operation_description="Allows a new customer to register an account.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'phone_number': openapi.Schema(type=openapi.TYPE_STRING, description="Phone number of the customer."),
                'first_name': openapi.Schema(type=openapi.TYPE_STRING, description="First name of the customer."),
                'last_name': openapi.Schema(type=openapi.TYPE_STRING, description="Last name of the customer."),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description="Password for the customer account."),
            },
            required=['phone_number', 'first_name', 'last_name', 'password']
        ),
        responses={
            201: openapi.Response("Customer created successfully", examples={"application/json": {"message": "Customer created successfully"}}),
            400: openapi.Response("Invalid input", examples={"application/json": {"phone_number": ["A user with this phone number already exists."], "password": ["This field is required."]}}),
            500: openapi.Response("Internal server error"),
        }
    )

    def post(self, request, *args, **kwargs):
        serializer = CustomerSignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'Customer created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RestaurantSignUpView(APIView):

    @swagger_auto_schema(
        operation_summary="Restaurant Manager Sign Up",
        operation_description="Allows a new restaurant manager to register an account.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'phone_number': openapi.Schema(type=openapi.TYPE_STRING, description="Phone number of the restaurant manager."),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description="Password for the restaurant manager account."),
                'name': openapi.Schema(type=openapi.TYPE_STRING, description="Name of the restaurant."),
                'business_type': openapi.Schema(type=openapi.TYPE_STRING, description="Type of business the restaurant operates."),
                'city_name': openapi.Schema(type=openapi.TYPE_STRING, description="City where the restaurant is located."),
            },
            required=['phone_number', 'password', 'name', 'business_type', 'city_name']
        ),
        responses={
            201: openapi.Response("Restaurant Manager created successfully", examples={"application/json": {"message": "Restaurant Manager created successfully"}}),
            400: openapi.Response("Invalid input", examples={"application/json": {"phone_number": ["A user with this phone number already exists."], "password": ["This field is required."]}}),
            500: openapi.Response("Internal server error"),
        }
    )

    def post(self, request, *args, **kwargs):
        serializer = RestaurantSignUpSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Restaurant Manager created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TestAuthenticationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Authentication successful!"})
    

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
