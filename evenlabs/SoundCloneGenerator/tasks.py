from celery import shared_task
from .models import AudioDubbing
import os
# from django.conf import settings

from SoundClone.SoundCloneManger.downloader import DOWNLOADER
from SoundClone.SoundCloneManger.audio_processing import AudioProcessor, AudioGenerator
from SoundClone.SoundCloneManger.video_processing import VideoProcessor, VideoEditor

translatorInstance = AudioProcessor()
downloaderInstance = DOWNLOADER()


# @shared_task
# def get_audio_dubbing(instance_id, **kwargs):
#     print(instance_id)
#     return "audio dubbing"

@shared_task
def get_audio_dubbing(instance_obj):
    print(instance_obj)

    video_url = instance_obj.original_video

    downloaderInstance.set_video_url(video_url, "./media/videos")
    audio_file = downloaderInstance.download_audio()

    translated_text = translatorInstance.run(audio_file)
    text_to_speech = AudioGenerator(audio_file)
    audio, generated_audio_path = text_to_speech.generate_audio(translated_text=translated_text,
                                                                name=instance_obj.title, description=instance_obj.description)

    audio_file_path = audio_file.split('/')[-1:]
    audio_file_path = os.path.join(*audio_file_path)

    with open(generated_audio_path, 'rb') as f:
        instance_obj.audio.save(audio_file_path, f)

    os.remove(generated_audio_path)
    instance_obj.translated_text = translated_text

    return instance_obj
