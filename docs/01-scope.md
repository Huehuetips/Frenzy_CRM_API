# Alcance del MVP

## Incluido

- API REST funcional con Node.js + Express + TypeScript
- Base de datos relacional (PostgreSQL) con Prisma ORM
- Autenticación JWT (login + middleware de protección)
- CRUD completo de leads
- Cambio de estado de leads (nuevo, contactado, calificado, perdido, convertido)
- Filtros por email, estado, fuente y rango de fechas
- Registro de notas/actividades por lead
- Webhook para recibir leads externos (protegido con API Key)
- Validaciones con Zod
- Manejo global de errores con formato estandarizado
- Migraciones de base de datos
- Documentación de endpoints (Swagger)
- README completo
- Docker para desarrollo y despliegue

## Fuera del alcance

- Frontend / UI
- Roles avanzados o permisos granulares
- Recuperación de contraseña
- Dashboard o reportes
- Notificaciones (email, push, etc.)
- Integraciones externas reales
- Colas de mensajes, microservicios o arquitectura distribuida

## Criterios de aceptacion

La prueba se considera completa si permite:

1. Autenticarse con JWT
2. Crear, listar, editar y eliminar leads
3. Listar leads con filtros (email, estado, fuente, fechas)
4. Cambiar estado de un lead
5. Agregar notas/actividades a un lead
6. Recibir leads externos por webhook
7. Correr migraciones sin errores
8. Levantar el proyecto completo desde el README
