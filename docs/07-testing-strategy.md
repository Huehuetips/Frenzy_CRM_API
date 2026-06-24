# Estrategia de Testing

## Stack

- **Framework:** Jest
- **HTTP:** Supertest
- **Entorno:** Node (`testEnvironment: 'node'`)

## Estructura

```
tests/
  auth.test.ts       → Login y JWT
  leads.test.ts      → CRUD y filtros de leads
  webhooks.test.ts   → Webhook con API key
```

## Casos de prueba planificados

### Auth (`auth.test.ts`)
- Login exitoso con credenciales validas → retorna JWT
- Login fallido con password incorrecto → 401
- Login fallido con email inexistente → 401
- Acceso a ruta protegida sin token → 401
- Acceso a ruta protegida con token invalido → 401

### Leads (`leads.test.ts`)
- Crear lead con datos validos → 201
- Crear lead con datos incompletos → 400
- Listar leads → 200 + array
- Obtener lead por ID → 200
- Obtener lead con ID inexistente → 404
- Editar lead → 200
- Eliminar lead → 200
- Cambiar estado de lead → 200
- Cambiar a estado invalido → 400
- Filtrar leads por email → resultados filtrados
- Filtrar leads por estado → resultados filtrados
- Filtrar leads por fuente → resultados filtrados
- Filtrar leads por rango de fechas → resultados filtrados

### Webhooks (`webhooks.test.ts`)
- Crear lead con API key valida → 201
- Crear lead sin API key → 401
- Crear lead con API key invalida → 401
- Crear lead con payload incompleto → 400

## Ejecucion

```bash
# Todos los tests
npm test

# Un archivo especifico
npx jest tests/auth.test.ts
```

## Notas

- Los tests son opcionales dentro del MVP pero recomendados.
- Se ejecutan secuencialmente (`--runInBand`) para evitar conflictos con la base de datos.
- Se recomienda usar una base de datos de prueba separada configurada en `.env.test`.
