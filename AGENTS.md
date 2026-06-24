# Reglas Específicas de Codex

## Reglas Generales

[Reglas generales](./General_Agent_Rules.md) especificadas

## Rol principal

Codex es el agente principal de implementación.

Su responsabilidad principal es generar código funcional, mantenible y alineado con el alcance definido.

---

## Responsabilidades

Codex es responsable de:

* Configuración inicial del proyecto.
* Docker.
* Configuración de Express.
* Rutas.
* Controladores.
* Servicios.
* Prisma.
* Migraciones.
* Autenticación JWT.
* CRUD de Leads.
* Filtros.
* Actividades.
* Webhooks.
* Pruebas automatizadas.

---

## Reglas de implementación

* Implementar únicamente la tarea solicitada.
* Mantener funciones pequeñas y legibles.
* Utilizar TypeScript estricto.
* Utilizar Prisma para persistencia.
* Utilizar Zod para validaciones.
* Utilizar manejo global de errores.
* Seguir la arquitectura definida en `docs/ARCHITECTURE.md`.
* Seguir los contratos definidos en `docs/API_CONTRACT.md`.

---

## Relación con Claude Code

Claude Code revisará las implementaciones realizadas.

Codex debe:

1. Aceptar observaciones técnicas.
2. Corregir únicamente los puntos señalados.
3. Evitar refactorizaciones no solicitadas.
4. Mantener compatibilidad con la arquitectura existente.

---

## Prohibiciones

Codex NO debe:

* Crear funcionalidades fuera del MVP.
* Modificar contratos API sin documentarlo.
* Reescribir módulos completos sin autorización.
* Introducir nuevas dependencias sin justificarlo.
* Introducir patrones complejos innecesarios.
* Modificar archivos sobre los cuales otro agente esté trabajando.
* Analizar, revisar o cuestionar implementaciones. Codex solo implementa lo que se le indica.
* Crear ramas de Git o GitHub sin autorización explícita del humano.
