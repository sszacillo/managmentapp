from django.db import models
from django.utils import timezone
from projects.models import Project
from accounts.models import User

class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    comment_text = models.TextField(max_length=50)
    comment_add_date = models.DateTimeField(default=timezone.now)  # Ustaw domyślną wartość na obecny czas i datę
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.comment_text