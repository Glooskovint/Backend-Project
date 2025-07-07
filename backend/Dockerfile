# Etapa de construcción
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
# Usar --omit=dev para instalar solo dependencias de producción
# Usar --ignore-scripts para prisma, ya que los comandos de prisma se ejecutarán en el docker-compose o al iniciar el contenedor.
RUN npm install --omit=dev --ignore-scripts
COPY . .
# Si tuvieras un paso de transpilación (TypeScript a JS, etc.), iría aquí
# RUN npm run build

# Etapa final
FROM node:18-alpine
WORKDIR /app

# Instalar solo las dependencias de producción y herramientas necesarias
# netcat-openbsd y curl son útiles para healthchecks y debugging.
# bash es útil para scripts más complejos en CMD o ENTRYPOINT.
RUN apk add --no-cache netcat-openbsd curl bash

# Copiar artefactos de la etapa de builder:
# Copiamos package.json para que herramientas como Prisma CLI puedan encontrarlo.
COPY --from=builder /app/package.json /app/package-lock.json ./
# Copiamos node_modules ya instalados.
COPY --from=builder /app/node_modules ./node_modules/
# Copiamos el código fuente de la aplicación.
COPY --from=builder /app/src ./src/
# Copiamos el esquema y migraciones de Prisma.
COPY --from=builder /app/prisma ./prisma/

# Exponer el puerto que la aplicación usa internamente
EXPOSE 5000

# Crear un usuario no root para mayor seguridad (opcional pero recomendado)
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# USER appuser

# El comando para correr la aplicación se especifica en docker-compose.yml,
# que incluye la generación de Prisma y las migraciones.
# Este CMD es un fallback si la imagen se corre directamente.
CMD ["sh", "-c", "npx prisma generate && node src/server.js"]
