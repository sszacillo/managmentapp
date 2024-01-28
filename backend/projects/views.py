from itertools import product
from django.db.models import QuerySet, deletion, F
from django.template.context import RenderContext
from django.utils import timezone
from django.db.models import QuerySet
from rest_framework import generics, status, serializers, permissions
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.models import User
from .models import Project, Task
from .serializers import ProjectSerializer, TaskSerializer, ProjectWithTaskSerializer, UserUpdateTasksSerializer, ProjectSerializer,Projectwithtaskserializer
from datetime import datetime

class IsProjectMember(permissions.BasePermission):
    def has_permission(self, request, view):
        # Retrieve project_id from URL parameters
        project_id = view.kwargs.get('pk')
        user = request.user
        # Check if the user is a member of the project
        try:
            project = Project.objects.get(pk=project_id)
        except Project.DoesNotExist:
            if user.is_superuser:
                raise serializers.ValidationError("Podany obiekt nie istnieje")
            else:
                raise serializers.ValidationError(
                    "Podany obiekt nie istnieje lub nie masz do niego dostepu")

        return user in project.project_users.all() or user.is_superuser

from rest_framework import permissions
from .models import Task

class IsTaskUser(permissions.BasePermission):
    def has_permission(self, request, view):
        # Retrieve task_id from URL parameters
        task_id = view.kwargs.get('pk')
        user = request.user

        try:
            # Sprawdź, czy użytkownik jest przypisany do zadania
            task = Task.objects.get(pk=task_id, project_id__project_users=user)
        except Task.DoesNotExist:
            if user.is_superuser:
                raise serializers.ValidationError("Podany obiekt nie istnieje")
            else:
                raise serializers.ValidationError(
                    "Podany obiekt nie istnieje lub nie masz do niego dostepu")
        return user in task.project_id.project_users.all() or user.is_superuser
            


class IsProjectAdmin(permissions.BasePermission):
    def has_permission(self, request, view):

        project_id = view.kwargs.get('pk')
        user = request.user

        try:
            project = Project.objects.get(pk=project_id)
        except Project.DoesNotExist:
            if user.is_superuser:
                raise serializers.ValidationError("Podany obiekt nie istnieje")
            else:
                raise serializers.ValidationError(
                    "Podany obiekt nie istnieje lub nie masz do niego dostepu")

        user = request.user
        if (user.role == 'L' and user in project.project_users.all()) or user.is_superuser:
            return user
        else:
            raise serializers.ValidationError(
                "Użytkownik nie jest administratorem tego projektu.")


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):

        user = request.user

        if user.role == 'L' or user.is_superuser:
            return user
        else:
            raise serializers.ValidationError(
                "Użytkownik nie jest administratorem")


class TaskList(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsProjectAdmin]

    def get_queryset(self):
        queryset = Task.objects.all()
        p_id = self.request.query_params.get('p_id')
        if p_id is not None:
            queryset = queryset.filter(project_id=p_id)
        return queryset


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        queryset = Task.objects.all()   
        return queryset


class ProjectCreateView(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAdmin]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)


class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsProjectAdmin]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        queryset = Project.objects.all()  
        return queryset


class ProjectWithTasksDetailView(generics.ListAPIView):
    serializer_class = Projectwithtaskserializer
    permission_classes = [IsProjectMember]
    lookup_field = 'pk'
    def get_queryset(self):
        project_id = self.kwargs.get('pk')
        user = self.request.user
        queryset = Project.objects.filter(pk=project_id)
        return queryset


class TaskStatusView(generics.ListAPIView):
    serializer_class = TaskSerializer
    

    def get_queryset(self):
        task_status = self.request.query_params.get('taskstatus', None)
        user = self.request.user

        if task_status is not None:
            return Task.objects.filter(task_status=task_status, project_id__project_users=user)

        return Task.objects.filter(project_id__project_users=user)


class TaskDataView(generics.ListAPIView):
    serializer_class = TaskSerializer
    

    def get_queryset(self):
        user = self.request.user
        projects = Project.objects.filter(project_users=user)
        tasks = Task.objects.filter(project_id__in=projects)
        return tasks.order_by('task_end_date')


class TaskUserUpdate(generics.RetrieveUpdateAPIView):
    serializer_class = UserUpdateTasksSerializer
    permission_classes = [IsTaskUser]
    queryset = Task.objects.all()
    def get_object(self):
        user = self.request.user
        task_id = self.kwargs.get(self.lookup_field)
        task = Task.objects.filter(
            pk=task_id, project_id__project_users=user).first()
        return task
class TaskSortView(generics.ListAPIView):
     serializer_class = TaskSerializer
     
     
     def get_queryset(self):
            start_date = self.request.query_params.get('start_date')
            end_date = self.request.query_params.get('end_date')
            user = self.request.user
            if start_date and end_date:
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
                queryset = Task.objects.filter(task_end_date__range=(start_date, end_date),project_id__project_users=user)
            else:
                queryset = Task.objects.all()

            return queryset
class UserProjectsListView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Project.objects.filter(project_users=user)
        return queryset