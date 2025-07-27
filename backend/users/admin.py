from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'full_name', 'role', 'is_active', 'created_at')
    list_filter = ('role', 'is_active', 'created_at')
    search_fields = ('email', 'full_name', 'username')
    ordering = ('email',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Library Info', {
            'fields': ('full_name', 'role', 'created_at')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Library Info', {
            'fields': ('full_name', 'role', 'email')
        }),
    )
    
    readonly_fields = ('created_at',)
