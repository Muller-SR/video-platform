from django.urls import path
from .views import video_list, video_detail, videos_for_user, register, login


urlpatterns = [
    path('videos/', video_list),
    path('videos/<int:id>/', video_detail),
    path('videos/me/', videos_for_user),
    path('register/', register),
    path('login/', login),
]