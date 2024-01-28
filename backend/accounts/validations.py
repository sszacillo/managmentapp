from rest_framework import serializers
import re

def custom_validation(data):
    username = validate_username(data)
    password = validate_password(data)
    errors = []

    if not password or len(password) < 8:
        errors.append('Password must contain at least 8 characters')
    if not re.search("[a-z]", password):
        errors.append('Password must contain at least 1 lowercase letter')
    if not re.search("[A-Z]", password):
        errors.append('Password must contain at least 1 uppercase letter')
    if not re.search("[_!@#$%^&*(),.?\":{}|<>]", password):
        errors.append('Password must contain at least 1 special character')
    if not username:
        errors.append('Choose another username')

    if errors:
        raise serializers.ValidationError(errors)

    return data

def validate_username(data):
    if 'username' in data:
        username = data['username'].strip()
        return username
    else:
        raise serializers.ValidationError('Username field is required')

def validate_password(data):
    if 'password' in data:
        password = data['password'].strip()
        return password
    else:
        raise serializers.ValidationError('Password field is required')