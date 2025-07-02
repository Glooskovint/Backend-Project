# Stage 1: Build the React application
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create a lightweight image to hold build artifacts
FROM alpine:latest
WORKDIR /app/dist
COPY --from=build-stage /app/dist .
# This image doesn't run anything, it just holds the files
# The nginx service will copy files from a volume populated by this.
# However, a better way is for the nginx service to directly use the build context
# or for this service to copy to a named volume.

# For the named volume strategy:
# The CMD is not strictly necessary if another service copies from this,
# but to keep the container running if docker-compose expects it to,
# we can add a dummy command. Or, more simply, this service can be a "builder"
# and the nginx service can copy from it.

# Let's simplify: this service will build and output to a directory.
# The docker-compose will manage copying this to a volume that nginx uses.
# So this Dockerfile's job is just to build.
# The output is in /app/dist.
# No CMD needed, as it's just for building.
