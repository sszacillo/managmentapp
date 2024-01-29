from rest_framework import serializers
from .models import User

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
    def create(self, clean_data):
        user = User.objects.create_user(username=clean_data['username'], password=clean_data['password'])
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def check_user(self, clean_data):
        try:
            user = User.objects.get(username=clean_data['username'])
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid username/User does not exist. Please try again!")

        if not user.check_password(clean_data['password']):
            user.login_attempts += 1
            if user.login_attempts >= 3:
                user.is_active = 'B'
            user.save()
            if user.login_attempts < 3:
                raise serializers.ValidationError(f"Invalid password. Please try again! {3 - user.login_attempts} attempts left.")

        if user.is_active == 'B':
            raise serializers.ValidationError("Account locked due to failed attempts")

        user.login_attempts = 0
        user.save()

        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'username', 'is_staff', 'is_superuser', 'role', 'is_active', 'login_attempts']
