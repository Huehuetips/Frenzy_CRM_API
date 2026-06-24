# Fase 1: Diseño tecnico y base del proyecto

**Estado:** Completada

## Objetivo

Definir estructura, entidades, base de datos y configuracion inicial.

## Tareas

- [x] Crear repositorio
- [x] Inicializar proyecto Node + TypeScript
- [x] Configurar Express (app.ts + server.ts)
- [x] Configurar Prisma con PostgreSQL
- [x] Crear archivo `.env.example`
- [x] Definir modelos de base de datos (User, Lead, LeadActivity)
- [x] Configurar ESLint + Prettier
- [x] Configurar Jest
- [x] Crear Dockerfile multi-stage
- [x] Crear docker-compose.yml
- [x] Crear seed de usuario demo
- [x] Crear estructura modular de carpetas

## Entregables

- Proyecto base funcional con estructura modular
- Conexion a base de datos configurada
- Migracion inicial con modelos User, Lead, LeadActivity
- Docker listo para levantar entorno completo
- Validacion de variables de entorno con Zod

## Archivos principales creados

- `src/app.ts` — Configuracion de Express
- `src/server.ts` — Entry point
- `src/config/env.ts` — Validacion de env vars
- `src/shared/prisma.ts` — Cliente Prisma
- `prisma/schema.prisma` — Modelos de BD
- `prisma/seed.ts` — Seed de usuario demo
- `Dockerfile` — Build multi-stage
- `docker-compose.yml` — API + PostgreSQL
