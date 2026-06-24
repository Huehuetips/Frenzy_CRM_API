# Fase 3: CRUD de Leads

**Estado:** Completada

## Objetivo

Crear el CRUD completo de leads con filtros y cambio de estado.

## Tareas

- [x] Proteger todos los endpoints de leads con authMiddleware
- [x] Crear lead (`POST /api/leads`)
- [x] Listar leads con paginacion (`GET /api/leads`)
- [x] Obtener lead por ID (`GET /api/leads/:id`)
- [x] Editar lead (`PATCH /api/leads/:id`)
- [x] Eliminar lead (`DELETE /api/leads/:id`)
- [x] Cambiar estado de lead (`PATCH /api/leads/:id/status`)
- [x] Implementar filtros por query params:
  - [x] Filtro por email (busqueda parcial)
  - [x] Filtro por estado
  - [x] Filtro por fuente
  - [x] Filtro por rango de fechas (from/to)
- [x] Validar todos los inputs con Zod

## Endpoints

| Metodo | Ruta | Descripcion |
| -------- | ------ | ------------- |
| POST | `/api/leads` | Crear lead |
| GET | `/api/leads` | Listar leads con filtros |
| GET | `/api/leads/:id` | Obtener lead por ID |
| PATCH | `/api/leads/:id` | Editar lead |
| DELETE | `/api/leads/:id` | Eliminar lead |
| PATCH | `/api/leads/:id/status` | Cambiar estado |

## Estructura de archivos esperada

```bash
src/modules/leads/
  leads.controller.ts  — Handlers de cada endpoint
  leads.service.ts     — Logica de negocio y queries
  leads.schema.ts      — Schemas Zod para validacion
  leads.routes.ts      — Definicion de rutas
```

## Estados validos

`nuevo` → `contactado` → `calificado` → `convertido`/`perdido`

## Entregables

- CRUD completo funcional
- Filtros operativos por email, estado, fuente y fechas
- Cambio de estado como endpoint separado
- Validaciones en todos los inputs
