# Agent Log

## 2026-06-25 — Claude

### Tipo de cambio

Testing y fix

### Archivos modificados

- tests/auth.test.ts
- tests/leads.test.ts
- tests/activities.test.ts
- tests/webhooks.test.ts
- src/modules/auth/auth.routes.ts
- src/app.ts

### Descripcion

Se agregaron tests de QA con una prueba por cada validacion individual (longitud de campos, formato de telefono, trim, normalizacion lowercase, rango de fechas) y se refactorizo auth.routes a una factory createAuthRoutes para aislar el rate limiter por instancia de app, corrigiendo colisiones de contador entre tests. Resultado: 80 tests pasan.

### Motivo

Cierre de Fase 5 con validaciones exhaustivas de QA.

### Pendientes

Ninguno para Fase 5.

---

## 2026-06-25 — Codex

### Tipo de cambio

QA Hardening - Seguridad y validaciones

### Archivos modificados

- src/middlewares/error.middleware.ts
- src/middlewares/auth.middleware.ts
- src/middlewares/webhook.middleware.ts
- src/app.ts
- src/modules/auth/auth.routes.ts
- src/modules/auth/auth.schema.ts
- src/modules/leads/leads.schema.ts
- src/modules/activities/activities.schema.ts
- src/modules/webhooks/webhooks.schema.ts
- docs/changelog/CHANGELOG.md
- docs/changelog/agent-log.md

### Descripcion

Se aplicaron los siguientes cambios de seguridad y endurecimiento:

- **Rate limiting en login**: `express-rate-limit` configurado a 5 intentos por minuto por IP en `POST /api/auth/login`. Previene ataques de fuerza bruta.
- **Body limit 10kb**: `express.json({ limit: '10kb' })` en `src/app.ts`. Mitiga ataques de payload oversized.
- **Manejo de errores Prisma**: El middleware global de errores detecta y responde de forma especifica ante `P2002` (unique constraint), `P2025` (record not found) y `P2003` (foreign key violation).
- **Validacion JWT payload con Zod**: El auth middleware valida la estructura del payload decodificado antes de asignarlo a `req.user`, evitando tokens malformados que pasen la firma.
- **Timing-safe comparison en webhook**: Reemplazada comparacion directa de strings por `crypto.timingSafeEqual` en el middleware de webhook para prevenir timing attacks.
- **Schemas endurecidos con Zod**: Aplicados `.trim()`, `.max()` y regex de telefono en schemas de auth, leads, activities y webhooks.
- **Activity type restringido**: El schema de actividades manuales restringe `type` a `note` unicamente (los tipos automaticos como `status_change` solo los genera el sistema).
- **Source normalizado a lowercase**: El schema de webhooks aplica `.toLowerCase()` al campo `source` para normalizar entradas externas.
- **Query `from` validado**: El filtro de fecha `from` en leads incluye validacion `lte` contra la fecha actual para evitar rangos invalidos.

### Motivo

Aplicar QA hardening de seguridad sin modificar contratos de API, tests ni schema de Prisma.

### Pendientes

- Revision de Claude Code.

---

## 2026-06-25 — Codex

### Tipo de cambio

QA y seguridad - Validaciones y middlewares

### Archivos modificados

- src/middlewares/error.middleware.ts
- src/middlewares/auth.middleware.ts
- src/middlewares/webhook.middleware.ts
- src/app.ts
- src/modules/auth/auth.routes.ts
- src/modules/auth/auth.schema.ts
- src/modules/leads/leads.schema.ts
- src/modules/activities/activities.schema.ts
- src/modules/webhooks/webhooks.schema.ts
- docs/changelog/CHANGELOG.md
- docs/changelog/agent-log.md

### Descripcion

Se endurecieron validaciones de entrada con Zod, se agrego limite de 10kb al JSON body, rate limiting al login, comparacion timing-safe para webhooks y validacion del payload JWT. El middleware global de errores ahora responde de forma especifica ante errores conocidos de Prisma.

### Motivo

Aplicar validaciones de seguridad y QA solicitadas sin modificar contratos, tests, documentacion tecnica ni schema de Prisma.

### Pendientes

- Revision de Claude Code.

---

## 2026-06-25 — Claude Code + Codex + Copilot

### Tipo de cambio

Fase 5 - Validaciones, errores y documentacion

### Archivos modificados

- src/middlewares/error.middleware.ts
- src/shared/errors.ts
- README.md
- docs/phases/fase-5-validations-docs.md
- docs/03-roadmap.md
- docs/changelog/CHANGELOG.md
- docs/changelog/agent-log.md

### Descripcion

Se completo la Fase 5 del proyecto. El middleware global de errores fue actualizado para importar AppError desde shared/errors.ts, centralizando la definicion de errores personalizados. Se actualizo el README con la lista completa de endpoints bajo el prefijo /api, una seccion dedicada a tests, instrucciones de acceso a Swagger UI en /docs y la estructura actual del proyecto. Se marcaron como completadas todas las tareas de validacion, manejo de errores y documentacion de la fase.

### Motivo

Cumplir la Fase 5 del proyecto: normalizar respuestas, centralizar manejo de errores y documentar todos los endpoints con Swagger.

### Pendientes

- Fase 6: Testing y entrega

---

## 2026-06-24 — Codex

### Tipo de cambio

Implementacion Fase 3 - CRUD de Leads

### Archivos modificados

- src/modules/leads/leads.controller.ts
- src/modules/leads/leads.routes.ts
- src/modules/leads/leads.schema.ts
- src/modules/leads/leads.service.ts
- src/middlewares/validate.middleware.ts
- src/app.ts
- docs/changelog/CHANGELOG.md
- docs/changelog/agent-log.md

### Descripcion

CRUD completo con filtros, paginacion, validaciones Zod y Swagger.

### Motivo

Cumplir la Fase 3 del proyecto: CRUD de Leads.

### Pendientes

- Tests de leads

---

## 2026-06-24 — Codex

### Tipo de cambio

Implementacion Fase 2 - Autenticacion JWT

### Archivos modificados

- src/app.ts
- src/config/swagger.ts
- src/middlewares/auth.middleware.ts
- src/middlewares/error.middleware.ts
- src/middlewares/validate.middleware.ts
- src/modules/auth/auth.controller.ts
- src/modules/auth/auth.routes.ts
- src/modules/auth/auth.schema.ts
- src/modules/auth/auth.service.ts
- docs/changelog/CHANGELOG.md
- docs/changelog/agent-log.md

### Descripcion

Se implemento el login con JWT, validacion Zod para el payload, middleware de autenticacion Bearer, middleware global de errores y documentacion Swagger para el endpoint de login. La app ahora monta auth en `/api/auth`, Swagger en `/api/docs` y health en `/api/health`.

### Motivo

Cumplir la Fase 2 del proyecto: Autenticacion JWT.

### Pendientes

- Proteger endpoints privados cuando se implemente la Fase 3.

---

## 2026-06-24 — Codex

### Tipo de cambio

Infraestructura Docker

### Archivos modificados

- Dockerfile
- docker-compose.yml
- docker-compose.prod.yml
- tsconfig.json
- .dockerignore
- .gitignore
- docs/08-deployment-docker.md
- docs/changelog/CHANGELOG.md
- docs/changelog/agent-log.md

### Descripcion

Se configuro Docker como flujo principal de desarrollo. El compose por defecto usa el stage `dev`, monta el codigo fuente, conserva `node_modules` dentro del contenedor y ejecuta migraciones, seed y hot-reload. Se agrego override de produccion con build multi-stage y arranque desde `dist/server.js`.

### Motivo

Permitir que el proyecto arranque completo con `docker compose up` sin instalar dependencias localmente.

### Pendientes

- Crear la rama `feature/docker-dev-setup` fuera del sandbox actual, porque `.git` esta montado como solo lectura en este entorno.
- Validar Docker en un entorno con daemon disponible.

---

## 2026-06-24 — Claude Code

### Tipo de cambio

Organizacion y documentacion

### Archivos modificados

- docs/01-scope.md (creado)
- docs/03-roadmap.md (creado)
- docs/04-api-contract.md (creado)
- docs/05-database-model.md (creado)
- docs/07-testing-strategy.md (creado)
- docs/09-decision-log.md (creado)
- docs/phases/fase-1-setup.md (creado)
- docs/phases/fase-2-auth.md (creado)
- docs/phases/fase-3-leads.md (creado)
- docs/phases/fase-4-notes-webhook.md (creado)
- docs/phases/fase-5-validations-docs.md (creado)
- docs/phases/fase-6-testing.md (creado)
- README.md (completado)
- obsidian/index.md (actualizado)
- obsidian/architecture-map.md (creado)
- obsidian/agent-dashboard.md (creado)
- .env.example (corregido)
- docs/ARCHITECTURE.md, DATABASE.md, TESTING.md, DECISIONS.md, DOCKER.md, API_CONTRACT.md, PROJECT_BRIEF.md, ROADMAP.md, changelog/AGENT_LOG.md (eliminados — duplicados)

### Descripcion

Analisis completo de documentacion existente. Se eliminaron 9 archivos duplicados (UPPERCASE vs numerados). Se rellenaron 6 docs vacios con contenido derivado de Requirements.md. Se separaron las 6 fases del proyecto en archivos individuales bajo docs/phases/. Se completo README.md. Se actualizo Obsidian con architecture-map y agent-dashboard. Se corrigio inconsistencia en .env.example (WEBHOOK_API_KEY → WEBHOOK_SECRET, se agrego JWT_EXPIRES_IN y NODE_ENV).

### Motivo

Organizar documentacion para tener una base solida antes de iniciar implementacion.

### Pendientes

- Instalar dependencias (npm install)
- Configurar .claude/settings.json con permisos del proyecto
- Iniciar Fase 2: Autenticacion JWT

---

## 2026-06-23 16:30 — Codex

### Tipo de cambio

Implementacion

### Archivos modificados

- src/modules/leads/leads.controller.ts
- src/modules/leads/leads.service.ts
- prisma/schema.prisma

### Descripcion

Se implemento CRUD basico de leads.

### Motivo

Cumplir requerimiento principal del MVP.

### Pendientes

- Agregar filtros
- Agregar validaciones con Zod
