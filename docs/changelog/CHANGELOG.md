# Changelog

## [0.5.1] - 2026-06-25

### Added

- Tests de QA por validacion individual y rate limiter aislado por app (80 tests).
- Rate limiting en login (5 intentos/min por IP).
- Manejo de errores Prisma (P2002, P2025, P2003) en middleware global.
- Validacion de JWT payload con Zod en auth middleware.
- Timing-safe comparison en webhook API key middleware.

### Changed

- Body limit reducido a 10kb en Express JSON middleware.
- Schemas actualizados con trim, max length y phone regex.
- Activity type restringido a `note` para endpoint manual.
- Source normalizado a lowercase en webhook schema.
- Query `from` validado con `<=` a fecha actual.

## [0.5.0] - 2026-06-25

### Changed

- Error middleware importa AppError desde shared/errors.ts
- README actualizado con endpoints /api, seccion de tests, Swagger y estructura
- Fase 5 completada

## [0.4.0] - 2026-06-24

### Added

- CRUD completo de leads (crear, listar, obtener, editar, eliminar).
- Cambio de estado de leads como endpoint separado (`PATCH /api/leads/:id/status`).
- Filtros por email, estado, fuente y rango de fechas.
- Paginacion con `page` (default 1) y `limit` (default 20, max 100).
- Validacion de UUID en parametros de ruta.
- Middleware `validateQuery` para query params.
- Swagger JSDoc para todos los endpoints de leads.

## [0.3.0] - 2026-06-24

### Added

- Autenticacion JWT con endpoint `POST /api/auth/login`.
- Middleware generico de validacion Zod.
- Middleware global de errores.
- Middleware de autenticacion Bearer JWT.
- Swagger UI disponible en `/api/docs`.

### Changed

- Health check movido a `/api/health`.

## [0.2.1] - 2026-06-24

### Changed

- Docker de desarrollo por defecto con hot-reload, migraciones y seed al iniciar.
- Build Docker reproducible usando `npm ci`.
- Salida TypeScript ajustada a `dist/server.js`.

### Added

- Override `docker-compose.prod.yml` para ejecucion de produccion.
- `.dockerignore` para excluir dependencias, build, Git, env y Markdown.

## [0.2.0] - 2026-06-24

### Added

- Documentacion completa del alcance (01-scope.md)
- Roadmap con tabla de fases (03-roadmap.md)
- Contrato de API con todos los endpoints (04-api-contract.md)
- Modelo de base de datos documentado (05-database-model.md)
- Estrategia de testing (07-testing-strategy.md)
- Decision log con 5 decisiones iniciales (09-decision-log.md)
- 6 archivos de fases individuales en docs/phases/
- README.md completo con instalacion, endpoints y estructura
- Obsidian architecture-map y agent-dashboard

### Fixed

- .env.example: WEBHOOK_API_KEY renombrado a WEBHOOK_SECRET (coherencia con env.ts)
- .env.example: agregados NODE_ENV y JWT_EXPIRES_IN faltantes

### Removed

- 9 archivos duplicados de docs (UPPERCASE) que duplicaban los numerados (00-09)

## [0.1.0] - 2026-06-23

### Added

- Setup inicial del proyecto
- Dockerfile
- docker-compose con PostgreSQL
- Prisma configurado
- Estructura modular base
