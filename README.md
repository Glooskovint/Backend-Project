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

## Sistema de Backups Semanales

Este proyecto incluye un sistema de backups automáticos semanales para la base de datos PostgreSQL.

### Funcionamiento

- Se utiliza un servicio Docker dedicado llamado `backup` que corre una tarea `cron`.
- La tarea `cron` está programada para ejecutarse todos los domingos a las 02:00 AM (configurado en `Dockerfile.backup`).
- El script `backup.sh` (ubicado en la raíz del proyecto y copiado a `/usr/local/bin/backup.sh` en el contenedor `backup`) realiza un `pg_dump` de la base de datos. Las credenciales y nombre de la base de datos se toman de las variables de entorno inyectadas al servicio `backup` desde el archivo `.env` (a través de `docker-compose.yml`).
- Los backups se guardan como archivos `.sql.gz` comprimidos (SQL plano comprimido con gzip) en el volumen Docker `backup-data`. Dentro del contenedor `backup`, esta ruta es `/backups/`.
- El nombre del archivo de backup incluye el nombre de la base de datos y la fecha/hora de creación, por ejemplo: `backup-mydatabase-2023-10-27_10-30-00.sql.gz`.
- Para evitar el consumo excesivo de espacio, el script `backup.sh` automáticamente rota los backups, manteniendo solo los últimos 4 archivos.

### Ubicación de los Backups

Los archivos de backup se almacenan en el volumen Docker `backup-data`. Puedes inspeccionar este volumen para acceder a los archivos si es necesario (e.g., usando `docker volume inspect <nombre_del_volumen_backup-data>`). Dentro del contenedor `backup`, se encuentran en la ruta `/backups/`.

### Forzar un Backup Manualmente

Si necesitas realizar un backup manualmente fuera del horario programado, puedes ejecutar el siguiente comando desde la raíz del proyecto:

```bash
docker-compose exec backup /usr/local/bin/backup.sh
```

Esto ejecutará el script de backup inmediatamente. Los logs de la ejecución del script (tanto manual como por cron) se pueden ver en `/var/log/cron.log` dentro del contenedor `backup`, o usando `docker-compose logs backup`.

### Restaurar un Backup

Para restaurar la base de datos desde un archivo de backup:

1.  **Identifica el archivo de backup** que deseas utilizar. Necesitarás copiarlo desde el volumen `backup-data` a tu máquina local o directamente al contenedor `db`.
    *   Una forma de copiar desde el volumen es iniciar un contenedor temporal que monte el volumen:
        ```bash
        docker run --rm -v <nombre_del_volumen_backup-data>:/backup_volume -w /backup_volume ubuntu tar cvf - . | tar xvf - -C /ruta/local/para/backups
        ```
        (Reemplaza `<nombre_del_volumen_backup-data>` por el nombre completo del volumen, ej. `nombreproyecto_backup-data`). Es importante notar que el nombre exacto del volumen puede variar dependiendo de cómo se inició docker-compose (ej. `nombreproyecto_backup-data` si el proyecto está en una carpeta llamada `nombreproyecto`). Puedes listar los volúmenes con `docker volume ls`.
    *   Luego, copia el archivo específico al contenedor `db`:
        ```bash
        docker cp /ruta/local/para/backups/nombre_del_backup.sql.gz <ID_o_Nombre_Contenedor_DB>:/tmp/backup.sql.gz
        ```
        (Reemplaza `<ID_o_Nombre_Contenedor_DB>` con el ID o nombre del contenedor `db`, usualmente `nombreproyecto-db-1` o similar. Puedes obtenerlo con `docker ps`).

2.  **Detén el servicio `backend`** (opcional pero recomendado para evitar inconsistencias de datos durante la restauración):
    ```bash
    docker-compose stop backend
    ```

3.  **Ejecuta el comando de restauración**:
    Conéctate al contenedor de la base de datos (`db`) y usa `psql` para restaurar. El script `backup.sh` crea backups de SQL plano comprimidos.
    ```bash
    docker-compose exec db bash -c "gunzip < /tmp/backup.sql.gz | psql -U \${POSTGRES_USER} -d \${POSTGRES_DB}"
    ```
    Las variables `POSTGRES_USER` y `POSTGRES_DB` son leídas del entorno del contenedor `db` (que a su vez las toma del archivo `.env`).

4.  **Verifica la restauración** y reinicia el servicio `backend` si lo detuviste:
    ```bash
    docker-compose start backend
    ```

Es crucial probar el proceso de restauración periódicamente en un entorno de desarrollo o staging para asegurar que los backups son válidos y el procedimiento de restauración funciona como se espera.