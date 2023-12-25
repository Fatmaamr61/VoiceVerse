from pytube import YouTube
from moviepy.editor import VideoFileClip
import ssl
import os

ssl._create_default_https_context = ssl._create_unverified_context


class Downloader:
    def __init__(self):
        self.video_url = None
        self.output_path = None

    def set_video_url(self, video_url, output_path):
        self.video_url = video_url
        self.output_path = output_path

    def download_audio(self):
        if self.video_url is None:
            raise Exception("Video URL not set")
        try:
            # Create a YouTube object
           
            yt = YouTube(self.video_url)
            print("#############")
            # Get the audio stream with the highest quality
            # audio_stream = yt.streams.filter(only_audio=True, file_extension='mp4').first()
            print(yt)
            video_stream = yt.streams.filter(progressive=True, file_extension='mp4').first()
            print("xxxxxxxxx")
            # Download the audio stream
            print(f'Downloading: {yt.title}')
            video_file_path = os.path.join(os.getcwd(), video_stream.default_filename)
            if not os.path.exists(video_file_path):
                video_stream.download(self.output_path)
                print('Download complete!')
            else:
                print('File already exists!')

            # video_file_path = os.path.join(os.getcwd(), video_stream.default_filename)

            print(video_file_path)

            audio_file = self.convert_to_wav(video_file_path)

            return audio_file

        except Exception as e:
            print(e)
           # raise f'An error occurred: {e}'

    def convert_to_wav(self, input_video):
        # check if exists
        if not os.path.exists(input_video):
            raise Exception("File does not exist")

        filename = input_video.split(".")[0]
        input_video = input_video
        output_audio = f"{filename}.wav"

        # Load the video clip
        video_clip = VideoFileClip(input_video)

        # Extract audio from the video clip
        audio_clip = video_clip.audio

        # Write the audio clip to a WAV file
        audio_clip.write_audiofile(output_audio)

        # Close the video and audio clips
        video_clip.close()
        audio_clip.close()

        return output_audio

    def download_video(self):
        if self.video_url is None:
            raise Exception("Video URL not set")
        try:
            # Create a YouTube object
            yt = YouTube(self.video_url)

            # Get the audio stream with the highest quality
            # audio_stream = yt.streams.filter(only_audio=True, file_extension='mp4').first()
            video_stream = yt.streams.filter(progressive=True, file_extension='mp4').first()

            # Download the audio stream
            print(f'Downloading: {yt.title}')
            video_stream.download(self.output_path)
            print('Download complete!')

            video_file_path = os.path.join(self.output_path, video_stream.default_filename)

            return video_file_path

        except Exception as e:
            raise f'An error occurred: {e}'