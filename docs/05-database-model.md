# Modelo de Base de Datos

## Diagrama de entidades

```text
┌──────────────┐
│     User     │
├──────────────┤
│ id (UUID PK) │
│ email (UQ)   │
│ passwordHash │
│ createdAt    │
│ updatedAt    │
└──────────────┘

┌─────────────────┐       ┌──────────────────────┐
│      Lead       │       │    LeadActivity       │
├─────────────────┤       ├──────────────────────┤
│ id (UUID PK)    │──1:N──│ id (UUID PK)         │
│ name            │       │ leadId (FK → Lead.id) │
│ email           │       │ type (enum)           │
│ phone?          │       │ note                  │
│ source?         │       │ createdAt             │
│ status (enum)   │       └──────────────────────┘
│ createdAt       │
│ updatedAt       │
└─────────────────┘
```

## Enums

### LeadStatus

| Valor | Descripcion |
| ------- | ------------- |
| `nuevo` | Lead recien ingresado |
| `contactado` | Se ha hecho contacto inicial |
| `calificado` | Lead con potencial confirmado |
| `perdido` | Lead descartado |
| `convertido` | Lead convertido a cliente |

### LeadActivityType

| Valor | Descripcion |
| ------- | ------------- |
| `note` | Nota manual del usuario |
| `status_change` | Cambio de estado registrado automaticamente |
| `webhook` | Lead creado via webhook externo |

## Indices

| Tabla | Campo(s) | Justificacion |
| ------- | ---------- | --------------- |
| Lead | `email` | Filtrado por email |
| Lead | `status` | Filtrado por estado |
| Lead | `source` | Filtrado por fuente |
| Lead | `createdAt` | Filtrado por rango de fechas |
| LeadActivity | `leadId` | Join con Lead |
| LeadActivity | `createdAt` | Ordenamiento cronologico |

## Relaciones

- **User**: Independiente. Se usa solo para autenticacion.
- **Lead → LeadActivity**: Un lead tiene muchas actividades. Eliminacion en cascada (`onDelete: Cascade`).

## Seed

Se crea un usuario demo para desarrollo:

- Email: `admin@example.com`
- Password: `admin12345`
