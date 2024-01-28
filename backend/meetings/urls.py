from django.urls import path
from .views import MeetingListView, MeetingDetailView, MeetingCreateForAdminView

urlpatterns = [
    path('<int:project_id>/meetings', MeetingListView.as_view(), name='meeting-list-create'),
    path('<int:project_id>/meetings/<int:id>/', MeetingDetailView.as_view(), name='meeting-detail'),
    path('<int:project_id>/meetings/create/', MeetingCreateForAdminView.as_view(), name='meeting-create-for-admin'),
]