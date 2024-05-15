from rest_framework.routers import DefaultRouter
from .views import AudioDubbingViewSet

router = DefaultRouter()
router.register(r"audio-dubbing", AudioDubbingViewSet, basename='audio-dubbing')

urlpatterns = router.urls