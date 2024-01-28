from .models import Notification

def notifications(request):
    user = request.user
    notifications = []
    if user.is_authenticated:
        notifications = Notification.objects.filter(users=user, notification_status='unseen').order_by('-notification_date')[:10]
    
    return {'notifications': notifications}