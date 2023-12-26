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
        print("Running audio processor...")
        original_text, original_lang = self.extract_text_from_audio(audio_file_path)
        translated_text = self.translate_text(original_text, original_lang, "ar")
        return translated_text

    def extract_text_from_audio(self, audio_file_path):
        print("Extracting text from audio...")
        recognizer = self.recognizer

        print("Loading audio file...")
        with sr.AudioFile(audio_file_path) as source:
            # Record the audio
            print("Recording audio...")
            recognizer.adjust_for_ambient_noise(source)
            print("Converting audio to text...")
            audio = recognizer.record(source)
            print("Recognizing the text...")
            max_retries = 3
            for _ in range(max_retries):
                try:
                    # Use Google Web Speech API to recognize the speech
                    # text = recognizer.recognize_google(audio, language="fr-FR")
                    transcript = recognizer.recognize_google(audio)

                    detected_language = detect(transcript)

                    print("Text extracted from audio: \n", transcript)
                    print(detected_language)
                    return transcript, detected_language

                except sr.UnknownValueError:
                    print("Google Web Speech API could not understand audio")
                except sr.RequestError as e:
                    print(f"Could not request results from Google Web Speech API; {e}")
                except Exception as e:
                    print(e)
            raise Exception("Max retries reached. Unable to obtain transcription.")

    def translate_text(self, text, source_language, target_language):
        translator = self.translator

        try:
            translation = translator.translate(text, src=source_language, dest=target_language)
            print("Translation: \n", translation.text)
            return translation.text

        except Exception as e:
            raise e
