from rest_framework.permissions import BasePermission, SAFE_METHODS


class UserPermission(BasePermission):

    def has_permission(self, request, view):
        if view.action == 'list':
            return request.user.is_authenticated
            # return True
        elif view.action == 'create':
            return True
        elif view.action in ['retrieve', 'update', 'partial_update']:
            return True
        elif view.action == 'destroy':
            return request.user.is_superuser
        else:
            return False

    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False
        elif view.action == 'retrieve':
            return True
        elif view.action in ['update', 'partial_update']:
            return obj.user == request.user or request.user.is_staff
        elif view.action == 'destroy':
            return bool(request.user.is_staff)
        else:
            return False

        # admin : del , PUT , POST
        # user :  GET , PUT


class IsStaff(BasePermission):
    def has_permission(self, request, view):

        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False
        # Superusers can perform all CRUD operations
        if request.user.is_superuser:
            return True
        # Staff can perform all operations except DELETE
        elif request.user.is_staff:
            return request.method in (SAFE_METHODS + ('POST', 'PUT'))


class IsStaffOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        # Superusers can perform all CRUD operations
        elif request.user.is_superuser:
            return True
        # Staff can perform GET, POST, and PUT operations
        elif request.user.is_staff:
            return request.method in (SAFE_METHODS + ('POST', 'PUT'))
        # Regular users can only perform GET operations
        else:
            return request.method in SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        # Superusers can perform all CRUD operations
        elif request.user.is_superuser:
            return True
        # Regular users can only perform GET operations
        else:
            return request.method in SAFE_METHODS


class IsGuideOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        # Superusers can perform all CRUD operations
        if request.user.is_superuser:
            return True
        # Staff can perform GET, POST, and PUT operations
        elif request.user.is_staff or request.user.is_guide:
            return request.method in (SAFE_METHODS + ('POST', 'PUT', 'DELETE'))
        # Regular users can only perform GET operations
        else:
            return request.method in SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False
        elif view.action == 'retrieve':
            return True
        elif view.action in ['update', 'partial_update']:
            return obj.guide == request.user or request.user.is_staff or request.user.is_guide
        elif view.action == 'destroy':
            return request.user.is_staff or obj.guide == request.user
        else:
            return False


class IsGuide(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        # Superusers can perform all CRUD operations
        if request.user.is_superuser:
            return True
        # Guide users can perform all CRUD operations
        else:
            return request.user.is_guide

    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False

        elif view.action in ['update', 'partial_update', 'retrieve', 'destroy']:
            return obj.doctor == request.user
        else:
            return request.user.is_superuser


class IsGuideOrAuthForRetrieve(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        # Superusers can perform all CRUD operations
        if request.user.is_superuser:
            return True
        # Guide users can perform all CRUD operations
        else:
            return request.user.is_guide

    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False

        elif view.action in ['update', 'partial_update', 'destroy']:
            return obj.doctor == request.user
        # elif view.action == 'retrieve':
        #     return request.user.is_authenticated
        else:
            return request.user.is_superuser
