# from googletrans import Translator
from elevenlabs.client import ElevenLabs
from elevenlabs import play, save
import moviepy.editor as mp
import speech_recognition as sr
from langdetect import detect
from translate import Translator
import json
import os
from dotenv import load_dotenv

load_dotenv()

from pydub import AudioSegment, silence


# from pydub


class AudioProcessor:
    def __init__(self):
        # self.translator = Translator(from_lang='english', to_lang='arabic')
        self.translator = Translator(to_lang='ar')
        self.recognizer = sr.Recognizer()

    def get_audio_from_video(self):
        pass

    # def split_audio_on_silence(self, audio_path, min_silence_len=1000, silence_thresh=-40):
    #     audio = AudioSegment.from_file(audio_path)
    #     return silence.split_on_silence(audio, min_silence_len=min_silence_len, silence_thresh=silence_thresh)

    def run(self, audio_file_path, src='english', dest='arabic'):

        # splited_audio = self.split_audio_on_silence(audio_file_path)
        # print("Splited audio:", splited_audio)

        original_text, original_lang = self.extract_text_from_audio(audio_file_path)
        # print("Original text:", input_text)
        edited_text = input_text[:500] if len(original_text) > 500 else original_text
        translated_text = self.translator.translate(str(original_text))
        print("Translated text:", translated_text)
        return translated_text
        # return translated_text.text

    def extract_text_from_audio(self, audio_file_path, inactivity_timeout=360):
        recognizer = self.recognizer

        with sr.AudioFile(audio_file_path) as source:
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.record(source, duration=None)  # Record the entire audio file

            try:
                # Use Google Web Speech API to recognize the speech
                transcript = recognizer.recognize_google(audio)
                # transcript = recognizer.recognize_amazon(audio, bucket_name='voice-verse-bucket',
                #                                          access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                #                                          secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                #                                          region="us-east-1")
                # transcript = recognizer.recognize_vosk(audio)
                # transcript = transcript.get("text")

                try:
                    transcript = json.loads(transcript)
                    transcript = transcript.get("text")
                except Exception as e:
                    print("Error occurred:", e)

                print("Transcript:", transcript)

                detected_language = detect(transcript)

                print("Text extracted from audio:\n", transcript)
                print("Detected language:", detected_language)

                return transcript, detected_language

            except Exception as e:
                print("Error occurred:", e)
                raise e

    # def translate_text(self, text, source_language="english", target_language="arabic"):
    #     translator = self.translator
    #
    #     try:
    #         translation = translator.translate(text, src=source_language, dest=target_language)
    #         print("Translation: \n", translation.text)
    #         return translation.text
    #
    #     except Exception as e:
    #         raise e


class AudioGenerator:
    def __init__(self, audio_file_path):
        self.client = ElevenLabs(api_key='5b6639467f3890f041e9310ab40f9800')
        self.audio_file_path = audio_file_path
        self.translated_text = None

    def generate_audio(self, name, translated_text, description="Human voice."):
        # Upload the enhanced audio file
        voice = self.client.clone(
            description=description,
            name=name,
            files=[self.audio_file_path]
        )

        # Generate audio
        audio = self.client.generate(
            text=translated_text,
            voice=voice,
            model="eleven_multilingual_v2"
        )

        generated_audio_path = os.path.join(os.getcwd(), "media", "audio", "generated_audios", f"{name}.wav")

        # export the audio
        save(audio, generated_audio_path)
        print("Audio generated")
        return audio, generated_audio_path
