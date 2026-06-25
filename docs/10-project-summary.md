# Frenzy CRM API - Project Summary

Documento de entrega final. Registra el estado completo del proyecto desde el inicio hasta la entrega en v1.0.0.

**Fecha de entrega:** 2026-06-25
**Version:** 1.0.0
**Repositorio:** Huehuetips/Frenzy_CRM_API

---

## 1. Objetivo del proyecto

Construir una API REST para gestion de leads como prueba tecnica de 72 horas. El sistema permite registrar, consultar, actualizar y eliminar leads de potenciales clientes, con autenticacion JWT, filtros avanzados, registro de actividades, soporte de webhooks externos y documentacion interactiva.

**Stack requerido:** Node.js 22 + Express + TypeScript + Prisma + PostgreSQL 16.

**Criterios de exito del MVP:**

- API funcional con todos los endpoints especificados.
- Autenticacion JWT operativa.
- CRUD completo de leads con filtros y paginacion.
- Registro de actividades y cambios de estado.
- Webhook externo autenticado con API Key.
- Validaciones exhaustivas con respuestas consistentes.
- Tests automatizados cubriendo todos los flujos.
- Docker reproducible con un solo comando.
- Documentacion Swagger interactiva.

---

## 2. Stack tecnologico completo

| Categoria | Tecnologia | Version |
|---|---|---|
| Runtime | Node.js | 22 |
| Framework | Express | 5.x |
| Lenguaje | TypeScript (CommonJS) | 5.x |
| ORM | Prisma | 5.x |
| Base de datos | PostgreSQL | 16 |
| Autenticacion | jsonwebtoken + bcryptjs | latest |
| Validaciones | Zod | 3.x |
| Documentacion | swagger-jsdoc + swagger-ui-express | latest |
| Testing | Jest + Supertest | latest |
| Rate Limiting | express-rate-limit | latest |
| Seed de datos | @faker-js/faker (fakerES_MX) | latest |
| Contenedores | Docker + Docker Compose | multi-stage |
| Linter | ESLint | latest |
| Formatter | Prettier | latest |
| Seguridad | helmet + cors | latest |

---

## 3. Arquitectura

### Patron general

Arquitectura modular por dominio. Cada dominio de negocio (auth, leads, activities, webhooks) es un modulo independiente que concentra su propia logica de routing, validacion, control y acceso a datos.

### Estructura de directorios

```text
src/
  app.ts                          -- Factory de la app Express
  server.ts                       -- Punto de entrada, escucha en puerto
  config/
    env.ts                        -- Variables de entorno validadas con Zod
    swagger.ts                    -- Configuracion de Swagger
  middlewares/
    auth.middleware.ts             -- Verificacion JWT Bearer + validacion payload Zod
    error.middleware.ts            -- Manejador global de errores
    validate.middleware.ts         -- validate() y validateQuery() con Zod
    webhook.middleware.ts          -- Verificacion API Key con timing-safe
  modules/
    auth/
      auth.routes.ts
      auth.controller.ts
      auth.service.ts
      auth.schema.ts
    leads/
      leads.routes.ts
      leads.controller.ts
      leads.service.ts
      leads.schema.ts
    activities/
      activities.routes.ts
      activities.controller.ts
      activities.service.ts
      activities.schema.ts
    webhooks/
      webhooks.routes.ts
      webhooks.controller.ts
      webhooks.service.ts
      webhooks.schema.ts
  shared/
    prisma.ts                      -- Singleton PrismaClient
    errors.ts                      -- Clase AppError con statusCode
tests/
  auth.test.ts
  leads.test.ts
  activities.test.ts
  webhooks.test.ts
prisma/
  schema.prisma
  seed.ts
docker/
  entrypoint.dev.sh
  entrypoint.prod.sh
```

### Flujo de una peticion

```text
Request HTTP
  --> Express Router
  --> Middleware de autenticacion (auth.middleware) o API Key (webhook.middleware)
  --> Middleware de validacion (validate / validateQuery)
  --> Controller (try/catch -> next(error))
  --> Service (logica de negocio + queries Prisma)
  --> PrismaClient (singleton)
  --> Response JSON { success, data }
  --> (en caso de error) error.middleware (AppError / PrismaClientKnownRequestError)
```

### Infraestructura compartida

- `src/config/env.ts`: Valida con Zod todas las variables de entorno al arranque. Falla rapido si faltan variables criticas (`DATABASE_URL`, `JWT_SECRET`, `WEBHOOK_SECRET`).
- `src/shared/prisma.ts`: Exporta una unica instancia de `PrismaClient` reutilizada por todos los servicios.
- `src/shared/errors.ts`: Clase `AppError` que extiende `Error` con un campo `statusCode`. Permite que el middleware global distinga errores operacionales de errores de sistema.
- `src/middlewares/error.middleware.ts`: Intercepta todos los errores no manejados. Detecta `AppError` (statusCode configurable), errores conocidos de Prisma (`P2002` -> 409, `P2025` -> 404, `P2003` -> 400) y cualquier otro error no controlado (500).

---

## 4. Modelo de datos

### Convencion de nombres

Las tablas usan `snake_case`. Los campos usan el patron `{fieldName}{Model}` en `camelCase`, lo cual permite identificar el modelo de pertenencia desde cualquier contexto de codigo.

### Diagrama de entidades

```text
┌──────────────────────┐
│        users         │
├──────────────────────┤
│ idUser       UUID PK │
│ emailUser    unique  │
│ passwordHashUser     │
│ createdAtUser        │
│ updatedAtUser        │
└──────────────────────┘

┌────────────────────────┐       ┌──────────────────────────────┐
│         leads          │       │       lead_activities        │
├────────────────────────┤       ├──────────────────────────────┤
│ idLead       UUID PK   │──1:N──│ idLeadActivity   UUID PK     │
│ nameLead               │       │ leadId           FK -> leads │
│ emailLead              │       │ typeLeadActivity  enum       │
│ phoneLead    opcional  │       │ noteLeadActivity             │
│ sourceLead   opcional  │       │ createdAtLeadActivity        │
│ statusLead   enum      │       └──────────────────────────────┘
│ createdAtLead          │
│ updatedAtLead          │
└────────────────────────┘
```

### Tabla: users

| Campo | Tipo | Restricciones |
|---|---|---|
| idUser | UUID | PK, default uuid() |
| emailUser | String | unique, not null |
| passwordHashUser | String | not null (bcrypt) |
| createdAtUser | DateTime | default now() |
| updatedAtUser | DateTime | auto-updated |

### Tabla: leads

| Campo | Tipo | Restricciones |
|---|---|---|
| idLead | UUID | PK, default uuid() |
| nameLead | String | not null |
| emailLead | String | not null, no unique |
| phoneLead | String? | nullable |
| sourceLead | String? | nullable |
| statusLead | LeadStatus | default nuevo |
| createdAtLead | DateTime | default now() |
| updatedAtLead | DateTime | auto-updated |

### Tabla: lead_activities

| Campo | Tipo | Restricciones |
|---|---|---|
| idLeadActivity | UUID | PK, default uuid() |
| leadId | UUID | FK -> leads.idLead, onDelete: Cascade |
| typeLeadActivity | LeadActivityType | not null |
| noteLeadActivity | String? | nullable |
| createdAtLeadActivity | DateTime | default now() |

### Enums

**LeadStatus:**

| Valor | Descripcion |
|---|---|
| `nuevo` | Lead recien ingresado al sistema |
| `contactado` | Se realizo contacto inicial |
| `calificado` | Lead con potencial confirmado |
| `perdido` | Lead descartado |
| `convertido` | Lead convertido a cliente |

**LeadActivityType:**

| Valor | Origen | Descripcion |
|---|---|---|
| `note` | Manual (usuario via API) | Nota libre registrada por el agente |
| `status_change` | Automatico (sistema) | Registro de cada cambio de estado |
| `webhook` | Automatico (sistema) | Lead creado a traves de webhook externo |

### Indices de base de datos

| Tabla | Campo | Justificacion |
|---|---|---|
| leads | emailLead | Filtrado por email con ILIKE |
| leads | statusLead | Filtrado por estado (enum) |
| leads | sourceLead | Filtrado por fuente |
| leads | createdAtLead | Filtrado por rango de fechas |
| lead_activities | leadId | Join para timeline de actividades |
| lead_activities | createdAtLeadActivity | Ordenamiento cronologico |

### Seed de datos

El script `prisma/seed.ts` crea un usuario administrador de desarrollo usando `@faker-js/faker` con locale `fakerES_MX` para datos de leads de ejemplo.

- **Email:** `admin@example.com`
- **Password:** `admin12345`

---

## 5. Endpoints completos

### Base URL

```
http://localhost:3000
```

### Tabla de endpoints

| Metodo | Ruta | Autenticacion | Descripcion |
|---|---|---|---|
| GET | `/api/health` | Publica | Estado de la API |
| GET | `/docs` | Publica | Swagger UI interactivo |
| POST | `/api/auth/login` | Publica (rate limit) | Login, retorna JWT |
| GET | `/api/auth/me` | JWT Bearer | Datos del usuario autenticado |
| POST | `/api/leads` | JWT Bearer | Crear lead |
| GET | `/api/leads` | JWT Bearer | Listar leads con filtros y paginacion |
| GET | `/api/leads/:id` | JWT Bearer | Obtener lead por UUID |
| PATCH | `/api/leads/:id` | JWT Bearer | Actualizar campos de un lead |
| DELETE | `/api/leads/:id` | JWT Bearer | Eliminar lead (cascade activities) |
| PATCH | `/api/leads/:id/status` | JWT Bearer | Cambiar estado del lead |
| POST | `/api/leads/:id/activities` | JWT Bearer | Registrar nota manual |
| GET | `/api/leads/:id/activities` | JWT Bearer | Listar timeline de actividades |
| POST | `/api/webhooks/leads` | API Key (x-api-key) | Crear lead desde fuente externa |

### Filtros disponibles en GET /api/leads

| Parametro | Tipo | Descripcion |
|---|---|---|
| `email` | string | Busqueda parcial insensible a mayusculas |
| `status` | LeadStatus enum | Filtro exacto por estado |
| `source` | string | Busqueda parcial por fuente |
| `from` | ISO datetime | Fecha inicio del rango (createdAtLead) |
| `to` | ISO datetime | Fecha fin del rango (createdAtLead) |
| `page` | integer | Pagina (default: 1) |
| `limit` | integer | Resultados por pagina (default: 20, max: 100) |

### Formato estandar de respuestas

**Exito:**

```json
{
  "success": true,
  "data": {}
}
```

**Error de validacion:**

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    { "field": "emailLead", "message": "Invalid email" }
  ]
}
```

**Error operacional:**

```json
{
  "success": false,
  "message": "Lead no encontrado"
}
```

**Respuesta paginada (GET /api/leads):**

```json
{
  "success": true,
  "data": {
    "data": [...],
    "meta": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  }
}
```

### Codigos HTTP utilizados

| Codigo | Uso |
|---|---|
| 200 | Operacion exitosa |
| 201 | Recurso creado |
| 400 | Validacion fallida o constraint violado |
| 401 | No autenticado (JWT ausente, invalido o expirado) |
| 404 | Recurso no encontrado |
| 409 | Conflicto (unique constraint) |
| 429 | Rate limit excedido |
| 500 | Error interno no controlado |

---

## 6. Validaciones implementadas

### Auth

| Campo | Reglas |
|---|---|
| email | trim, formato email valido, max 255 caracteres |
| password | min 1 caracter, max 128 caracteres |

- Rate limit en `POST /api/auth/login`: 5 intentos por minuto por IP. Responde 429 al exceder.
- JWT payload validado con Zod en el middleware de autenticacion. Verifica que `idUser` sea UUID valido y `emailUser` sea email valido, ademas de verificar la firma criptografica.

### Leads (crear y actualizar)

| Campo | Reglas |
|---|---|
| nameLead | trim, min 1 caracter, max 100 caracteres, requerido en creacion |
| emailLead | trim, formato email valido, max 255 caracteres, requerido en creacion |
| phoneLead | regex: solo digitos, `+`, espacios, guiones y parentesis; max 20 caracteres; opcional |
| sourceLead | trim, toLowerCase, max 50 caracteres; opcional |

- `PATCH /api/leads/:id`: requiere al menos 1 campo en el body. Retorna 400 si el body llega vacio.
- Body limit global de 10 kb en `express.json()`.

### Filtros de leads (query params)

| Parametro | Reglas |
|---|---|
| status | Debe ser uno de los valores del enum `LeadStatus` |
| from | ISO datetime valido; debe ser <= fecha actual |
| to | ISO datetime valido |
| from/to combinados | `from` debe ser <= `to` (validacion con `.refine()`) |
| limit | Entero positivo, max 100 |

### Activities

| Campo | Reglas |
|---|---|
| type | Solo acepta el literal `note`. Los tipos `status_change` y `webhook` son registros automaticos del sistema; el endpoint manual los rechaza. |
| note | trim, min 1 caracter, max 2000 caracteres, requerido |

### Webhooks

| Campo | Reglas |
|---|---|
| name | trim, min 1 caracter, max 100 caracteres, requerido |
| email | trim, formato email valido, max 255 caracteres, requerido |
| phone | mismo regex que leads; opcional |
| source | trim, toLowerCase, max 50 caracteres; opcional |

- Autenticacion con `crypto.timingSafeEqual` para prevenir timing attacks en la comparacion del API Key.

---

## 7. Seguridad

| Capa | Mecanismo | Detalle |
|---|---|---|
| Autenticacion de usuario | JWT Bearer (HS256) | Todos los endpoints de negocio requieren token valido |
| Validacion del payload JWT | Zod | Se valida estructura del payload decodificado, no solo la firma |
| Autenticacion de webhook | API Key en header `x-api-key` | Comparacion con `crypto.timingSafeEqual` |
| Brute force en login | express-rate-limit | 5 intentos/min por IP, responde 429 |
| Payload flooding | Body limit | `express.json({ limit: '10kb' })` global |
| Headers HTTP | Helmet | Cabeceras de seguridad estandar (X-Frame-Options, CSP, etc.) |
| CORS | cors middleware | Configurable por entorno |
| Errores de base de datos | Prisma error handler | P2002 -> 409, P2025 -> 404, P2003 -> 400. No expone detalles internos al cliente |
| Variables de entorno | Zod en env.ts | Falla al arranque si faltan variables criticas |
| Contrasenas | bcryptjs | Hash con salt rounds configurable |

---

## 8. Decisiones tecnicas

### DEC-001: Express + Prisma sobre NestJS

**Fecha:** 2026-06-23

Express mantiene la API simple sin abstracciones innecesarias. Prisma facilita migraciones y modelos con excelente DX. NestJS y TypeORM agregan complejidad desproporcionada para el alcance de 72 horas.

### DEC-002: Arquitectura modular por dominio

**Fecha:** 2026-06-23

Carpetas por dominio (`auth/`, `leads/`, `activities/`, `webhooks/`) con cuatro archivos por modulo: routes, controller, service, schema. Separa responsabilidades, facilita navegacion del codigo y permite trabajar en paralelo sin conflictos.

### DEC-003: API Key para webhook

**Fecha:** 2026-06-23

Se eligio API Key simple en header `x-api-key`. OAuth 2.0 y HMAC signature agregan complejidad sin beneficio proporcional en el alcance del MVP.

### DEC-004: Zod para validaciones

**Fecha:** 2026-06-23

Integracion nativa con TypeScript, inferencia de tipos automatica desde los schemas, sintaxis declarativa. Elimina la necesidad de definir tipos separados de las reglas de validacion.

### DEC-005: Docker multi-stage para desarrollo y produccion

**Fecha:** 2026-06-23

Stage `dev` monta codigo fuente con `tsx watch` para hot-reload. Stage `prod` compila TypeScript y arranca `node dist/server.js`. El override `docker-compose.prod.yml` activa el stage de produccion. Reduce imagen final y garantiza entorno reproducible con un solo comando.

### DEC-006: Email de lead no tiene constraint unique

**Fecha:** 2026-06-25

Un mismo contacto puede enviar multiples formularios desde distintas fuentes (landing page, formulario web, referido). Restringir por email impediria capturar todos los puntos de contacto. Alternativa descartada: unique con upsert.

### DEC-007: Hard delete con cascade

**Fecha:** 2026-06-25

`DELETE /api/leads/:id` elimina permanentemente el lead y todas sus actividades asociadas via `onDelete: Cascade` en Prisma. Soft delete con campo `deletedAt` queda fuera del alcance del MVP.

### DEC-008: Rate limiter aislado por instancia de app

**Fecha:** 2026-06-25

El rate limiter de login se instancia dentro de la factory `createAuthRoutes()` en lugar de ser un modulo singleton. Esto evita que el store compartido del rate limiter acumule contadores entre tests, lo cual causaba falsos positivos de 429 en la suite de pruebas.

---

## 9. Fases del proyecto

### Fase 1 - Setup inicial (2026-06-23)

Estructura base del proyecto: `tsconfig.json`, `package.json`, ESLint, Prettier, Dockerfile multi-stage, `docker-compose.yml`, `docker-compose.prod.yml`, `.dockerignore`, schema de Prisma inicial, conexion a PostgreSQL, seed basico.

### Fase 2 - Autenticacion JWT (2026-06-24)

Implementacion de `POST /api/auth/login` con validacion Zod, bcrypt para verificacion de contrasena, generacion de JWT firmado. Middleware `auth.middleware.ts` para proteger rutas privadas con Bearer token. Endpoint `GET /api/auth/me`. Middleware global de errores. Configuracion de Swagger UI en `/docs`. Health check en `/api/health`.

### Fase 3 - CRUD de Leads (2026-06-24)

CRUD completo: crear, listar, obtener por ID, actualizar, eliminar y cambiar estado. Filtros por email, estado, fuente y rango de fechas. Paginacion con `page` y `limit`. Validacion de UUID en parametros de ruta. Middleware `validateQuery` para query params. Swagger JSDoc para todos los endpoints.

### Fase 4 - Actividades y Webhooks (2026-06-24)

Timeline de actividades manuales (`POST /api/leads/:id/activities` con `type: note`). Registro automatico de `status_change` al ejecutar `PATCH /api/leads/:id/status`. Endpoint `GET /api/leads/:id/activities`. Webhook externo `POST /api/webhooks/leads` con autenticacion por API Key, crea lead y registra actividad de tipo `webhook` automaticamente.

### Fase 5 - Validaciones y QA (2026-06-25)

Revision de QA con 15 hallazgos de seguridad y robustez. Hardening de schemas Zod (trim, max length, phone regex, toLowerCase). Limite de body a 10 kb. Rate limiting en login (5/min). Manejo centralizado de errores Prisma en middleware global. Validacion del payload JWT con Zod. Comparacion timing-safe en webhook. Restriccion de `type` a `note` en actividades manuales. Validacion de rango `from <= to` con refine. Documentacion completa en Swagger. 18 tests adicionales de QA.

### Fase 6 - Testing y entrega (2026-06-25)

Verificacion de instalacion limpia desde cero. Fix de configuracion ESLint (`tsconfig.eslint.json` para incluir archivos de tests y configuracion). README definitivo con instrucciones completas. Documentacion tecnica final. Tag `v1.0.0`. Total: 80 tests / 4 suites, todos en verde.

---

## 10. Testing

### Alcance

| Suite | Archivo | Descripcion |
|---|---|---|
| Auth | `tests/auth.test.ts` | Login, JWT, rate limiting, validaciones de schema |
| Leads | `tests/leads.test.ts` | CRUD completo, filtros, paginacion, validaciones de campos |
| Activities | `tests/activities.test.ts` | Creacion de notas, validaciones, timeline |
| Webhooks | `tests/webhooks.test.ts` | Autenticacion API Key, validaciones de payload |

**Total: 80 tests / 4 suites / 100% verdes**

### Estrategia

- Framework: **Jest** con entorno `node`.
- HTTP client: **Supertest** sobre `createApp()`. No se levanta un servidor real; no se usan mocks de base de datos.
- Base de datos: **PostgreSQL real** (no mocks). Se requiere `DATABASE_URL` apuntando a una instancia corriendo.
- Aislamiento: cada ejecucion genera un `testRunId` UUID unico. Todos los registros creados en los tests incluyen este identificador para facilitar la limpieza.
- Limpieza: `afterAll` elimina todos los registros del `testRunId` de la ejecucion actual.
- Ejecucion secuencial: `--runInBand` para evitar conflictos de escritura concurrente en la base de datos.

### Ejecucion

```bash
# Todos los tests (desde host, requiere PostgreSQL en localhost:5433)
DATABASE_URL="postgresql://frenzy_crm:frenzy_crm_password@localhost:5433/frenzy_crm?schema=public" npm test

# Suite especifica
DATABASE_URL="..." npm test -- tests/leads.test.ts
```

### Cobertura funcional

Los tests verifican, entre otros casos:

- Login exitoso retorna JWT con estructura correcta.
- Login fallido con credenciales incorrectas retorna 401.
- Rate limit en login: 6to intento retorna 429.
- Acceso sin token retorna 401.
- Token invalido retorna 401.
- Crear lead con todos los campos validos retorna 201.
- Crear lead con email invalido retorna 400 con campo especifico.
- Crear lead con telefono invalido retorna 400.
- Crear lead con campo excediendo longitud maxima retorna 400.
- Listar leads retorna estructura paginada.
- Filtros por email, status, source y rango de fechas.
- Paginacion: `page` y `limit`.
- Rango de fechas invalido (`from > to`) retorna 400.
- Obtener lead inexistente retorna 404.
- Actualizar lead con body vacio retorna 400.
- Cambio de estado registra actividad `status_change` automaticamente.
- Webhook con API Key valida crea lead y registra actividad `webhook`.
- Webhook sin API Key retorna 401.
- Webhook con API Key invalida retorna 401.
- Actividad manual con `type` distinto a `note` retorna 400.
- Nota mayor a 2000 caracteres retorna 400.

---

## 11. Multi-agent workflow

El proyecto fue desarrollado bajo un flujo de trabajo colaborativo entre tres agentes:

| Agente | Rol | Responsabilidades |
|---|---|---|
| **Codex** | Implementador | Codigo, configuraciones, Prisma, migraciones, tests |
| **Claude Code** | Arquitecto / Revisor / QA | Documentacion, revision tecnica, hallazgos de seguridad, propuestas |
| **Copilot** | Documentacion | Generacion de archivos de documentacion tecnica |

### Reglas del flujo

- Codex implementa. Claude Code revisa posteriormente.
- Claude Code entrega hallazgos y correcciones requeridas; no modifica codigo salvo autorizacion explicita del humano.
- Todo cambio de codigo pasa por Codex.
- Ningun agente crea ramas de Git sin autorizacion explicita del humano.
- Ningun agente introduce dependencias sin justificacion documentada.

### Ejemplo del flujo en Fase 5

1. Claude Code realizo revision de QA y detecto 15 hallazgos (seguridad, validaciones, robustez).
2. Codex implemento las correcciones (hardening de schemas, rate limit, timing-safe, body limit, JWT payload validation).
3. Claude Code genero tests de validacion individuales y corrigio la colision del rate limiter entre tests (factory `createAuthRoutes`).
4. Resultado: 80 tests en verde, sin regressions.

---

## 12. Docker

### Desarrollo (por defecto)

```bash
docker compose up --build
```

Levanta `api` + `postgres`. El entrypoint ejecuta en orden:

1. `prisma migrate deploy`
2. `tsx prisma/seed.ts`
3. `tsx watch src/server.ts` (hot-reload)

La API queda disponible en `http://localhost:3000`.

### Produccion

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

El override activa el build multi-stage completo. El entrypoint de produccion ejecuta:

1. `prisma migrate deploy`
2. `tsx prisma/seed.ts`
3. `node dist/server.js`

### Notas importantes

- El archivo `.env` se monta via `env_file`. No incluye `DATABASE_URL` para que Docker Compose resuelva la conexion interna (`postgres:5432`). Los tests desde el host usan `localhost:5433`.
- `docker/entrypoint.dev.sh` y `entrypoint.prod.sh` deben tener terminaciones de linea LF (no CRLF) para ejecutarse en Alpine Linux.
- `.dockerignore` excluye `node_modules`, `dist`, `.git`, archivos `.env` reales y documentacion Markdown.

---

## 13. Variables de entorno

| Variable | Descripcion | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Cadena de conexion a PostgreSQL | `postgresql://user:pass@host:5432/db?schema=public` |
| `JWT_SECRET` | Clave secreta para firmar JWT | string largo y aleatorio |
| `JWT_EXPIRES_IN` | Duracion del token JWT | `7d` |
| `WEBHOOK_SECRET` | API Key para el endpoint de webhook | string largo y aleatorio |
| `PORT` | Puerto de escucha de la API | `3000` |
| `NODE_ENV` | Entorno de ejecucion | `development` / `production` |

Todas las variables son validadas con Zod en `src/config/env.ts` al arranque del proceso. Si falta alguna variable critica, la aplicacion falla con un mensaje claro antes de iniciar.

---

## 14. Estado final del proyecto

### Entregables completados

| Entregable | Estado |
|---|---|
| API REST funcional con todos los endpoints del MVP | Completo |
| Autenticacion JWT (login + me) | Completo |
| CRUD de leads con filtros y paginacion | Completo |
| Cambio de estado de leads | Completo |
| Timeline de actividades y notas manuales | Completo |
| Registro automatico de status_change | Completo |
| Webhook externo con API Key | Completo |
| Validaciones exhaustivas con Zod | Completo |
| Seguridad: rate limit, timing-safe, body limit, JWT payload validation | Completo |
| Manejo centralizado de errores (AppError + Prisma errors) | Completo |
| 80 tests automatizados / 4 suites / 100% verdes | Completo |
| Swagger UI interactivo en `/docs` | Completo |
| Docker reproducible (desarrollo y produccion) | Completo |
| Seed con usuario demo | Completo |
| README completo con instrucciones de instalacion | Completo |
| Documentacion tecnica en docs/ (10 archivos) | Completo |
| Tag v1.0.0 | Completo |

### Fuera del alcance (no implementado por diseno)

- Frontend o dashboard.
- Roles avanzados (el sistema tiene un unico nivel de usuario autenticado).
- Recuperacion de contrasena.
- Notificaciones.
- Soft delete (se implemento hard delete con cascade).
- OAuth 2.0 o HMAC para webhooks.
- Multi-tenancy.
