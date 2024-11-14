from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .serializers import CustomerSignUpSerializer

class CustomerSignUpView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CustomerSignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'Customer created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TestAuthenticationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Authentication successful!"})