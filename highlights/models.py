from django.db import models
from videos.models import Video


class Highlight(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    start_time = models.IntegerField()
    end_time = models.IntegerField()
    description = models.TextField()

    def __str__(self):
        return f"{self.video.title} ({self.start_time}-{self.end_time})"