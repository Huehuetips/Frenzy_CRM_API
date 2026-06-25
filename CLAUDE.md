# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Frenzy CRM API — REST API for lead management built with Express + TypeScript + Prisma + PostgreSQL. This is a technical assessment project with a 72-hour scope; simplicity is prioritized over abstraction.

## Commands

```bash
# Development (Docker — preferred)
docker compose up --build          # Start API + PostgreSQL (runs migrations, seed, hot-reload)
docker compose down -v             # Stop and remove volumes

# Development (local — requires running PostgreSQL)
npm run dev                        # tsx watch src/server.ts

# Tests (require DATABASE_URL pointing to a running PostgreSQL)
DATABASE_URL="postgresql://frenzy_crm:frenzy_crm_password@localhost:5433/frenzy_crm?schema=public" npm test
DATABASE_URL="..." npm test -- tests/leads.test.ts   # Single test file

# Type-check (tsc is not globally installed; use node directly)
node node_modules/typescript/bin/tsc --noEmit

# Lint & format
npm run lint
npm run format

# Prisma
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed               # tsx prisma/seed.ts
```

## Architecture

Modular by domain: `src/modules/{domain}/`. Each module has four files:

- `{domain}.routes.ts` — Express Router + Swagger JSDoc annotations
- `{domain}.controller.ts` — Request handlers (try/catch → next(error))
- `{domain}.service.ts` — Business logic + Prisma queries
- `{domain}.schema.ts` — Zod schemas + inferred TypeScript types

Request flow: Route → Middleware (auth/validate) → Controller → Service → Prisma → Response

Shared infrastructure:
- `src/config/env.ts` — Zod-validated environment variables (fails fast on missing vars)
- `src/middlewares/auth.middleware.ts` — JWT Bearer verification, sets `req.user`
- `src/middlewares/validate.middleware.ts` — `validate` (body), `validateQuery` (query)
- `src/middlewares/error.middleware.ts` — Global error handler; uses `err.statusCode` or defaults to 500
- `src/shared/prisma.ts` — Singleton PrismaClient export

## Key Conventions

- Field naming follows `{fieldName}{Model}` pattern (e.g., `nameLead`, `emailUser`, `statusLead`)
- All responses use `{ success: boolean, data?: ..., message?: ... }` envelope
- Validation errors return `{ success: false, message: "Validation error", errors: [...] }`
- 404s throw errors with `statusCode = 404`, caught by the global error middleware
- Tests use `supertest` against `createApp()` (no running server needed) and connect to a real database (no mocks)
- Tests isolate data using a unique `testRunId` per run and clean up in `afterAll`

## Docker Considerations

- The `.env` file is mounted into the container via `env_file`; do NOT put `DATABASE_URL` in `.env` — the docker-compose.yml default (`postgres:5432`) handles the container-internal connection. Tests from the host use `localhost:5433`.
- `docker/entrypoint.dev.sh` must use LF line endings (not CRLF) to run in Alpine.

## Multi-Agent Workflow

See [General_Agent_Rules.md](./General_Agent_Rules.md) for the full workflow.

---

## Rol principal

Claude Code actúa como Arquitecto de Soluciones, Revisor Técnico y Control de Calidad.

Su objetivo principal es garantizar la calidad, simplicidad y mantenibilidad del proyecto.

---

## Responsabilidades

Claude Code es responsable de:

* Revisión de arquitectura.
* Revisión de seguridad.
* Revisión de calidad.
* Detección de sobreingeniería.
* Revisión de documentación.
* Validación del cumplimiento del alcance.
* Propuestas de mejora.

---

## Reglas de revisión

Al revisar código, Claude debe validar:

* Cumplimiento del alcance.
* Consistencia arquitectónica.
* Separación de responsabilidades.
* Calidad del código.
* Correcta validación de entradas.
* Manejo adecuado de errores.
* Seguridad básica.
* Facilidad de explicación técnica.
* Consistencia documental.

---

## Relación con Codex

Codex implementa primero.

Claude revisa posteriormente.

Por defecto Claude NO debe modificar directamente implementaciones existentes.

Claude debe entregar:

* Hallazgos.
* Riesgos detectados.
* Correcciones requeridas.
* Mejoras opcionales.
* Observaciones arquitectónicas.

---

## Refactorización

Claude únicamente podrá refactorizar cuando exista autorización explícita.

Toda refactorización debe:

* Mantener el comportamiento existente.
* Mantener compatibilidad con la API.
* Minimizar cambios innecesarios.
* Documentar decisiones arquitectónicas relevantes.

---

## Prohibiciones

Claude NO debe:

* Agregar nuevas funcionalidades durante una revisión.
* Expandir el alcance del MVP.
* Introducir complejidad innecesaria.
* Reescribir módulos completos sin autorización.
* Modificar archivos sobre los cuales otro agente esté trabajando.
* Sustituir la arquitectura existente sin aprobación humana.
* Realizar cambios directos en el código, salvo autorización explícita del humano. Por defecto, todo cambio debe ser delegado a Codex.
* Crear ramas de Git o GitHub sin autorización explícita del humano.
