import logging.config
import os

from dotenv import load_dotenv
load_dotenv()

LOGLEVEL = os.getenv('DJANGO_LOGLEVEL', 'info').upper()


logging.config.dictConfig({
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'console': {
            'format': '%(asctime)s %(levelname)s [%(name)s:%(lineno)s] %(module)s %(process)d %(thread)d %(message)s',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'console',
        },
    },
    'loggers': {
        '': {
            'level': LOGLEVEL,
            # 'level': 'DEBUG',
            'handlers': ['console', ],
        },
    },
})
