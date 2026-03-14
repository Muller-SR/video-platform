from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Highlight
from .serializers import HighlightSerializer


@api_view(['GET', 'POST'])
def highlight_list(request):

    if request.method == 'GET':
        highlights = Highlight.objects.all()
        serializer = HighlightSerializer(highlights, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = HighlightSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)