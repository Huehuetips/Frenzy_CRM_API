# Fase 4: Notas, actividades y webhook

**Estado:** Pendiente

## Objetivo

Agregar historial de actividades por lead y endpoint webhook para recibir leads externos.

## Tareas

### Actividades

- [ ] Agregar nota/actividad a un lead (`POST /leads/:id/activities`)
- [ ] Listar actividades de un lead (`GET /leads/:id/activities`)
- [ ] Registrar automaticamente actividad al cambiar estado de lead

### Webhook

- [ ] Crear endpoint webhook publico (`POST /webhooks/leads`)
- [ ] Validar API Key en header `x-api-key`
- [ ] Validar payload del webhook con Zod
- [ ] Crear lead desde formulario externo
- [ ] Registrar actividad tipo `webhook` al crear lead

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
