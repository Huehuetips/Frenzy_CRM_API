# Frenzy CRM API

API REST para administracion de leads, construida con Node.js, TypeScript, Express y PostgreSQL.

## Stack

- **Runtime:** Node.js 22
- **Framework:** Express
- **Lenguaje:** TypeScript
- **Base de datos:** PostgreSQL 16
- **ORM:** Prisma
- **Autenticacion:** JWT (jsonwebtoken + bcryptjs)
- **Validaciones:** Zod
- **Documentacion:** Swagger (swagger-jsdoc + swagger-ui-express)
- **Testing:** Jest + Supertest
- **Contenedores:** Docker + Docker Compose

## Requisitos previos

- Docker
- Docker Compose

## Instalacion

```bash
git clone <repo-url>
cd frenzy-crm-api
cp .env.example .env
docker compose up --build
```

Esto levanta PostgreSQL, ejecuta migraciones, crea el usuario demo, genera 50 leads de prueba con actividades y arranca la API con hot-reload.

La API estara disponible en http://localhost:3000

## Produccion

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

## Documentacion interactiva (Swagger)

Disponible en: http://localhost:3000/docs

Desde ahi puedes probar todos los endpoints. Para endpoints protegidos, primero haz login, copia el token y pegalo en el boton "Authorize".

## Ejecutar tests

```bash
docker compose exec api npx jest --runInBand --verbose
```

Para ejecutar una suite especifica:

```bash
docker compose exec api npx jest --runInBand --verbose tests/auth.test.ts
docker compose exec api npx jest --runInBand --verbose tests/leads.test.ts
docker compose exec api npx jest --runInBand --verbose tests/activities.test.ts
docker compose exec api npx jest --runInBand --verbose tests/webhooks.test.ts
```

## Conectar a la base de datos

```bash
docker compose exec postgres psql -U frenzy_crm -d frenzy_crm
```

Tablas: `users`, `leads`, `lead_activities` (snake_case). Campos en camelCase.

## Variables de entorno

| Variable | Descripcion | Default |
|----------|-------------|---------|
| `NODE_ENV` | Entorno de ejecucion | `development` |
| `PORT` | Puerto de la API | `3000` |
| `DATABASE_URL` | URL de conexion a PostgreSQL | - |
| `JWT_SECRET` | Secreto para firmar JWT (min 16 chars) | - |
| `JWT_EXPIRES_IN` | Tiempo de expiracion del JWT | `1d` |
| `WEBHOOK_SECRET` | API Key para webhook externo (min 8 chars) | - |

## Endpoints

### Auth

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| POST | `/api/auth/login` | Publica | Login, retorna JWT |
| GET | `/api/auth/me` | JWT | Obtener usuario autenticado |

### Leads

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| POST | `/api/leads` | JWT | Crear lead |
| GET | `/api/leads` | JWT | Listar leads (con filtros y paginacion) |
| GET | `/api/leads/:id` | JWT | Obtener lead por ID |
| PATCH | `/api/leads/:id` | JWT | Editar lead |
| DELETE | `/api/leads/:id` | JWT | Eliminar lead |
| PATCH | `/api/leads/:id/status` | JWT | Cambiar estado |

### Actividades

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| POST | `/api/leads/:id/activities` | JWT | Agregar actividad |
| GET | `/api/leads/:id/activities` | JWT | Listar actividades |

### Webhooks

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| POST | `/api/webhooks/leads` | API Key | Crear lead externo |

### Otros

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| GET | `/api/health` | Publica | Health check |

## Filtros disponibles (GET /api/leads)

| Param | Tipo | Descripcion |
|-------|------|-------------|
| `email` | string | Busqueda parcial por email |
| `status` | string | nuevo, contactado, calificado, perdido, convertido |
| `source` | string | Filtrar por fuente |
| `from` | ISO date | Fecha inicio |
| `to` | ISO date | Fecha fin |
| `page` | number | Pagina (default: 1) |
| `limit` | number | Resultados por pagina (default: 20, max: 100) |

## Usuario demo

- **Email:** admin@example.com
- **Password:** admin12345

### Token expirado para pruebas

Este token ya esta expirado y puede usarse para verificar que la API rechaza tokens invalidos:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiJkZW1vIiwiZW1haWxVc2VyIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3ODIzMzgwMTEsImV4cCI6MTc4MjMzODAxMn0.urpS0GPGLqndhEikA8gkt7OPg5eKmDgErnLFWwrA13E
```

> Tambien se genera uno nuevo cada vez que se ejecuta el seed. Puedes verlo con: `docker compose logs api`

## Estructura del proyecto

```
src/
  config/          -- Configuracion (env vars, swagger)
  shared/          -- Prisma client, errores centralizados
  middlewares/     -- Auth JWT, validacion Zod, errores, webhook auth
  modules/
    auth/          -- Login y JWT
    leads/         -- CRUD de leads
    activities/    -- Notas y actividades
    webhooks/      -- Recepcion de leads externos
  app.ts           -- Configuracion de Express
  server.ts        -- Entry point

prisma/
  schema.prisma    -- Modelos de BD
  seed.ts          -- 50 leads con faker + usuario demo
  migrations/      -- Migraciones SQL

tests/             -- Tests con Jest + Supertest
docs/              -- Documentacion tecnica
docker/            -- Scripts de Docker (entrypoint)
```

## Documentacion tecnica

- [Project Brief](./docs/00-project-brief.md)
- [Alcance](./docs/01-scope.md)
- [Arquitectura](./docs/02-architecture.md)
- [Roadmap](./docs/03-roadmap.md)
- [Contrato de API](./docs/04-api-contract.md)
- [Modelo de BD](./docs/05-database-model.md)
- [Testing](./docs/07-testing-strategy.md)
- [Docker](./docs/08-deployment-docker.md)
- [Decision Log](./docs/09-decision-log.md)
