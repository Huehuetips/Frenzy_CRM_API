# Agent Guidelines

## Reglas generales

1. No crear features fuera del scope.
2. No modificar arquitectura sin registrar decisión.
3. Todo cambio debe actualizar:
   - CHANGELOG.md
   - agent-log.md
   - documentación relacionada
4. Mantener código simple y legible.
5. Priorizar funcionalidad antes que abstracción excesiva.

## Agentes

### Claude Code

Responsable de arquitectura, refactor y revisión.

### Codex

Responsable de implementación de endpoints, Prisma y tests.

### GitHub Copilot

Responsable de autocompletado, documentación y schemas repetitivos.

## Formato obligatorio de registro

Cada agente debe documentar:

- Fecha
- Hora
- Agente
- Archivos modificados
- Cambio realizado
- Motivo
- Riesgos o pendientes
