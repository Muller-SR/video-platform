from django.urls import path
from .views import highlight_list

urlpatterns = [
    path('highlights/', highlight_list),
]