# Fase 4: Notas, actividades y webhook

**Estado:** Completada

## Objetivo

Agregar historial de actividades por lead y endpoint webhook para recibir leads externos.

## Tareas

### Actividades

- [x] Agregar nota/actividad a un lead (`POST /api/leads/:id/activities`)
- [x] Listar actividades de un lead (`GET /api/leads/:id/activities`)
- [x] Registrar automaticamente actividad al cambiar estado de lead

### Webhook

- [x] Crear endpoint webhook publico (`POST /webhooks/leads`)
- [x] Validar API Key en header `x-api-key`
- [x] Validar payload del webhook con Zod
- [x] Crear lead desde formulario externo
- [x] Registrar actividad tipo `webhook` al crear lead

## Endpoints

| Metodo | Ruta | Autenticacion |
| -------- | ------ | --------------- |
| POST | `/leads/:id/activities` | JWT |
| GET | `/leads/:id/activities` | JWT |
| POST | `/webhooks/leads` | API Key (`x-api-key`) |

## Estructura de archivos esperada

```bash
src/modules/activities/
  activities.controller.ts
  activities.service.ts
  activities.schema.ts
  activities.routes.ts

src/modules/webhooks/
  webhooks.controller.ts
  webhooks.service.ts
  webhooks.schema.ts
  webhooks.routes.ts

src/middlewares/
  webhook.middleware.ts    — Verificacion de API Key
```

## Seguridad del webhook

Protegido con API Key en header:

```bash
x-api-key: <WEBHOOK_SECRET>
```

La variable `WEBHOOK_SECRET` se configura en `.env`.

## Entregables

- Actividades CRUD por lead
- Registro automatico de cambios de estado
- Webhook funcional y protegido con API Key
