# Use Node.js as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies with peer dependency resolution
RUN npm install --legacy-peer-deps

# Copy backend source code
COPY . .

# Expose the correct backend port
EXPOSE 3060

# Start the backend server
CMD ["npm", "start"]
