from rest_framework import serializers
from .models import Project, Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('__all__')



class ProjectWithTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('__all__')
    project_task = TaskSerializer(many=True)


class UserUpdateTasksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['task_status']
        
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('__all__')
        
class Projectwithtaskserializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('__all__')
    project_task = TaskSerializer(many=True)