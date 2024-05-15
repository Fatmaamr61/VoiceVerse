import datetime

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
# from django.db.models.signals import post_save
from django.conf import settings
from django.dispatch import receiver
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from dateutil.relativedelta import relativedelta


# Create your models here.


class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        # if not email:
        #     raise ValueError('The Email field must be set')

        """Create and return a `User` with an email, username and password."""
        if username is None:
            raise TypeError('Users must have a username.')

        if email is None:
            raise TypeError('Users must have an email address.')

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)


class USER(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(null=False, blank=False, unique=True,
                              error_messages={
                                  "unique": _("A user with that email already exists."),
                              })
    username = models.CharField(max_length=30, unique=True, null=False, blank=False)
    first_name = models.CharField(max_length=30, null=False, blank=True)
    last_name = models.CharField(max_length=30, null=False, blank=True)

    phone = models.CharField(max_length=15, null=False, blank=True,
                             error_messages={
                                 "unique": _("A user with that phone number already exists."),
                             })

    email_verified = models.BooleanField(_("email_verified"),
                                         default=False,
                                         help_text=_(
                                             "Designates whether this user's email is verified "), )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = UserManager()

    def __str__(self):
        return self.username

    def verify_account(self):
        try:
            self.email_verified = True
            self.save()
            return True
        except Exception as e:
            print(e)
            return False

    def change_password(self, password):
        try:
            self.set_password(password)
            self.save()
            return True
        except Exception as e:
            print(e)
            return False

    def deactivate_account(self):
        try:
            self.is_active = False
            self.save()
            return True
        except Exception as e:
            print(e)
            return False

    # @property
    # def is_doctor(self):
    #     return hasattr(self, 'doctor')

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'


class PasswordReset(models.Model):
    user = models.ForeignKey(USER, on_delete=models.CASCADE)
    key = models.CharField(_("Key"), max_length=64, db_index=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(
            self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        # self.expires_at = datetime.datetime.now() + relativedelta(hours=1)
        self.expires_at = timezone.now() + relativedelta(hours=1)
        super().save(force_insert, force_update, using, update_fields)

    def __str__(self):
        return self.user.email

    def get_absolute_url(self):
        return reverse('password_reset_confirm', kwargs={'key': self.key})


class EmailVerification(models.Model):
    user = models.ForeignKey(USER, on_delete=models.CASCADE)
    key = models.CharField(_("Key"), max_length=64, db_index=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(
            self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        self.expires_at = timezone.now() + relativedelta(hours=1)
        super().save(force_insert, force_update, using, update_fields)

    def __str__(self):
        return str(self.user.email)
