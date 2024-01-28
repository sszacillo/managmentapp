from django.db import models
from projects.models import Project
class Meeting(models.Model):
    id = models.AutoField(primary_key=True)
    meeting_name = models.CharField(max_length=50)
    meeting_date = models.DateTimeField()
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.meeting_name
