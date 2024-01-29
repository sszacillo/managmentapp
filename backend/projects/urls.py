from django.urls import path
from .views import ProjectCreateView,AddTaskAPIView,ProjectDetail,ProjectDeleteAPIView,TaskList, TaskDetail, ProjectWithTasksDetailView, TaskStatusView, TaskDataView, TaskUserUpdate,TaskSortView,UserProjectsListView,TaskDeleteAPIView
from django.urls import path
from .views import ChangeTaskStatusAPIView

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
    path('projectlist/',UserProjectsListView.as_view()),
    path('change-task-status/<int:task_id>/', ChangeTaskStatusAPIView.as_view(), name='change_task_status_api'),
    path('<int:project_id>/add_task/', AddTaskAPIView.as_view(), name='add_task_api'),
    path('tasks/<int:pk>/delete/', TaskDeleteAPIView.as_view(), name='task-delete'),
    path('<int:pk>/delete/', ProjectDeleteAPIView.as_view(), name='project-delete'),
]
