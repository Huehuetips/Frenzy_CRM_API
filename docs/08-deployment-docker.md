# Docker Setup

## Servicios

- api
- postgres

## Desarrollo

```bash
docker compose up
```

El compose de desarrollo construye el stage `dev`, monta el codigo fuente y ejecuta migraciones, seed y hot-reload con `tsx watch`.

Para reconstruir la imagen:

```bash
docker compose up --build
```

## Produccion

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

El override de produccion usa el build multi-stage completo, no monta codigo fuente y arranca con `prisma migrate deploy`, seed y `node dist/server.js`.
