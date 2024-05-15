#!/usr/bin/sh

#python manage.py makemigrations --noinput
#python manage.py migrate --noinput

#python manage.py collectstatic --noinput --clear
gunicorn -w 4 -b 0.0.0.0:8000 Core.wsgi:app