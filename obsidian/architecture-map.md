# Architecture Map

## Flujo de request

```
Cliente HTTP
    │
    ▼
Express App (app.ts)
    │
    ├── helmet() — headers de seguridad
    ├── cors() — CORS
    ├── express.json() — parseo de body
    ├── morgan('dev') — logging
    │
    ▼
Router (por modulo)
    │
    ├── /auth/*        → auth.routes.ts
    ├── /leads/*       → leads.routes.ts
    ├── /leads/:id/activities/* → activities.routes.ts
    ├── /webhooks/*    → webhooks.routes.ts
    │
    ▼
Middleware de validacion (Zod schema)
    │
    ▼
Middleware de auth (JWT / API Key)
    │
    ▼
Controller (maneja req/res)
    │
    ▼
Service (logica de negocio)
    │
    ▼
Prisma Client (ORM)
    │
    ▼
PostgreSQL
```

## Modulos

| Modulo | Responsabilidad | Auth |
|--------|----------------|------|
| auth | Login, generacion de JWT | Publica |
| leads | CRUD, filtros, cambio de estado | JWT |
| activities | Notas y registro de actividades | JWT |
| webhooks | Recepcion de leads externos | API Key |

## Estructura por modulo

```
src/modules/<nombre>/
  <nombre>.controller.ts  — Handlers HTTP
  <nombre>.service.ts     — Logica de negocio
  <nombre>.schema.ts      — Schemas Zod
  <nombre>.routes.ts      — Definicion de rutas
```

## Middlewares

| Middleware | Ubicacion | Funcion |
|------------|-----------|---------|
| auth | src/middlewares/auth.middleware.ts | Verificar JWT |
| webhook | src/middlewares/webhook.middleware.ts | Verificar API Key |
| validate | src/middlewares/validate.middleware.ts | Validar body con Zod |
| error | src/middlewares/error.middleware.ts | Manejo global de errores |

## Shared

| Archivo | Funcion |
|---------|---------|
| src/shared/prisma.ts | Instancia de PrismaClient |
| src/shared/response.ts | Helpers de formato de respuesta |
| src/config/env.ts | Validacion de env vars con Zod |
