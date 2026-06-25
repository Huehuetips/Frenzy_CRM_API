Listo. Quedaron cubiertos los tests de Fase 4 en:

- [tests/activities.test.ts](D:/Frenzy_CRM_API/tests/activities.test.ts:1)
- [tests/webhooks.test.ts](D:/Frenzy_CRM_API/tests/webhooks.test.ts:1)
- [docs/changelog/codex-fase4-tests.md](D:/Frenzy_CRM_API/docs/changelog/codex-fase4-tests.md:1)

Verificación ejecutada:

```powershell
$env:DATABASE_URL='postgresql://frenzy_crm:frenzy_crm_password@localhost:5433/frenzy_crm?schema=public'; npm test
```

Resultado: `4 suites passed`, `62 tests passed`.

También ejecuté `npm run lint`, pero falla por configuración existente de ESLint/tsconfig: `tests/**/*.ts` y `prisma/seed.ts` no están incluidos en `tsconfig.json`, y hay errores previos en middlewares. No modifiqué eso porque queda fuera del alcance pedido.