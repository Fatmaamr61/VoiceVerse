# Base Stage for Python
FROM python:3.11 as python-base
WORKDIR /app

RUN apt-get update && apt-get install -y portaudio19-dev ffmpeg flac


COPY ../Flask/requirements.txt .

RUN pip install -r requirements.txt
COPY . .

## Run the container with elevated privileges (for testing purposes)
#USER root

# Development Stage (if needed)
# FROM python-base as python-development
# RUN additional commands for development if needed

# Production Stage
FROM python-base as python-production
# No additional installation needed for production
