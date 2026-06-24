# Architecture

## Patrón

Arquitectura modular por dominio.

## Módulos

- auth
- leads
- activities
- webhooks

## Flujo general

Request → Route → Validation → Controller → Service → Repository/Prisma → Response

## Principios

- Separación de responsabilidades
- Validaciones centralizadas
- Manejo global de errores
- Código simple sobre abstracción excesiva
