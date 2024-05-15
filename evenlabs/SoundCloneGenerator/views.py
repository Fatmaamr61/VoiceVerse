from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import AudioDubbing
from .serializers import AudioDubbingSerializer


# Create your views here.


class AudioDubbingViewSet(viewsets.ModelViewSet):
    queryset = AudioDubbing.objects.all()
    serializer_class = AudioDubbingSerializer
    permission_classes = [AllowAny]
