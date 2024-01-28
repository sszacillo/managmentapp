from django.urls import path
from .views import NotificationListView, ChangeNotificationStatusView

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/change-status/', ChangeNotificationStatusView.as_view(), name='change-notification-status'),    
    # Add other URLs as needed
]
