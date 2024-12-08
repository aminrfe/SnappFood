from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import CustomerProfile
from .serializers import CustomerProfileSerializer
from .models import CustomerProfile, Favorite, RestaurantProfile
from .serializers import CustomerProfileSerializer, FavoriteSerializer

class CustomerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            customer_profile = request.user.customer_profile
        except CustomerProfile.DoesNotExist:
            return Response({'error': 'Customer profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CustomerProfileSerializer(customer_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        try:
            customer_profile = request.user.customer_profile
        except CustomerProfile.DoesNotExist:
            return Response({'error': 'Customer profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CustomerProfileSerializer(customer_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Customer profile updated successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class FavoriteView(APIView):

    permission_classes = [IsAuthenticated]
    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):

        restaurant_id = request.data.get('restaurant_id')
        if not restaurant_id:
            return Response({'error': 'Restaurant ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            restaurant = RestaurantProfile.objects.get(id=restaurant_id)
        except RestaurantProfile.DoesNotExist:
            return Response({'error': 'Restaurant not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        data = {'restaurant': restaurant.id, 'user': request.user.id}
        serializer = FavoriteSerializer(data=data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, restaurant_id):

        try:
            favorite = Favorite.objects.get(user=request.user, restaurant_id=restaurant_id)
            favorite.delete()
            return Response({'message': 'Favorite removed successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except Favorite.DoesNotExist:
            return Response({'error': 'Favorite not found.'}, status=status.HTTP_404_NOT_FOUND)