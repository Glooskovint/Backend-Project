# Stage 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies including Python and make for node-gyp, and git
RUN apk add --no-cache python3 make g++ git

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Stage 2: Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install netcat-openbsd for the wait script and dumb-init
RUN apk add --no-cache netcat-openbsd dumb-init

# Copy built artifacts from builder stage
COPY --from=builder /app ./

# Ensure correct ownership of application files
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port 5000 (as defined in your original Dockerfile and docker-compose)
EXPOSE 5000

# Use dumb-init to handle signals properly
CMD ["dumb-init", "node", "src/server.js"]
