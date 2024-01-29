from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer
from datetime import datetime

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        current_date = datetime.now()
        return Notification.objects.filter(users=user,notification_date__lte=current_date).order_by('-notification_date')[:10]

class ChangeNotificationStatusView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Notification.objects.filter(users=user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_status = request.data.get('new_status', None)

        if new_status not in ['seen', 'unseen']:
            return Response({'detail': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        instance.update_status(new_status)

        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    