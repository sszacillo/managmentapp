from django.db import models
from accounts.models import User
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

task_status = (
    ('Do zrobienia', 'do zrobienia'),
    ('W trakcie', 'w trakcie'),
    ('Wykonane', 'wykonane')
)

class Project(models.Model):
    id = models.AutoField(primary_key=True)
    project_name = models.CharField(max_length=200)
    project_description = models.TextField()
    project_start_date = models.DateField()
    project_end_date = models.DateField()
    project_users = models.ManyToManyField(User, related_name='project_users')

    def __str__(self):
        return self.project_name

class Task(models.Model):
    id = models.AutoField(primary_key=True)
    task_name = models.CharField(max_length=200)
    task_description = models.TextField()
    task_status = models.CharField(choices=task_status, max_length=200, default="Do zrobienia")
    task_start_date = models.DateField()
    task_end_date = models.DateField()
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE,related_name="project_task")

    def __str__(self):
        return self.task_name

@receiver(post_save, sender=Project)
def create_default_task(sender, instance, created, **kwargs):
    if created:
        Task.objects.create(
            task_name=f"Default Task for {instance.project_name}",
            task_description="This is the default task for the project.",
            task_status="Do zrobienia",
            task_start_date=instance.project_start_date,
            task_end_date=instance.project_end_date,
            project_id=instance
        )

# Connect the signal handler to the Project model
post_save.connect(create_default_task, sender=Project)


