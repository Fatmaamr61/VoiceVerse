from django.db import models


# Create your models here.


# class SoundClone(models.Model):
#     title = models.CharField(max_length=100)
#     description = models.TextField()
#     audio = models.FileField(upload_to='audio/')
#     textToSpeech = models.CharField(max_length=100)
#     created_at = models.DateTimeField(auto_now_add=True)
#
#     def __str__(self):
#         return self.title
#

class VideoDubbing(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    translated_text = models.TextField(null=True, blank=True)
    audio = models.FileField(upload_to='audio/', null=True, blank=True)
    original_video = models.URLField()
    video = models.FileField(upload_to='video/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class AudioToAudioDubbing(models.Model):
    title = models.CharField(max_length=100)
    original_audio = models.CharField(max_length=100, null=True, blank=True)
    dubbed_audio = models.FileField(upload_to='audio/', null=True, blank=True)
    textToSpeech = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
