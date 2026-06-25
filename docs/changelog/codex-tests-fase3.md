# Codex Tests Fase 3

- Agregados tests de filtro de leads por rango `from/to` con `createdAtLead` explicito.
- Agregado test de error para `from` con formato invalido.
- Agregado test de creacion de lead solo con `nameLead` y `emailLead`, validando opcionales en `null`.
- Agregados tests de validacion para `emailLead` vacio en POST, `emailLead` invalido en PATCH, `status` invalido en GET, `limit` mayor a 100 en GET y UUID invalido en DELETE.
