from django.urls import path
from .views import ProjectCreateView, ProjectDetail, TaskList, TaskDetail, ProjectWithTasksDetailView, TaskStatusView, TaskDataView, TaskUserUpdate,TaskSortView,UserProjectsListView

urlpatterns = [
    path('create/', ProjectCreateView.as_view()),
    path('<int:pk>/', ProjectDetail.as_view()),
    path('<int:pk>/taskadd', TaskList.as_view()),
    path('task/<int:pk>/', TaskDetail.as_view()),
    path('projectdetail/<int:pk>/', ProjectWithTasksDetailView.as_view()),
    path('task/taskstatus/', TaskStatusView.as_view()),
    path('task/taskdate/', TaskDataView.as_view()),
    path('task/<int:pk>/taskupdate/', TaskUserUpdate.as_view()),
    path('task/tasksort/',TaskSortView.as_view()),
    path('projectlist/',UserProjectsListView.as_view())
]
