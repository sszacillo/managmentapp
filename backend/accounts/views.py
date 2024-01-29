from django.contrib.auth import login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer
from rest_framework import permissions, status
from .validations import custom_validation, validate_username, validate_password
from django.views.decorators.csrf import csrf_exempt
from .models import User

class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)
    @csrf_exempt
    def post(self, request):
        clean_data = custom_validation(request.data)
        serializer = UserRegisterSerializer(data=clean_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(clean_data)
            if user:
                return Response({'message':'Registration successful'}, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)

class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    @csrf_exempt
    def post(self, request):
        validate_username(request.data)
        validate_password(request.data)
        clean_data = request.data
        serializer = UserLoginSerializer(data=clean_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(clean_data)
            login(request, user)
            return Response({'message':'Login successful'}, status=status.HTTP_200_OK,)
        return Response(status=status.HTTP_400_BAD_REQUEST)

class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    @csrf_exempt
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)

class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    @csrf_exempt
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({**serializer.data, 'sessionid': request.session.session_key}, status=status.HTTP_200_OK)
    
class UserRoleView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user_role = request.user.role

        return Response({'role': user_role}, status=status.HTTP_200_OK)
    
class AllUsersListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)