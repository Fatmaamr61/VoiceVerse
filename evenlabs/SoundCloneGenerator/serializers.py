from rest_framework import serializers
from .models import AudioDubbing
from .tasks import get_audio_dubbing


class AudioDubbingSerializer(serializers.ModelSerializer):
    # video_file = serializers.FileField(write_only=True)

    class Meta:
        model = AudioDubbing
        fields = '__all__'

    def create(self, validated_data):
        obj = AudioDubbing.objects.create(**validated_data)
        result = get_audio_dubbing(obj)
        print(result)

        return result

# class AvatarGeneratorSerializer(serializers.ModelSerializer):
#     image_file = serializers.ImageField(write_only=True)
#     audio_file = serializers.FileField(write_only=True)
#
#     class Meta:
#         model = AvatarGenerator
#         fields = '__all__'
#
#     def validate(self, attrs):
#         print(attrs)
#         return attrs
#
#     def create(self, validated_data):
#         audio_file = validated_data.pop('audio_file')
#         image_file = validated_data.pop('image_file')
#
#         # save the image and audio files in local storage
#
#         # validated_data['image'] = image_file
#         # validated_data['audio'] = audio_file
#
#         # Set up a file system storage location
#         audio_fs = FileSystemStorage(location='media/audio')
#         images_fs = FileSystemStorage(location='media/images')
#
#         # Save the image file
#         image_filename = images_fs.save(image_file.name, image_file)
#         # image_url = images_fs.url(image_filename)
#
#         image_local_url = images_fs.location + '/' + image_filename
#
#         # Save the audio file
#         audio_filename = audio_fs.save(audio_file.name, audio_file)
#         # audio_url = audio_fs.url(audio_filename)
#
#         audio_local_url = audio_fs.location + '/' + audio_filename
#
#         validated_data['image'] = image_local_url
#         validated_data['audio'] = audio_local_url
#
#         return AvatarGenerator.objects.create(**validated_data)
