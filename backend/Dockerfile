FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

# Instalar netcat-openbsd antes de copiar todo
RUN apt-get update && \
    apt-get install -y --no-install-recommends netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*

# Copiar el resto de la app después
COPY . .

# Instalar dependencias una vez que todo el código está en el contenedor
RUN npm install

EXPOSE 5000

CMD ["node", "src/server.js"]
