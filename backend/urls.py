from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from videos import views as video_views
from videos.views import add_video_page

urlpatterns = [
    path('admin/', admin.site.urls),

    
    path('api/', include('videos.urls')),
    path('api/', include('highlights.urls')),

    # páginas web para usuários
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),

    path('videos/', video_views.video_list_page, name='videos_page'),
    path('video/<int:id>/', video_views.video_detail_page, name='video_detail_page'),

    path('add-video/', add_video_page),
]