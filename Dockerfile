FROM node:18.16.0 as base  
WORKDIR /app 
COPY package.json .
COPY . .
# EXPOSE 3006

FROM python:3.11 as python-base
WORKDIR /app
COPY Flask/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# Adjust the CMD or ENTRYPOINT based on your preference
# ENTRYPOINT ["sh", "/entrypoint.sh"]
CMD ["python3.11", "Flask/app.py"]

FROM base as development 
RUN npm install
# CMD [ "npm", "run", "start-dev" ]

FROM base as production      
RUN npm install --only=production
# CMD [ "npm", "start" ]
