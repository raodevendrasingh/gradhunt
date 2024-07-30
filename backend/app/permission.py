from rest_framework import permissions


class IsClerkAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and (request.user.is_authenticated or hasattr(request.user, 'clerk_user_id')))
