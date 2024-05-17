from rest_framework.routers import DefaultRouter
from .views import VideoDubbingViewSet, AudioToAudioDubbingViewSet

router = DefaultRouter()
router.register(r"video-dubbing", VideoDubbingViewSet, basename='video-dubbing')
router.register(r"audio-dubbing", AudioToAudioDubbingViewSet, basename='audio-dubbing')

urlpatterns = router.urls