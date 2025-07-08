#!/bin/sh

# Variables de entorno (inyectadas por Docker Compose)
# POSTGRES_USER
# POSTGRES_PASSWORD
# POSTGRES_DB
# POSTGRES_HOST

BACKUP_DIR="/backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
FILE_NAME="backup-${POSTGRES_DB}-${DATE}.sql.gz"
BACKUP_FILE="${BACKUP_DIR}/${FILE_NAME}"
MAX_BACKUPS=4 # Número máximo de backups a mantener

# Crear el directorio de backups si no existe
mkdir -p ${BACKUP_DIR}

echo "Iniciando backup de la base de datos ${POSTGRES_DB} en ${POSTGRES_HOST}..."

# Exportar la contraseña para pg_dump
export PGPASSWORD=${POSTGRES_PASSWORD}

# Crear el backup
pg_dump -h ${POSTGRES_HOST} -U ${POSTGRES_USER} -d ${POSTGRES_DB} | gzip > ${BACKUP_FILE}

if [ $? -eq 0 ]; then
  echo "Backup completado exitosamente: ${BACKUP_FILE}"
else
  echo "Error al crear el backup."
  exit 1
fi

# Eliminar backups antiguos
echo "Eliminando backups antiguos (manteniendo los últimos ${MAX_BACKUPS})..."
ls -dt ${BACKUP_DIR}/backup-${POSTGRES_DB}-* | tail -n +$((${MAX_BACKUPS} + 1)) | xargs -r rm
echo "Limpieza de backups antiguos completada."

# Limpiar la variable de contraseña
unset PGPASSWORD

echo "Proceso de backup finalizado."
exit 0
