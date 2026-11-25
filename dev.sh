#!/usr/bin/env bash
set -e

# Directorio donde vive este script (funciona sin importar desde dónde lo ejecutes)
PROJECT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT"

# Directorios compartidos
mkdir -p mysql-data backend/images

# Apache (www-data) necesita escribir las imágenes subidas en el host
chmod 777 backend/images

# Apagar la versión "workshop" si está corriendo (mismos nombres de contenedor)
# docker compose -f docker-compose.yml down 2>/dev/null || true

# Levantar desarrollo
docker compose -f docker-compose.yml up -d --build
docker compose -f docker-compose.yml ps

echo
echo "Logs: docker compose -f docker-compose.yml logs -f"
echo "App:  http://localhost   (espera 'Compiled successfully' en el frontend)"
