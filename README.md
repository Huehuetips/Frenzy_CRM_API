# Mini CRM API

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
git clone repo-url
cd mini-crm-api
cp .env.example .env
docker compose up --build
```

Esto levanta PostgreSQL, ejecuta migraciones, crea el usuario demo y arranca la API con hot-reload. La API estara disponible en [[http://localhost:3000]]

## Produccion

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

## Variables de entorno

| Variable | Descripcion | Default |
| -------- | ----------- | ------- |
| `NODE_ENV` | Entorno de ejecucion | `development` |
| `PORT` | Puerto de la API | `3000` |
| `DATABASE_URL` | URL de conexion a PostgreSQL | - |
| `JWT_SECRET` | Secreto para firmar JWT (min 16 chars) | - |
| `JWT_EXPIRES_IN` | Tiempo de expiracion del JWT | `1d` |
| `WEBHOOK_SECRET` | API Key para webhook externo (min 8 chars) | - |

## Scripts

| Comando | Descripcion |
| ------- | ----------- |
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Compilar TypeScript |
| `npm start` | Iniciar en produccion |
| `npm test` | Ejecutar tests |
| `npm run lint` | Ejecutar ESLint |
| `npm run format` | Formatear con Prettier |
| `npm run prisma:generate` | Generar cliente Prisma |
| `npm run prisma:migrate` | Ejecutar migraciones |
| `npm run prisma:seed` | Seed de datos iniciales |

## Endpoints principales

### Auth

| Metodo | Ruta | Descripcion |
| ------ | ---- | ----------- |
| POST | `/auth/login` | Login, retorna JWT |

### Leads

| Metodo | Ruta | Descripcion |
| ------ | ---- | ----------- |
| POST | `/leads` | Crear lead |
| GET | `/leads` | Listar leads (con filtros) |
| GET | `/leads/:id` | Obtener lead |
| PATCH | `/leads/:id` | Editar lead |
| DELETE | `/leads/:id` | Eliminar lead |
| PATCH | `/leads/:id/status` | Cambiar estado |

### Actividades

| Metodo | Ruta | Descripcion |
| ------ | ---- | ----------- |
| POST | `/leads/:id/activities` | Agregar actividad |
| GET | `/leads/:id/activities` | Listar actividades |

### Webhook

| Metodo | Ruta | Descripcion |
| ------ | ---- | ----------- |
| POST | `/webhooks/leads` | Crear lead externo |

### Otros

| Metodo | Ruta | Descripcion |
| ------ | ---- | ----------- |
| GET | `/health` | Health check |

## Usuario demo

- **Email:** `admin@example.com`
- **Password:** admin12345

## Estructura del proyecto

```text
src/
  config/          — Configuracion (env vars)
  shared/          — Codigo compartido (prisma client)
  middlewares/     — Auth, validacion, errores
  modules/
    auth/          — Login y JWT
    leads/         — CRUD de leads
    activities/    — Notas y actividades
    webhooks/      — Recepcion de leads externos
  app.ts           — Configuracion de Express
  server.ts        — Entry point

prisma/
  schema.prisma    — Modelos de BD
  seed.ts          — Datos iniciales

tests/             — Tests con Jest + Supertest
docs/              — Documentacion tecnica
```

## Documentacion

- [Project Brief](./docs/00-project-brief.md)
- [Alcance](./docs/01-scope.md)
- [Arquitectura](./docs/02-architecture.md)
- [Roadmap](./docs/03-roadmap.md)
- [Contrato de API](./docs/04-api-contract.md)
- [Modelo de BD](./docs/05-database-model.md)
- [Guias de agentes](./docs/06-agent-guidelines.md)
- [Testing](./docs/07-testing-strategy.md)
- [Docker](./docs/08-deployment-docker.md)
- [Decision Log](./docs/09-decision-log.md)
- [Fases del proyecto](./docs/phases/)
