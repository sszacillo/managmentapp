from .models import Notification

class NotificationsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user = request.user
        if user.is_authenticated:
            # Filtrujemy powiadomienia tylko dla zalogowanego użytkownika
            notifications = Notification.objects.filter(users=user, notification_status='unseen').order_by('-notification_date')[:10]
        else:
            notifications = []

        request.notifications = notifications
        response = self.get_response(request)
        return response