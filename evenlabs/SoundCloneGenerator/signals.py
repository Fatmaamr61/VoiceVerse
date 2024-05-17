from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from .models import VideoDubbing
from .tasks import get_video_dubbing

# @receiver(post_save, sender=VideoDubbing)
# def audio_dubbing_post_save(sender, instance, created, **kwargs):
#     print("Audio Dubbing Post Save Signal")
#     print(instance)
#     # result = get_audio_dubbing.delay(instance.id)
#     result = get_audio_dubbing(instance.id)
#     print(result)
