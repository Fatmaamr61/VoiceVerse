from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import VideoDubbing, AudioToAudioDubbing
from .serializers import AudioDubbingSerializer, AudioToAudioDubbingSerializer


# Create your views here.


class VideoDubbingViewSet(viewsets.ModelViewSet):
    queryset = VideoDubbing.objects.all()
    serializer_class = AudioDubbingSerializer
    permission_classes = [AllowAny]

class AudioToAudioDubbingViewSet(viewsets.ModelViewSet):
    queryset = AudioToAudioDubbing.objects.all()
    serializer_class = AudioToAudioDubbingSerializer
    permission_classes = [AllowAny]


