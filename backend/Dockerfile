# Stage 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# ✅ Copiamos el schema.prisma antes de instalar
COPY prisma ./prisma/

# ✅ Ahora sí, instalamos dependencias (y postinstall funciona)
RUN npm install --omit=dev

# Generamos cliente de Prisma (opcional si postinstall ya lo hizo)
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Stage 2: Production stage
FROM node:18-alpine AS production

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN apk add --no-cache netcat-openbsd dumb-init

COPY --from=builder /app ./

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 5000
CMD ["dumb-init", "node", "src/server.js"]