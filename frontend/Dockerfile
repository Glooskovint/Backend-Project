# Etapa de build
FROM node:18-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Asegúrate de que las variables de entorno necesarias para el build estén disponibles.
# Por ejemplo, VITE_API_BASE_URL debe configurarse aquí si es necesario en tiempo de build.
# ARG VITE_API_BASE_URL
# ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
# Limpiar el contenido por defecto de Nginx
RUN rm -rf ./*
# Copiar los archivos estáticos del build anterior
COPY --from=build-stage /app/dist .
# Copiar la configuración de Nginx personalizada si es necesario (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
