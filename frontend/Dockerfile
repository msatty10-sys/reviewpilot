# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Pass build arguments
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build the project
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
