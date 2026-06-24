# Fase 5: Validaciones, errores y documentacion

**Estado:** Pendiente

## Objetivo

Normalizar respuestas, centralizar manejo de errores y documentar endpoints.

## Tareas

### Validaciones

- [ ] Validar todos los inputs con Zod (schemas por modulo)
- [ ] Crear middleware de validacion reutilizable

### Manejo de errores

- [ ] Crear middleware global de errores
- [ ] Normalizar formato de respuestas de error
- [ ] Normalizar formato de respuestas exitosas
- [ ] Manejar errores de Prisma (not found, unique constraint, etc.)

### Documentacion

- [ ] Configurar Swagger con swagger-jsdoc + swagger-ui-express
- [ ] Documentar todos los endpoints con anotaciones JSDoc
- [ ] Endpoint Swagger UI en `/api-docs`

## Formato estandar de respuestas

### Exito

```json
{
  "success": true,
  "data": { }
}
```

### Error

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

## Estructura de archivos esperada

```bash
src/middlewares/
  error.middleware.ts      — Manejo global de errores
  validate.middleware.ts   — Middleware de validacion Zod

src/shared/
  response.ts             — Helpers para formato de respuesta
```

## Entregables

- Errores claros y consistentes en toda la API
- Swagger accesible en `/api-docs`
- Validacion centralizada sin duplicar logica
