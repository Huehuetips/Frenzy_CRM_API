# Decision Log

Registro de decisiones tecnicas del proyecto. Cada decision incluye contexto, opciones evaluadas y justificacion.

---

## DEC-001: Stack tecnologico

**Fecha:** 2026-06-23
**Estado:** Aprobada

**Contexto:** Seleccionar el stack para construir la API REST del Frenzy CRM.

**Opciones:**

1. Node.js + Express + TypeScript + Prisma + PostgreSQL
2. NestJS + TypeORM + PostgreSQL
3. Fastify + Drizzle + PostgreSQL

**Decision:** Opcion 1.

**Justificacion:** Express mantiene la API simple sin abstracciones innecesarias. Prisma facilita migraciones y modelos claros con excelente DX. TypeScript aporta seguridad de tipos sin sacrificar velocidad de desarrollo. PostgreSQL es solido para filtros, relaciones y fechas.

---

## DEC-002: Arquitectura modular por dominio

**Fecha:** 2026-06-23
**Estado:** Aprobada

**Contexto:** Definir la estructura del proyecto para evitar archivos monoliticos.

**Decision:** Arquitectura modular con carpetas por dominio (`auth/`, `leads/`, `activities/`, `webhooks/`), cada una con su controller, service y schema de validacion.

**Justificacion:** Separa responsabilidades, facilita la navegacion del codigo y permite trabajar en paralelo sin conflictos.

---

## DEC-003: Seguridad del webhook con API Key

**Fecha:** 2026-06-23
**Estado:** Aprobada

**Contexto:** Proteger el endpoint de webhook para recibir leads externos.

**Opciones:**

1. API Key en header (`x-api-key`)
2. OAuth 2.0
3. HMAC signature

**Decision:** Opcion 1. API Key simple en header.

**Justificacion:** Es suficiente para un MVP. OAuth y HMAC agregan complejidad sin beneficio proporcional en este alcance.

---

## DEC-004: Validaciones con Zod

**Fecha:** 2026-06-23
**Estado:** Aprobada

**Contexto:** Elegir libreria de validacion para inputs de la API.

**Opciones:**

1. Zod
2. Joi
3. class-validator

**Decision:** Zod.

**Justificacion:** Integracion nativa con TypeScript, inferencia de tipos automatica, sintaxis declarativa. Evita duplicar definiciones de tipos.

---

## DEC-005: Docker para desarrollo y despliegue

**Fecha:** 2026-06-23
**Estado:** Aprobada

**Contexto:** Facilitar el setup del proyecto y garantizar entorno reproducible.

**Decision:** Dockerfile multi-stage + docker-compose con servicio de API y PostgreSQL.

**Justificacion:** Permite levantar todo el entorno con un solo comando. El multi-stage reduce el tamano de la imagen de produccion.

---

## DEC-006: Email de lead no es unique

**Fecha:** 2026-06-25
**Estado:** Aprobada

**Contexto:** El modelo Lead permite multiples leads con el mismo email.

**Decision:** No agregar unique constraint en `emailLead`.

**Justificacion:** Un contacto puede enviar multiples formularios desde diferentes fuentes. No restringir permite capturar todos los puntos de contacto.

**Alternativa considerada:** Unique constraint en `emailLead` con upsert.

---

## DEC-007: Hard delete de leads con cascade

**Fecha:** 2026-06-25
**Estado:** Aprobada

**Contexto:** `DELETE /api/leads/:id` elimina permanentemente el lead y todas sus activities asociadas.

**Decision:** Hard delete con eliminacion en cascada via Prisma.

**Justificacion:** Para el MVP no se requiere soft delete. La eliminacion en cascada mantiene integridad referencial sin dejar datos huerfanos.

**Alternativa considerada:** Soft delete con campo `deletedAt` y filtro global.

---

## DEC-008: Rate limiting en login

**Fecha:** 2026-06-25
**Estado:** Aprobada

**Contexto:** El endpoint `POST /api/auth/login` tiene rate limiting de 5 intentos por minuto por IP.

**Decision:** Rate limiting especifico en el endpoint de login.

**Justificacion:** Prevenir ataques de fuerza bruta contra credenciales. 5 intentos por minuto es suficiente para uso legitimo.

**Alternativa considerada:** Rate limiting global en toda la API.

---

## Plantilla para nuevas decisiones

```markdown
## DEC-XXX: Titulo

**Fecha:** YYYY-MM-DD
**Estado:** Propuesta | Aprobada | Rechazada | Reemplazada

**Contexto:** Que problema se resuelve.

**Opciones:**
1. Opcion A
2. Opcion B

**Decision:** Cual se eligio.

**Justificacion:** Por que.
```
