from flask import Flask, jsonify, request
from Translator.data_extractor import AudioProcessor
from Translator.downloader import Downloader

app = Flask(__name__)


@app.route('/translate', methods=['POST'])
def translate_audio():
    # Check if the request has the 'audio_url' key in the JSON data
    if 'audio_url' not in request.json:
        return jsonify({'error': 'Missing audio_url parameter'}), 400

    audio_url = request.json['audio_url']

    # Download audio from the provided URL
    downloader_instance = Downloader()
    downloader_instance.set_video_url(audio_url, "./")
    audio_file_path = downloader_instance.download_audio()

    # Translate the audio
    translator_instance = AudioProcessor()
    try :
        translated_text = translator_instance.run(audio_file_path)
        return jsonify({'translated_text': translated_text})
    except Exception as e:
        print(e)
        return jsonify({'error': "the video must be less than 1 min, please try again"}), 400


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=6000)