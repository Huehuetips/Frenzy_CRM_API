# Fase 5: Validaciones, errores y documentacion

**Estado:** Completada

## Objetivo

Normalizar respuestas, centralizar manejo de errores y documentar endpoints.

## Tareas

### Validaciones

- [x] Validar todos los inputs con Zod (schemas por modulo)
- [x] Crear middleware de validacion reutilizable

### Manejo de errores

- [x] Crear middleware global de errores
- [x] Normalizar formato de respuestas de error
- [x] Normalizar formato de respuestas exitosas
- [x] Manejar errores de Prisma (not found, unique constraint, etc.)

### Documentacion

- [x] Configurar Swagger con swagger-jsdoc + swagger-ui-express
- [x] Documentar todos los endpoints con anotaciones JSDoc
- [x] Endpoint Swagger UI en `/docs`

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
- Swagger accesible en `/docs`
- Validacion centralizada sin duplicar logica
