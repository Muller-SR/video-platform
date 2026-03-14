from rest_framework.decorators import api_view
from rest_framework.response import Response
from videos.models import VideoAccess
from .serializers import VideoAccessSerializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def login(request):

    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({"error": "Credenciais inválidas"}, status=401)

    token, created = Token.objects.get_or_create(user=user)

    return Response({
        "token": token.key,
        "user_id": user.id
    })

@api_view(['GET', 'POST'])
def access_list(request):

    if request.method == 'GET':
        access = VideoAccess.objects.all()
        serializer = VideoAccessSerializer(access, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = VideoAccessSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors)