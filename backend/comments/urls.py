from django.urls import path
from .views import CommentListCreateView

urlpatterns = [
    path('<int:project_id>/comments/', CommentListCreateView.as_view(), name='comment-list'),
    
]