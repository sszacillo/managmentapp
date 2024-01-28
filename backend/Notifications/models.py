from django.db import models
from accounts.models import User
from projects.models import Project,Task
from meetings.models import Meeting
from comments.models import Comment
from django.dispatch import receiver
from datetime import datetime, timedelta
from django.db.models.signals import post_save,post_delete
# Create your models here.
from django.db import transaction
class Notification(models.Model):
    
    
    STATUS=(
        ('seen','seen'),
        ('unseen','unseen')
    )
    
    id=models.AutoField(primary_key=True)
    notification_type = models.CharField(max_length=100)
    notification_date = models.DateTimeField()
    notification_status = models.CharField(max_length=10,choices=STATUS,default='unseen')
    users = models.ManyToManyField(User)
    
    def __str__(self):
        return self.notification_type
    
    def update_status(self, status):
        self.notification_status = status
        self.save()

@receiver(post_save, sender=Meeting)
def create_notification(sender, instance, created, **kwargs):
    if created:
        for user in instance.project_id.project_users.all():
            notification = Notification.objects.create(
                notification_type=f'New Meeting Added to Project {instance.project_id.project_name} in day {instance.meeting_date}',
                notification_date=datetime.now(),
                notification_status='unseen',
            )
            notification.users.add(user)           
post_save.connect(create_notification, sender=Meeting)

@receiver(post_save, sender=Task)
def create_task_notification(sender, instance, created, **kwargs):
    if created:
        for user in instance.project_id.project_users.all():
            # Ustaw przypomnienie na dzień przed zakończeniem zadania
            reminder_date = instance.task_end_date - timedelta(days=1)

            notification = Notification.objects.create(
                notification_type=f'New Task Added to Project {instance.project_id.project_name}',
                notification_date=datetime.now(),
                notification_status='unseen',
            )
            notification.users.add(user)
            notification=0
            notification = Notification.objects.create(
                notification_type=f'Jutro upływa termin wykoniania zadania {instance.task_name} w projekcie {instance.project_id.project_name}',
                notification_date=reminder_date,
                notification_status='unseen',
            )
            notification.users.add(user)
@receiver(post_delete, sender=Task)
def delete_task_notifications(sender, instance, **kwargs):
    # Delete notifications associated with the deleted task
    Notification.objects.filter(notification_type__contains=f'Jutro upływa termin wykoniania zadania {instance.task_name} w projekcie {instance.project_id.project_name}').delete()
@receiver(post_save, sender=Comment)
def create_comment_notification(sender, instance, created, **kwargs):
    
    if created:
        for user in instance.project_id.project_users.all():
            with transaction.atomic():
                if user==instance.user_id:
                    continue

                notification = Notification.objects.create(
                    notification_type=f'Nowy komentarz dodadny przez {instance.user_id.username} w projekcie {instance.project_id.project_name}',
                    notification_date=datetime.now(),
                    notification_status='unseen',
                )
                notification.save()
                notification.users.add(user)