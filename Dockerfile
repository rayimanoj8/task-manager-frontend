# Use Node.js as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend files
COPY . .

# Build the frontend
RUN npm run build

# Use a lightweight web server for deployment
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
# The first part of the Dockerfile is similar to the backend Dockerfile. It uses Node.js as the base image, sets the working directory, and copies the package.json and package-lock.json files. It then installs the dependencies and copies the rest of the frontend files.