# Use Node.js as the base image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all frontend source code
COPY . .

# ✅ Fix OpenSSL issue
ENV NODE_OPTIONS=--openssl-legacy-provider

# Build the frontend
RUN npm run build

# Use Nginx as the web server
FROM nginx:alpine

# ✅ Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy React build files to Nginx
COPY --from=build /app/build /usr/share/nginx/html

# ✅ Expose the correct frontend port
EXPOSE 3001

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
