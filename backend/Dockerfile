FROM node:18-alpine

WORKDIR /app

# Instalar netcat-openbsd para el healthcheck de docker-compose
# Necesario para que `nc -z db 5432` funcione en el script de inicio del backend en docker-compose.yml
RUN apk add --no-cache netcat-openbsd

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
