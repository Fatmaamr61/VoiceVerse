# Base Stage for Node.js
FROM node:14.17.5 as base
WORKDIR /app
COPY package.json ./
COPY . .

# Development Stage
FROM base as development
#RUN npm install && npm install -g nodemon
RUN npm install

# Include additional tools or dependencies for development if needed
# Example: RUN npm install -g nodemon

# Production Stage
FROM base as production
RUN npm install --only=production
