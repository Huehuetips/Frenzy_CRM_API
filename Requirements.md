# Plan Técnico Inicial — API REST Mini CRM de Leads

## 1. Repaso y alcance

### Objetivo

Construir una **API REST simple, limpia y segura** para administrar leads de un mini CRM.

La API permitirá:

* Autenticación básica con **JWT**.
* CRUD de leads.
* Cambio de estado de leads.
* Filtros por email, estado, fuente y fechas.
* Registro de notas o actividades.
* Webhook para recibir leads externos.
* Validaciones, errores claros y documentación.

### Alcance del MVP

Incluye:

* API REST funcional.
* Base de datos relacional.
* Migraciones.
* Documentación de endpoints.
* README completo.
* Manejo básico de seguridad.
* Estructura clara del proyecto.

### Fuera del MVP

No incluiría:

* Frontend.
* Roles avanzados.
* Recuperación de contraseña.
* Dashboard.
* Notificaciones.
* Integraciones externas reales.
* Colas, microservicios o arquitectura innecesariamente barroca, porque esto es una prueba técnica, no el sistema nervioso de la NASA.

---

## 2. Arquitectura / Stack sugerido

### Stack recomendado

* **Backend:** Node.js + Express + TypeScript
* **Base de datos:** PostgreSQL
* **ORM:** Prisma
* **Auth:** JWT
* **Validaciones:** Zod
* **Documentación:** Swagger
* **Testing opcional:** Jest + Supertest
* **Lint/Format:** ESLint + Prettier

### Justificación

Node.js con TypeScript permite construir rápido sin sacrificar orden. Express mantiene la API simple. Prisma facilita migraciones y modelos claros. PostgreSQL es sólido para filtros, relaciones y fechas.

La arquitectura sería modular:

```txt
src/
  config/
  modules/
    auth/
    leads/
    notes/
    webhooks/
  middlewares/
  utils/
  prisma/
  app.ts
  server.ts
```

Esto evita el clásico “archivo server.js de 900 líneas”, esa criatura mitológica que aparece cuando nadie supervisa.

---

## 3. Fases del proyecto

### Fase 1: Diseño técnico y base del proyecto

Definir estructura, entidades, base de datos y configuración inicial.

### Fase 2: Autenticación y seguridad básica

Implementar login/API auth con JWT y middleware de protección.

### Fase 3: Desarrollo core de leads

Crear CRUD, filtros y cambio de estado.

### Fase 4: Notas, actividades y webhook

Agregar historial por lead y recepción externa de leads.

### Fase 5: Validaciones, errores y documentación

Normalizar respuestas, documentar endpoints y preparar README.

### Fase 6: Testing, revisión y entrega

Probar flujo completo, limpiar código y preparar explicación técnica.

---

## 4. WBS — Desglose detallado

## Fase 1: Diseño técnico y base

### Tareas

* Crear repositorio.
* Inicializar proyecto Node + TypeScript.
* Configurar Express.
* Configurar Prisma.
* Crear archivo `.env.example`.
* Definir modelos de base de datos.

### Entregables

* Proyecto base funcional.
* Conexión a base de datos.
* Migración inicial.

### Modelos sugeridos

```txt
User
- id
- email
- passwordHash
- createdAt

Lead
- id
- name
- email
- phone
- source
- status
- createdAt
- updatedAt

LeadActivity
- id
- leadId
- type
- note
- createdAt
```

Estados válidos:

```txt
nuevo
contactado
calificado
perdido
convertido
```

---

## Fase 2: Autenticación

### Tareas

* Crear endpoint de login.
* Crear seed de usuario inicial o usuario demo.
* Generar JWT.
* Crear middleware `authMiddleware`.
* Proteger endpoints internos.

### Endpoints

```txt
POST /auth/login
```

### Entregables

* Autenticación funcional.
* JWT requerido en rutas privadas.

---

## Fase 3: CRUD de Leads

### Tareas

* Crear lead.
* Listar leads.
* Obtener lead por ID.
* Editar lead.
* Eliminar lead.
* Filtrar leads por:

  * email
  * estado
  * fuente
  * rango de fechas

### Endpoints

```txt
POST   /leads
GET    /leads
GET    /leads/:id
PATCH  /leads/:id
DELETE /leads/:id
PATCH  /leads/:id/status
```

### Entregables

* CRUD completo.
* Filtros funcionales.
* Cambio de estado separado.

---

## Fase 4: Notas, actividades y webhook

### Tareas

* Agregar notas a lead.
* Listar actividades de un lead.
* Crear endpoint webhook público.
* Validar payload del webhook.
* Crear lead desde formulario externo.

### Endpoints

```txt
POST /leads/:id/activities
GET  /leads/:id/activities

POST /webhooks/leads
```

### Seguridad del webhook

Usar API Key en header:

```txt
x-api-key: WEBHOOK_SECRET
```

Esto es simple y suficiente. No necesitamos OAuth interplanetario para recibir un formulario.

### Entregables

* Actividades por lead.
* Webhook funcional y protegido.

---

## Fase 5: Validaciones, errores y documentación

### Tareas

* Validar todos los inputs con Zod.
* Crear middleware global de errores.
* Normalizar respuestas.
* Documentar endpoints con Swagger.
* Crear README.

### Formato de error sugerido

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

### Entregables

* Errores claros.
* Swagger o README de endpoints.
* README con instalación y uso.

---

## Fase 6: Testing y entrega

### Tareas

* Probar manualmente con Postman/Swagger.
* Agregar tests básicos opcionales:

  * Crear lead.
  * Listar leads.
  * Cambiar estado.
  * Crear actividad.
  * Webhook con API key.
* Revisar código.
* Preparar explicación técnica final.

### Entregables

* Repositorio limpio.
* README completo.
* `.env.example`.
* Migraciones.
* Documentación.
* Tests básicos si el tiempo lo permite.

---

## 5. Riesgos y mitigación

| Riesgo                            | Impacto | Mitigación                                                              |
| --------------------------------- | ------: | ----------------------------------------------------------------------- |
| Sobreproducir la solución         |    Alto | Mantener arquitectura modular simple, sin features extra                |
| Falta de tiempo                   |    Alto | Priorizar CRUD, auth, filtros, webhook y README                         |
| Errores en validaciones           |   Medio | Centralizar validaciones con Zod                                        |
| Inconsistencia en respuestas      |   Medio | Usar formato estándar de éxito/error                                    |
| Problemas con base de datos local |   Medio | Incluir SQLite como alternativa o Docker para PostgreSQL                |
| Documentación incompleta          |    Alto | Documentar conforme se desarrolla, no al final como villano improvisado |

---

## 6. Delegación de tareas

## Claude Code

### Ideal para

* Arquitectura general.
* Refactor.
* Validaciones.
* Manejo de errores.
* Revisión de consistencia.

### Tareas

* Crear estructura modular.
* Revisar diseño de carpetas.
* Implementar middleware global de errores.
* Revisar naming, separación de responsabilidades y limpieza.

---

## Codex

### Ideal para

* Generación rápida de código.
* Endpoints.
* Prisma.
* Tests.

### Tareas

* Implementar modelos Prisma.
* Crear migraciones.
* Crear CRUD de leads.
* Crear endpoint de cambio de estado.
* Crear endpoints de actividades.
* Crear tests con Jest/Supertest.

---

## GitHub Copilot

### Ideal para

* Autocompletado.
* DTOs.
* Validaciones repetitivas.
* Documentación técnica.

### Tareas

* Completar schemas de Zod.
* Ayudar con controladores.
* Generar ejemplos de Swagger.
* Completar README.
* Sugerir snippets de Postman/requests.

---

## Priorización para 72 horas

### Día 1

* Setup del proyecto.
* Prisma y base de datos.
* Auth JWT.
* CRUD básico de leads.

### Día 2

* Filtros.
* Cambio de estado.
* Actividades/notas.
* Webhook con API key.
* Validaciones y errores.

### Día 3

* Swagger/README.
* Tests básicos.
* Revisión final.
* Limpieza del repositorio.
* Preparar explicación técnica.

---

## Criterios de éxito

La prueba se considera completa si permite:

* Autenticarse.
* Crear leads.
* Listar leads con filtros.
* Editar y eliminar leads.
* Cambiar estado.
* Agregar notas.
* Recibir leads externos por webhook.
* Correr migraciones.
* Levantar el proyecto desde README.
* Entender decisiones técnicas sin hacer arqueología digital.

---

## Recomendación final

Construir una solución sobria:

* Pocos endpoints, bien hechos.
* Código legible.
* Validaciones claras.
* Seguridad básica suficiente.
* README muy bien explicado.
* Swagger si da tiempo, README/Postman si no.

La clave no es impresionar con complejidad, sino demostrar criterio. En una prueba de 72 horas, el exceso técnico suele oler menos a seniority y más a ansiedad con teclado.
