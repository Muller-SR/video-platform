from django.urls import path
from .views import access_list
from .views import access_list, login

urlpatterns =[
    path('access/', access_list),
]