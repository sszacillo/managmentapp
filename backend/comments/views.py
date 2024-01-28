from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Comment
from .serializers import CommentSerializer
from projects.models import Project
from accounts.models import User
from django.utils import timezone
class IsProjectMember(permissions.BasePermission):
    def has_permission(self, request, view):
        # Retrieve project_id from URL parameters
        project_id = view.kwargs.get('project_id')
        
        # Check if the user is a member of the project
        try:
            project = Project.objects.get(pk=project_id)
        except Project.DoesNotExist:
            return False
        
        user = request.user
        return user in project.project_users.all() or user.is_superuser

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsProjectMember]

    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        return Comment.objects.filter(project_id=project_id).order_by('-comment_add_date')

    def perform_create(self, serializer):
        project_id = self.kwargs.get('project_id')
        project = get_object_or_404(Project, pk=project_id)
        user = self.request.user
        time=timezone.now()
        serializer.save(user_id=user, project_id=project,comment_add_date=time)

    def list(self, request, *args, **kwargs):
        project_id = self.kwargs.get('project_id')
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        project_id = self.kwargs.get('project_id')
        request.data['project_id'] = project_id
        user = self.request.user
        request.data['user_id'] = project_id
        comment_add_date=timezone.now()
        request.data['comment_add_date']=comment_add_date
        return super().create(request, *args, **kwargs)