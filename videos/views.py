from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from django.utils import timezone
from datetime import timedelta

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required

from .models import Video, VideoAccess
from .serializers import VideoSerializer
from highlights.models import Highlight


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def video_list(request):

    if request.method == 'GET':

        query = request.GET.get('q')

        if query:
            videos = Video.objects.filter(title__icontains=query)
        else:
            videos = Video.objects.all()

        serializer = VideoSerializer(videos, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':

        serializer = VideoSerializer(data=request.data)

        if serializer.is_valid():

            video = serializer.save()

            VideoAccess.objects.create(
                user=request.user,
                video=video,
                expires_at=timezone.now() + timedelta(days=7)
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def video_detail(request, id):

    try:
        video = Video.objects.get(id=id)
    except Video.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = VideoSerializer(video)
        return Response(serializer.data)

    elif request.method == 'PUT':

        serializer = VideoSerializer(video, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':

        video.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def videos_for_user(request):

    accesses = VideoAccess.objects.filter(
        user=request.user,
        expires_at__gt=timezone.now()
    ).select_related('video')

    result = []

    for access in accesses:

        video_data = VideoSerializer(access.video).data
        video_data["expires_at"] = access.expires_at

        result.append(video_data)

    return Response(result)


@api_view(['POST'])
def register(request):

    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'username e password são obrigatórios'},
            status=400
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'username já existe'},
            status=400
        )

    user = User.objects.create_user(
        username=username,
        password=password
    )

    token = Token.objects.create(user=user)

    return Response({
        "token": token.key,
        "user_id": user.id
    })


@api_view(['POST'])
def login(request):

    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {'error': 'Credenciais inválidas'},
            status=400
        )

    token, created = Token.objects.get_or_create(user=user)

    return Response({
        "token": token.key,
        "user_id": user.id
    })


# =========================
# VIEWS WEB (INTERFACE)
# =========================

@login_required
def video_list_page(request):

    accesses = VideoAccess.objects.filter(
        user=request.user,
        expires_at__gt=timezone.now()
    ).select_related("video")

    videos = [access.video for access in accesses]

    return render(request, "videos.html", {
        "videos": videos
    })


@login_required
def video_detail_page(request, id):

    access = get_object_or_404(
        VideoAccess,
        video_id=id,
        user=request.user
    )

    video = access.video

    highlights = Highlight.objects.filter(video=video)

    # EXTRAIR ID DO VIDEO PARA EMBED (SEM ALTERAR O video_url ORIGINAL)
    video_id = ""

    if "watch?v=" in video.video_url:
        video_id = video.video_url.split("watch?v=")[1]
    elif "youtu.be/" in video.video_url:
        video_id = video.video_url.split("youtu.be/")[1]

    if "&" in video_id:
        video_id = video_id.split("&")[0]

    embed_url = f"https://www.youtube.com/embed/{video_id}"

    return render(
        request,
        "video_detail.html",
        {
            "video": video,
            "highlights": highlights,
            "expires_at": access.expires_at,
            "embed_url": embed_url
        }
    )
@login_required
def add_video_page(request):

    if request.method == "POST":

        title = request.POST.get("title")
        description = request.POST.get("description")
        video_url = request.POST.get("video_url")

        video = Video.objects.create(
            title=title,
            description=description,
            video_url=video_url
        )

        VideoAccess.objects.create(
            user=request.user,
            video=video,
            expires_at=timezone.now() + timedelta(days=7)
        )

        return redirect("/videos/")

    return render(request, "add_video.html")