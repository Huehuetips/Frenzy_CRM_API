# Frenzy CRM API

API REST para administración de leads, construida con Node.js 22, TypeScript, Express y PostgreSQL.

## Stack

| Capa | Tecnología |
|---|---|
| Runtime | Node.js 22 |
| Framework | Express |
| Lenguaje | TypeScript (CommonJS) |
| ORM | Prisma 5 |
| Base de datos | PostgreSQL 16 |
| Autenticación | JWT (jsonwebtoken + bcryptjs) |
| Validaciones | Zod |
| Documentación | Swagger (swagger-jsdoc + swagger-ui-express) |
| Testing | Jest + Supertest |
| Contenedores | Docker + Docker Compose |

---

## Requisitos previos

- [Docker](https://docs.docker.com/get-docker/) (incluye Docker Compose)
- No se necesita Node.js ni PostgreSQL instalados localmente

---

## Instalación y arranque (Docker)

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd Frenzy_CRM_API
```

### 2. Crear el archivo de variables de entorno

```bash
cp .env.example .env
```

El `.env.example` ya está listo para desarrollo con Docker. **No descomentes ni agregues `DATABASE_URL`** — Prisma carga este archivo directamente dentro del contenedor y `localhost` ahí apunta al propio contenedor, no al servicio de PostgreSQL. Docker Compose gestiona la conexión interna de forma automática.

### 3. Levantar la API y la base de datos

```bash
docker compose up --build
```

Este comando:
- Construye la imagen de la API
- Levanta PostgreSQL y espera a que esté saludable
- Ejecuta las migraciones de Prisma
- Carga el seed (usuario demo + 50 leads de prueba con actividades)
- Arranca la API en modo hot-reload

La API estará disponible en **http://localhost:3000** en cuanto veas:

```
frenzy-crm-api | Server listening on port 3000
```

### 4. Verificar que funciona

```bash
curl http://localhost:3000/api/health
# {"success":true,"message":"ok"}
```

### Detener y limpiar

```bash
# Solo detener (mantiene datos)
docker compose down

# Detener y borrar volúmenes (base de datos limpia)
docker compose down -v
```

---

## Variables de entorno

| Variable | Descripción | Requerida | Ejemplo |
|---|---|---|---|
| `NODE_ENV` | Entorno de ejecución | No | `development` |
| `PORT` | Puerto de la API | No | `3000` |
| `DATABASE_URL` | URL de conexión a PostgreSQL | Sí (tests locales) | `postgresql://user:pass@localhost:5433/db` |
| `JWT_SECRET` | Secreto para firmar JWT (min 16 chars) | Sí | `mi-secreto-muy-largo` |
| `JWT_EXPIRES_IN` | Duración del JWT | No | `1d` |
| `WEBHOOK_SECRET` | API Key para el webhook externo | Sí | `mi-api-key-segura` |

En Docker Compose los defaults del `docker-compose.yml` cubren `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN` y `WEBHOOK_SECRET` para desarrollo.

---

## Documentación interactiva (Swagger)

Disponible en: **http://localhost:3000/docs**

Desde ahí puedes probar todos los endpoints. Flujo:

1. Ejecuta `POST /auth/login` con las credenciales del usuario demo
2. Copia el `token` de la respuesta
3. Haz clic en **Authorize** (arriba a la derecha) → escribe `Bearer <token>` → Authorize
4. Ya puedes ejecutar cualquier endpoint protegido

---

## Usuario demo

El seed crea automáticamente:

| Campo | Valor |
|---|---|
| Email | `admin@example.com` |
| Password | `admin12345` |

Para el endpoint de webhook, el valor por defecto de `WEBHOOK_SECRET` en desarrollo es `change-me-webhook-secret`. Úsalo en el header `x-api-key` al probar `POST /api/webhooks/leads`.

También crea 50 leads distribuidos en todos los estados con actividades de ejemplo.

---

## Ejecutar tests

Los contenedores deben estar corriendo (`docker compose up --build`).

```bash
# Suite completa (80 tests)
docker compose exec api npx jest --runInBand --verbose

# Suite individual
docker compose exec api npx jest --runInBand --verbose tests/auth.test.ts
docker compose exec api npx jest --runInBand --verbose tests/leads.test.ts
docker compose exec api npx jest --runInBand --verbose tests/activities.test.ts
docker compose exec api npx jest --runInBand --verbose tests/webhooks.test.ts
```

Resultado esperado: `Tests: 80 passed, 4 suites passed`.

---

## Conectar a la base de datos

Desde el host (requiere Docker corriendo):

```bash
# Cliente psql dentro del contenedor
docker compose exec postgres psql -U frenzy_crm -d frenzy_crm

# Puerto externo para clientes SQL (DBeaver, TablePlus, etc.)
# Host: localhost  Puerto: 5433  Usuario: frenzy_crm  Password: frenzy_crm_password  BD: frenzy_crm
```

Tablas: `users`, `leads`, `lead_activities` (snake_case). Campos en camelCase con sufijo de entidad (`nameLead`, `emailUser`, etc.).

---

## Endpoints

### Auth

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/login` | Pública | Login, retorna JWT |
| `GET` | `/api/auth/me` | JWT | Obtener usuario autenticado |

### Leads

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/leads` | JWT | Crear lead |
| `GET` | `/api/leads` | JWT | Listar leads con filtros y paginación |
| `GET` | `/api/leads/:id` | JWT | Obtener lead por ID |
| `PATCH` | `/api/leads/:id` | JWT | Editar lead |
| `DELETE` | `/api/leads/:id` | JWT | Eliminar lead |
| `PATCH` | `/api/leads/:id/status` | JWT | Cambiar estado |

### Actividades

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/leads/:id/activities` | JWT | Agregar nota/actividad |
| `GET` | `/api/leads/:id/activities` | JWT | Listar actividades del lead (desc) |

### Webhooks

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/webhooks/leads` | API Key | Crear lead desde sistema externo |

La API Key va en el header `x-api-key` con el valor de `WEBHOOK_SECRET`.

### Otros

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/health` | Pública | Health check |
| `GET` | `/docs` | Pública | Swagger UI |

---

## Filtros disponibles — `GET /api/leads`

| Parámetro | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `email` | string | Búsqueda parcial por email | `?email=juan` |
| `status` | string | Estado exacto | `?status=contactado` |
| `source` | string | Fuente exacta | `?source=google` |
| `from` | ISO 8601 | Fecha de creación desde | `?from=2026-01-01T00:00:00.000Z` |
| `to` | ISO 8601 | Fecha de creación hasta | `?to=2026-12-31T23:59:59.999Z` |
| `page` | number | Página (default: 1) | `?page=2` |
| `limit` | number | Por página (default: 20, max: 100) | `?limit=50` |

Estados válidos: `nuevo`, `contactado`, `calificado`, `perdido`, `convertido`.

---

## Formato de respuesta

Todas las respuestas usan el mismo envelope:

```json
{ "success": true, "data": { ... } }
{ "success": false, "message": "Descripción del error" }
{ "success": false, "message": "Validation error", "errors": [ { "field": "emailLead", "message": "..." } ] }
```

---

## Producción

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

La imagen de producción es multi-stage: solo incluye el build compilado sin dependencias de desarrollo.

---

## Estructura del proyecto

```
src/
  config/           Variables de entorno (Zod) y configuración de Swagger
  shared/           PrismaClient singleton y AppError
  middlewares/      Auth JWT, validación Zod, errores globales, webhook auth
  modules/
    auth/           Login y JWT (/api/auth)
    leads/          CRUD de leads (/api/leads)
    activities/     Notas y actividades (/api/leads/:id/activities)
    webhooks/       Recepción de leads externos (/api/webhooks)
  app.ts            Configuración de Express
  server.ts         Entry point

prisma/
  schema.prisma     Modelos de BD
  seed.ts           50 leads con faker + usuario demo
  migrations/       Migraciones SQL generadas

tests/              Tests con Jest + Supertest (80 tests, DB real)
docs/               Documentación técnica del proyecto
docker/             Scripts de Docker (entrypoint dev)
```

---

## Documentación técnica

| Documento | Descripción |
|---|---|
| [Project Brief](./docs/00-project-brief.md) | Objetivo y alcance del proyecto |
| [Scope](./docs/01-scope.md) | MVP y criterios de aceptación |
| [Arquitectura](./docs/02-architecture.md) | Diseño del sistema |
| [Roadmap](./docs/03-roadmap.md) | Fases del proyecto |
| [API Contract](./docs/04-api-contract.md) | Contrato de endpoints |
| [Database Model](./docs/05-database-model.md) | Modelo de datos |
| [Testing Strategy](./docs/07-testing-strategy.md) | Estrategia de tests |
| [Docker](./docs/08-deployment-docker.md) | Despliegue con Docker |
| [Decision Log](./docs/09-decision-log.md) | Decisiones técnicas (DEC-001 a DEC-008) |
| [Project Summary](./docs/10-project-summary.md) | Resumen completo del proyecto |
| [Changelog](./docs/changelog/CHANGELOG.md) | Historial de cambios |
| [Agent Log](./docs/changelog/agent-log.md) | Registro de actividad por agente |
