# Reglas Generales

## Antes de iniciar

1. Leer [Obsidian](./obsidian/index.md) y obtener documentación.
2. Tener en claro los [Requerimientos](./Requirements.md) principales.
3. Revisar la [Arquitectura](./docs/02-architecture.md) actual.
4. Revisar [cambios recientes](./docs/changelog/CHANGELOG.md).
5. Revisar el [historial de agentes](./docs/changelog/agent-log.md).
6. Verificar la rama actual y confirmar que no exista conflicto con otro agente.
7. Verificar que el nombre de la rama actual y cambios recientes en la rama coincidan con los cambios a realizar.

---

## Flujo de trabajo multi-agente

Este proyecto utiliza múltiples agentes de IA con responsabilidades separadas.

Flujo principal:

1. Codex implementa.
2. Claude Code revisa.
3. Codex corrige observaciones.
4. El responsable humano valida y realiza el commit.

Yo (humano) siempre tendré la decisión final.

---

## Trabajo secuencial

Los agentes no deben modificar simultáneamente los mismos archivos o módulos.

Flujo por defecto:

```txt
Codex implementa → Claude revisa → Codex corrige → Humano valida → Commit
```

---

## Trabajo paralelo

Está permitido únicamente cuando:

* Se utilizan ramas diferentes.
* No existen archivos compartidos.
* No existe superposición funcional.

Ejemplo permitido:

```txt
Codex → feature/leads-crud
Claude → review/documentation
```

Ejemplo NO permitido:

```txt
Codex modifica src/modules/leads/*
Claude modifica src/modules/leads/*
```

---

## Convención de ramas

Utilizar ramas feature independientes.

Ejemplos:

```txt
feature/setup
feature/auth
feature/leads-crud
feature/filters
feature/activities
feature/webhook
feature/tests
review/architecture
review/security
fix/review-feedback
```

---

## Control de alcance

Este proyecto corresponde a una prueba técnica con tiempo limitado.

Priorizar:

* Simplicidad.
* Código limpio.
* Arquitectura clara.
* Fácil explicación técnica.
* Docker funcional.
* Documentación clara.

No agregar:

* Frontend.
* Sistema de roles avanzado.
* Recuperación de contraseña.
* Notificaciones.
* Dashboard administrativo.
* Microservicios.
* Colas.
* Integraciones externas adicionales.
* Funcionalidades no solicitadas.

---

## Prevención de conflictos

Antes de modificar archivos:

1. Identificar qué archivos serán modificados.
2. Verificar que otro agente no esté trabajando sobre ellos.
3. Si existe conflicto potencial, detenerse y solicitar validación humana.
4. No crear ramas de Git o GitHub sin autorización explícita del responsable humano.

---

## Antes de finalizar

1. Actualiza [logs](./docs/changelog/agent-log.md).
2. Actualiza [Cambios funcionales](./docs/changelog/CHANGELOG.md).
3. Actualiza documentación técnica relacionada.
4. Verifica que el proyecto compile correctamente.
5. Verifica que Docker continúe funcionando si se modificó infraestructura.
6. Verifica que las pruebas existentes continúen pasando.
7. Registrar pendientes o riesgos encontrados.
