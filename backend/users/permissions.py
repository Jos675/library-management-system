"""
Role-Based Access Control (RBAC) System
Implements comprehensive permissions and decorators for the Library Management System
"""

from rest_framework import permissions
from rest_framework.decorators import permission_classes
from functools import wraps
from django.http import JsonResponse
from django.core.exceptions import PermissionDenied


class RoleBasedPermission(permissions.BasePermission):
    """
    Base permission class for role-based access control
    Supports multiple roles and custom logic
    """
    required_roles = []
    allow_superuser = True
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
            
        # Allow superuser access if enabled
        if self.allow_superuser and request.user.is_superuser:
            return True
            
        # Check if user has required role
        user_role = getattr(request.user, 'role', None)
        return user_role in self.required_roles


class IsAdminUser(RoleBasedPermission):
    """Permission for admin users only"""
    required_roles = ['admin']


class IsLibrarianUser(RoleBasedPermission):
    """Permission for librarian users only"""
    required_roles = ['librarian']


class IsStudentUser(RoleBasedPermission):
    """Permission for student users only"""
    required_roles = ['student']


class IsAdminOrLibrarian(RoleBasedPermission):
    """Permission for admin and librarian users"""
    required_roles = ['admin', 'librarian']


class IsAdminOrLibrarianOrStudent(RoleBasedPermission):
    """Permission for all authenticated users (any role)"""
    required_roles = ['admin', 'librarian', 'student']


class IsOwnerOrAdminOrLibrarian(permissions.BasePermission):
    """
    Permission that allows users to access their own data
    or admin/librarian to access any data
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Admin and librarian have full access
        if hasattr(request.user, 'role') and request.user.role in ['admin', 'librarian']:
            return True
            
        # Users can access their own data
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        # For user objects, check if it's the same user
        if hasattr(obj, 'id') and hasattr(request.user, 'id'):
            return obj.id == request.user.id
            
        return False


# Decorator functions for function-based views
def admin_required(view_func):
    """Decorator to require admin role for function-based views"""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
            
        if not hasattr(request.user, 'role') or request.user.role != 'admin':
            return JsonResponse({'error': 'Admin access required'}, status=403)
            
        return view_func(request, *args, **kwargs)
    return wrapper


def librarian_required(view_func):
    """Decorator to require librarian role for function-based views"""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
            
        user_role = getattr(request.user, 'role', None)
        if user_role not in ['admin', 'librarian']:
            return JsonResponse({'error': 'Librarian access required'}, status=403)
            
        return view_func(request, *args, **kwargs)
    return wrapper


def student_required(view_func):
    """Decorator to require student role for function-based views"""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
            
        if not hasattr(request.user, 'role') or request.user.role != 'student':
            return JsonResponse({'error': 'Student access required'}, status=403)
            
        return view_func(request, *args, **kwargs)
    return wrapper


def role_required(*roles):
    """
    Decorator factory for requiring specific roles
    Usage: @role_required('admin', 'librarian')
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return JsonResponse({'error': 'Authentication required'}, status=401)
                
            user_role = getattr(request.user, 'role', None)
            if user_role not in roles:
                return JsonResponse({
                    'error': f'Access denied. Required roles: {", ".join(roles)}'
                }, status=403)
                
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


class RoleMiddleware:
    """
    Middleware to add role-based context to requests
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Add role information to request
        if hasattr(request, 'user') and request.user.is_authenticated:
            request.user_role = getattr(request.user, 'role', None)
            request.is_admin = request.user_role == 'admin'
            request.is_librarian = request.user_role in ['admin', 'librarian']
            request.is_student = request.user_role == 'student'
        else:
            request.user_role = None
            request.is_admin = False
            request.is_librarian = False
            request.is_student = False

        response = self.get_response(request)
        return response


# Helper functions for checking permissions in code
def user_has_role(user, role):
    """Check if user has specific role"""
    return hasattr(user, 'role') and user.role == role


def user_has_any_role(user, roles):
    """Check if user has any of the specified roles"""
    user_role = getattr(user, 'role', None)
    return user_role in roles


def can_manage_users(user):
    """Check if user can manage other users"""
    return user_has_role(user, 'admin')


def can_manage_books(user):
    """Check if user can manage books"""
    return user_has_any_role(user, ['admin', 'librarian'])


def can_manage_borrowing(user):
    """Check if user can manage borrowing operations"""
    return user_has_any_role(user, ['admin', 'librarian'])


def can_view_reports(user):
    """Check if user can view system reports"""
    return user_has_any_role(user, ['admin', 'librarian'])


def can_access_admin_features(user):
    """Check if user can access admin-only features"""
    return user_has_role(user, 'admin')


# Permission class factory for dynamic role checking
def create_role_permission(*roles):
    """
    Factory function to create permission classes for specific roles
    Usage: AdminLibrarianPermission = create_role_permission('admin', 'librarian')
    """
    class DynamicRolePermission(RoleBasedPermission):
        required_roles = list(roles)
    
    return DynamicRolePermission
