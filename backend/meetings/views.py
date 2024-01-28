from rest_framework import generics, permissions
from .models import Meeting
from .serializers import MeetingSerializer
from projects.models import Project
from rest_framework import serializers
from rest_framework.exceptions import NotFound


class IsProjectMember(permissions.BasePermission):
    def has_permission(self, request, view):
        # Retrieve project_id from URL parameters
        project_id = view.kwargs.get('project_id')
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


class MeetingListView(generics.ListAPIView):
    serializer_class = MeetingSerializer
    permission_classes = [IsProjectMember]

    def get_queryset(self):
        user = self.request.user
        project_id = self.kwargs.get('project_id')
        return Meeting.objects.filter(project_id=project_id)


class MeetingDetailView(generics.RetrieveAPIView):
    serializer_class = MeetingSerializer
    permission_classes = [IsProjectMember]
    lookup_url_kwarg = 'id'  # Set the lookup field to 'meeting_id'

    def get_object(self):
        user = self.request.user
        meeting_id = self.kwargs.get('id')
        # Fetch project_id from URL parameters
        project_id = self.kwargs.get('project_id')

        queryset = Meeting.objects.filter(project_id=project_id, id=meeting_id)

        if not user.is_staff:
            queryset = queryset.filter(project_id__project_users=user)

        try:
            return queryset.get()
        except Meeting.DoesNotExist:
            raise NotFound("Meeting not found.")


class IsProjectAdmin(permissions.BasePermission):
    def has_permission(self, request, view):

        project_id = view.kwargs.get('project_id')
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


class MeetingCreateForAdminView(generics.CreateAPIView):
    serializer_class = MeetingSerializer
    permission_classes = [IsProjectAdmin]
    queryset = Meeting.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        project_id = self.request.data.get('project_id')

        try:
            project = Project.objects.get(pk=project_id)

            # Check if the user is the project admin or a superuser
            if user.role == 'L' or user.is_superuser:
                serializer.save()
            else:
                raise serializers.ValidationError("Użytkownik nie jest administratorem tego projektu.")

        except Project.DoesNotExist:
            raise serializers.ValidationError("Podany projekt nie istnieje.")

    def create(self, request, *args, **kwargs):
        project_id = self.kwargs.get('project_id')
        request.data['project_id'] = project_id
        return super().create(request, *args, **kwargs)
