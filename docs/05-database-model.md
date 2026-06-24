# Modelo de Base de Datos

## Diagrama de entidades

```text
┌──────────────────┐
│      users       │
├──────────────────┤
│ idUser (UUID PK) │
│ emailUser (UQ)   │
│ passwordHashUser │
│ createdAtUser    │
│ updatedAtUser    │
└──────────────────┘

┌───────────────────┐       ┌──────────────────────────┐
│       leads       │       │     lead_activities      │
├───────────────────┤       ├──────────────────────────┤
│ idLead (UUID PK)  │──1:N──│ idLeadActivity (UUID PK) │
│ nameLead          │       │ leadId (FK → Lead.id)    │
│ emailLead         │       │ typeLeadActivity (enum)  │
│ phoneLead?        │       │ noteLeadActivity         │
│ sourceLead?       │       │ createdAtLeadActivity    │
│ statusLead (enum) │       └──────────────────────────┘
│ createdAtLead     │
│ updatedAtLead     │
└───────────────────┘
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
| Leads | `emailLead` | Filtrado por email |
| Leads | `statusLead` | Filtrado por estado |
| Leads | `sourceLead` | Filtrado por fuente |
| Leads | `createdAtLead` | Filtrado por rango de fechas |
| LeadActivities | `leadId` | Join con Lead |
| LeadActivities | `createdAtLeadActivity` | Ordenamiento cronologico |

## Relaciones

- **User**: Independiente. Se usa solo para autenticacion.
- **Leads → LeadActivities**: Un lead tiene muchas actividades. Eliminacion en cascada (`onDelete: Cascade`).

## Seed

Se crea un usuario demo para desarrollo:

- Email: `admin@example.com`
- Password: `admin12345`
