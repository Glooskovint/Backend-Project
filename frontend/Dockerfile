# Use a Node.js Alpine image as a base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm install

# Install 'serve' to serve static files
RUN npm install -g serve

# Copy the rest of the application code
COPY . .

# Build the React application for production
RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

# Command to serve the static files
CMD ["serve", "-s", "dist", "-l", "5173"]
