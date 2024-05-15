from django.apps import AppConfig


class SoundclonerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'SoundCloneGenerator'

    def ready(self):
        import SoundCloneGenerator.signals

