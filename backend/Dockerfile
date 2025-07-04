FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

# Instalar netcat para docker-compose
RUN apt-get update && \
    apt-get install -y --no-install-recommends netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*

COPY . .

RUN npm install

# Opcional
EXPOSE 5000

CMD ["node", "src/server.js"]
