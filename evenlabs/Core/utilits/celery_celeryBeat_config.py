from datetime import timedelta

CELERY_BROKER_URL = 'redis://redis:6379'  # Use your preferred message broker, like Redis or RabbitMQ
# CELERY_RESULT_BACKEND = 'redis://redis:6379'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'

CELERY_RESULT_BACKEND = 'django-db'
CELERY_CACHE_BACKEND = 'django-cache'

CELERY_BEAT_SCHEDULE = {
    'reset_daily_counts': {
        'task': 'subscriptions.tasks.reset_daily_counts',
        'schedule': timedelta(days=1),  # Run daily
    },
}
