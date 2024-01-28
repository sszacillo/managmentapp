from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, username, password=None):
        user = self.model(username=username)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None):
        user = self.create_user(username, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('P', 'Participant'),
        ('L', 'Leader'),
    )

    BAN_CHOICES = (
        ('A', 'Active'),
        ('B', 'Banned'),
    )

    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100, unique=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    role = models.CharField(max_length=1, choices=ROLE_CHOICES, default='P')
    is_active = models.CharField(max_length=1, choices=BAN_CHOICES, default='A')
    login_attempts = models.IntegerField(default=0)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.username
    
    def is_banned(self):
        return self.is_active == 'B'

