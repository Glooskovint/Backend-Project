# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install
RUN npm run build

# Serve stage
FROM node:18-alpine

RUN npm install -g serve

WORKDIR /app

COPY --from=build /app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist"]
