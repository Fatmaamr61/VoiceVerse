from django.db import models


class UserTypes(models.IntegerChoices):
    NORMALUSER = 1, "NORMALUSER"
    ADMINUSER = 896, "ADMINUSER"  #


class SettingsType(models.TextChoices):
    NUMBER = 'number', "NUMBER"
    TEXT = 'text', "TEXT"  #
