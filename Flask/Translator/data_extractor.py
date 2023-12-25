import speech_recognition as sr
from googletrans import Translator
from langdetect import detect


class AudioProcessor:
    def __init__(self):
        self.translator = Translator()
        self.recognizer = sr.Recognizer()
        # self.microphone = sr.Microphone()

    def get_audio_from_video(self):
        pass

    def run(self, audio_file_path):
        original_text, original_lang = self.extract_text_from_audio(audio_file_path)
        translated_text = self.translate_text(original_text, original_lang, "ar")
        return translated_text

    def extract_text_from_audio(self, audio_file_path):
        recognizer = self.recognizer

        with sr.AudioFile(audio_file_path) as source:
            # Record the audio
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.record(source)

            try:
                # Use Google Web Speech API to recognize the speech
                # text = recognizer.recognize_google(audio, language="fr-FR")
                transcript = recognizer.recognize_google(audio)

                detected_language = detect(transcript)

                print("Text extracted from audio: \n", transcript)
                print(detected_language)
                return transcript, detected_language

            except sr.UnknownValueError:
                raise "Google Web Speech API could not understand audio"
            except sr.RequestError as e:
                raise f"Could not request results from Google Web Speech API; {e}"
            except Exception as e:
                raise e

    def translate_text(self, text, source_language, target_language):
        translator = self.translator

        try:
            translation = translator.translate(text, src=source_language, dest=target_language)
            print("Translation: \n", translation.text)
            return translation.text

        except Exception as e:
            raise e