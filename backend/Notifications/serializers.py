from rest_framework import serializers
from .models import Notification

from rest_framework import serializers

class NotificationSerializer(serializers.ModelSerializer):
    notification_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    class Meta:
        model = Notification
        fields = ('id','notification_type','notification_date','notification_status',)
