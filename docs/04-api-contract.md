# Contrato de API

## Base URL

```bash
http://localhost:3000
```

## Autenticacion

Todos los endpoints (excepto `/auth/login`, `/health` y `/webhooks/*`) requieren header:

```bash
Authorization: Bearer <JWT_TOKEN>
```

---

## Endpoints

### Health

| Metodo | Ruta | Descripcion |
| ------ | ---- | ----------- |
| GET | `/health` | Verificar estado de la API |

### Auth

| Metodo | Ruta | Descripcion |
| ------ | ---- | ----------- |
| POST | `/auth/login` | Login con email y password, retorna JWT |

**Request body:**

```json
{
  "email": "admin@example.com",
  "password": "admin12345"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Leads

| Metodo | Ruta | Descripcion |
| ------ | ---- | ----------- |
| POST | `/leads` | Crear lead |
| GET | `/leads` | Listar leads (con filtros) |
| GET | `/leads/:id` | Obtener lead por ID |
| PATCH | `/leads/:id` | Editar lead |
| DELETE | `/leads/:id` | Eliminar lead |
| PATCH | `/leads/:id/status` | Cambiar estado del lead |

**Filtros disponibles (query params en GET /leads):**

| Param | Tipo | Descripcion |
| ----- | ---- | ----------- |
| `email` | string | Filtrar por email (parcial) |
| `status` | string | Filtrar por estado |
| `source` | string | Filtrar por fuente |
| `from` | string (ISO date) | Fecha inicio (createdAt) |
| `to` | string (ISO date) | Fecha fin (createdAt) |

**Request body (POST /leads):**

```json
{
  "name": "Juan Perez",
  "email": "juan@example.com",
  "phone": "+521234567890",
  "source": "landing_page"
}
```

**Request body (PATCH /leads/:id/status):**

```json
{
  "status": "contactado"
}
```

**Estados validos:** `nuevo`, `contactado`, `calificado`, `perdido`, `convertido`

### Actividades

| Metodo | Ruta | Descripcion |
| ------ | ---- | ----------- |
| POST | `/leads/:id/activities` | Agregar nota/actividad |
| GET | `/leads/:id/activities` | Listar actividades del lead |

**Request body (POST):**

```json
{
  "type": "note",
  "note": "Se contacto por telefono, interesado en producto X"
}
```

### Webhooks

| Metodo | Ruta | Descripcion |
| ------ | ---- | ----------- |
| POST | `/webhooks/leads` | Crear lead desde fuente externa |

**Header requerido:**

```text
x-api-key: <WEBHOOK_SECRET>
```

**Request body:**

```json
{
  "name": "Lead Externo",
  "email": "externo@example.com",
  "phone": "+521234567890",
  "source": "formulario_web"
}
```

---

## Formato de respuestas

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

### Codigos HTTP

| Codigo | Uso |
| ------ | --- |
| 200 | Operacion exitosa |
| 201 | Recurso creado |
| 400 | Validacion fallida |
| 401 | No autenticado |
| 404 | Recurso no encontrado |
| 500 | Error interno |
