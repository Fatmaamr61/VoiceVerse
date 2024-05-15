# Use Python 3.11 as the base image
FROM python:3.11 as base

ENV PYTHONUNBUFFERED 1

# Set the working directory inside the container
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    libsndfile1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y portaudio19-dev ffmpeg flac

# Copy the requirements.txt file from the host to the container
COPY requirements.txt ./

# Install Python packages from requirements.txt
RUN pip install -r requirements.txt

# Copy the entire project directory into the container
COPY . .



FROM base as production


RUN rm /usr/src/app/Core/local_settings.py; exit 0

RUN python manage.py collectstatic --noinput --clear

#COPY ./entrypoint.sh /
#
#RUN sed -i 's/\r$//g' /usr/src/app/entrypoint.sh
#RUN chmod +x /usr/src/app/entrypoint.sh
#
#ENTRYPOINT ["sh", "/entrypoint.sh"]

FROM base as development

#COPY ../evenlabs/requirements-dev.txt ./
RUN python manage.py collectstatic --noinput --clear


RUN pip install -r requirements-dev.txt