# Fase 2: Autenticacion y seguridad basica

**Estado:** Pendiente

## Objetivo

Implementar login con JWT y middleware de proteccion para rutas privadas.

## Tareas

- [ ] Crear endpoint `POST /auth/login`
- [ ] Validar credenciales contra usuario en BD
- [ ] Generar JWT con email y id del usuario
- [ ] Crear middleware `authMiddleware` para verificar JWT
- [ ] Proteger todos los endpoints internos (leads, activities)
- [ ] Validar input de login con Zod

## Endpoints

| Metodo | Ruta | Autenticacion |
| -------- | ------ | --------------- |
| POST | `/auth/login` | Publica |

## Estructura de archivos esperada

```text
src/modules/auth/
  auth.controller.ts   — Handler del endpoint de login
  auth.service.ts      — Logica de autenticacion
  auth.schema.ts       — Validacion Zod del input
  auth.routes.ts       — Definicion de rutas

src/middlewares/
  auth.middleware.ts    — Verificacion de JWT
```

## Entregables

- Login funcional que retorna JWT
- Middleware que protege rutas privadas
- Respuestas claras para credenciales invalidas (401)

## Dependencias

- bcryptjs (comparar password)
- jsonwebtoken (generar y verificar JWT)
- Variables de entorno: `JWT_SECRET`, `JWT_EXPIRES_IN`
