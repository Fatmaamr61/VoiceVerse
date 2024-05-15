from django.contrib import admin
from .models import USER, PasswordReset, EmailVerification


@admin.register(USER)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'first_name', 'last_name',
                    'phone', 'email_verified', 'date_joined', 'last_login')
    list_display_links = ('id', 'username', 'email',)

    list_filter = ('id', 'username', 'email', 'first_name', 'last_name',
                   'phone', 'email_verified', 'date_joined', 'last_login')

    search_fields = ('id', 'username', 'email', 'first_name', 'last_name',
                     'phone', 'email_verified', 'date_joined', 'last_login')

    ordering = ('id', 'username', 'email', 'first_name', 'last_name',
                'phone', 'email_verified', 'date_joined', 'last_login')

    list_per_page = 25


@admin.register(PasswordReset)
class PasswordResetAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'key', 'created_at', 'expires_at')
    list_display_links = ('id', 'user', 'key', 'created_at', 'expires_at')
    list_filter = ('id', 'user', 'key', 'created_at', 'expires_at')


@admin.register(EmailVerification)
class EmailVerificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'key', 'created_at', 'expires_at')
    list_display_links = ('id', 'user',)
    list_filter = ('id', 'user', 'key', 'created_at', 'expires_at')
