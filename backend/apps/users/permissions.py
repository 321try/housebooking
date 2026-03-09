from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    Permission class to check if user is an admin
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'ADMIN'


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission class to allow read-only access to everyone,
    but write access only to admins
    """
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.role == 'ADMIN'


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission class to allow access to owners or admins
    """
    
    def has_object_permission(self, request, view, obj):
        if request.user and request.user.is_authenticated:
            if request.user.role == 'ADMIN':
                return True
            # Check if the object has a 'user' attribute and it matches the request user
            return hasattr(obj, 'user') and obj.user == request.user
        return False
