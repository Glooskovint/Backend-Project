FROM node:18

WORKDIR /app

# Instala netcat para que dockerize funcione correctamente
RUN apt-get update && apt-get install -y netcat-openbsd

# Instala dockerize
ADD https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-alpine-linux-amd64-v0.6.1.tar.gz /tmp
RUN tar -C /usr/local/bin -xzvf /tmp/dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
    && rm /tmp/dockerize-alpine-linux-amd64-v0.6.1.tar.gz

# Copiar solo package.json y prisma para instalar dependencias y generar cliente prisma
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

# Copiar el resto del código después de instalar y generar cliente
COPY . .

CMD ["dockerize", "-wait", "tcp://db:5432", "-timeout", "30s", "node", "src/server.js"]
