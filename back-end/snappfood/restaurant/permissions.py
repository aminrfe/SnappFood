from rest_framework.permissions import BasePermission

class IsRestaurantManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "restaurant_manager"
