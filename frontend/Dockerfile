# Stage 1: Build the React application
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Lightweight image with build output
FROM alpine:latest
WORKDIR /usr/share/nginx/html
COPY --from=build-stage /app/dist .