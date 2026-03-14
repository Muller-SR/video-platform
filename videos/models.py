from django.db import models
from django.contrib.auth.models import User

# Create your models here.s
class Video(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    video_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class VideoAccess(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    expires_at = models.DateTimeField()
    
    def __str__(self):
        return f"{self.user.username} - {self.video.title}"
        