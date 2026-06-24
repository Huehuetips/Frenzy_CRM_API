# Fase 3: CRUD de Leads

**Estado:** Pendiente

## Objetivo

Crear el CRUD completo de leads con filtros y cambio de estado.

## Tareas

- [ ] Crear lead (`POST /leads`)
- [ ] Listar leads con paginacion (`GET /leads`)
- [ ] Obtener lead por ID (`GET /leads/:id`)
- [ ] Editar lead (`PATCH /leads/:id`)
- [ ] Eliminar lead (`DELETE /leads/:id`)
- [ ] Cambiar estado de lead (`PATCH /leads/:id/status`)
- [ ] Implementar filtros por query params:
  - [ ] Filtro por email (busqueda parcial)
  - [ ] Filtro por estado
  - [ ] Filtro por fuente
  - [ ] Filtro por rango de fechas (from/to)
- [ ] Validar todos los inputs con Zod

## Endpoints

| Metodo | Ruta | Descripcion |
| -------- | ------ | ------------- |
| POST | `/leads` | Crear lead |
| GET | `/leads` | Listar leads con filtros |
| GET | `/leads/:id` | Obtener lead por ID |
| PATCH | `/leads/:id` | Editar lead |
| DELETE | `/leads/:id` | Eliminar lead |
| PATCH | `/leads/:id/status` | Cambiar estado |

## Estructura de archivos esperada

```bash
src/modules/leads/
  leads.controller.ts  — Handlers de cada endpoint
  leads.service.ts     — Logica de negocio y queries
  leads.schema.ts      — Schemas Zod para validacion
  leads.routes.ts      — Definicion de rutas
```

## Estados validos

`nuevo` → `contactado` → `calificado` → `convertido`
                                       → `perdido`

## Entregables

- CRUD completo funcional
- Filtros operativos por email, estado, fuente y fechas
- Cambio de estado como endpoint separado
- Validaciones en todos los inputs
