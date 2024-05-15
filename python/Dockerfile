# Use Python 3.11 as the base image
FROM python:3.11 as base

ENV PYTHONUNBUFFERED 1

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements.txt file from the host to the container
COPY ../evenlabs/requirements.txt ./

# Install Python packages from requirements.txt
RUN pip install -r requirements.txt

# Copy the entire project directory into the container
COPY . .

FROM base as production


RUN rm /app/Core/local_settings.py; exit 0

RUN python manage.py collectstatic --noinput --clear


FROM base as development
COPY ../evenlabs/requirements-dev.txt ./

RUN pip install -r requirements-dev.txt