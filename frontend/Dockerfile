# Dockerfile for React
FROM node:14

# Set work directory
WORKDIR /app

# Install dependencies
COPY package*.json /app/
RUN npm install

# Copy project
COPY . /app/

# Build the app
RUN npm run build

# Serve the app
CMD ["npx", "serve", "build"]
