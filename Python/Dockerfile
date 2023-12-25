# Base Stage for Python
FROM python:3.8 as python-base
WORKDIR /app

RUN apt-get update && apt-get install -y portaudio19-dev


COPY ../Flask/requirements.txt .

#COPY ./entrypoint.sh .
#RUN sed -i 's/\r$//g' /app/entrypoint.sh
#RUN chmod +x /app/entrypoint.sh

#RUN ./entrypoint.sh
#RUN apt-get install -y portaudio19-dev

#ENTRYPOINT ["sh", "/app/entrypoint.sh"]


#RUN pip install --no-cache-dir -r requirements.txt
RUN pip install -r requirements.txt
COPY . .

# Development Stage (if needed)
# FROM python-base as python-development
# RUN additional commands for development if needed

# Production Stage
FROM python-base as python-production
# No additional installation needed for production
