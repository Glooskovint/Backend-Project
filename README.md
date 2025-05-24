# Comandos Docker para el Proyecto

A continuación se describen los comandos más utilizados con Docker y Docker Compose en este proyecto:

## Comandos principales

- **`docker-compose build`**  
    Construye las imágenes definidas en el archivo `docker-compose.yml`.

- **`docker-compose up`**  
    Inicia los contenedores definidos en el archivo `docker-compose.yml`. Si las imágenes no existen, las construye automáticamente.

- **`docker-compose up -d`**  
    Inicia los contenedores en segundo plano (modo "detached").

- **`docker-compose down`**  
    Detiene y elimina los contenedores, redes y volúmenes creados por `up`.

- **`docker-compose stop`**  
    Detiene los contenedores sin eliminarlos.

- **`docker-compose start`**  
    Inicia los contenedores que han sido detenidos.

- **`docker-compose restart`**  
    Reinicia los contenedores.

- **`docker-compose logs`**  
    Muestra los logs de los contenedores.

- **`docker-compose ps`**  
    Lista los contenedores en ejecución.

## Ejemplo de uso

```bash
docker-compose build
docker-compose up -d
docker-compose logs -f
docker-compose down
```

Consulta la [documentación oficial de Docker Compose](https://docs.docker.com/compose/reference/) para más comandos y detalles.