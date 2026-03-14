from rest_framework import serializers
from videos.models import VideoAccess

class VideoAccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoAccess
        fields = '__all__'