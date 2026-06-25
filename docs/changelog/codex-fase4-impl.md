Implementé la Fase 4 completa:

- Módulo `activities` con schema, service, controller y routes.
- Auto-registro de actividad `status_change` al cambiar estado del lead.
- Middleware `webhookAuthMiddleware`.
- Módulo `webhooks` con creación de lead y actividad tipo `webhook`.
- Registro de rutas en `src/app.ts`.
- `apiKeyAuth` agregado en Swagger.
- Log creado en `docs/changelog/codex-fase4-impl.md`.

Verificación solicitada ejecutada:

```bash
node node_modules/typescript/bin/tsc --noEmit
```

Resultado: compilación sin errores.

No ejecuté tests, según la instrucción.