# Contrato de API

## Base URL

```bash
http://localhost:3000
```

## Autenticacion

Todos los endpoints (excepto `/api/auth/login`, `/api/health` y `/webhooks/*`) requieren header:

```bash
Authorization: Bearer <JWT_TOKEN>
```

---

## Endpoints

### Health

| Metodo | Ruta | Descripcion |
| ------ | ---- | ----------- |
| GET | `/api/health` | Verificar estado de la API |

### Auth

| Metodo | Ruta | Descripcion |
| ------ | ---- | ----------- |
| POST | `/api/auth/login` | Login con email y password, retorna JWT |

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

**Response 400:**

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

**Response 401:**

```json
{
  "success": false,
  "message": "Credenciales invalidas"
}
```

### Leads

| Metodo | Ruta | Descripcion |
| ------ | ---- | ----------- |
| POST | `/api/leads` | Crear lead |
| GET | `/api/leads` | Listar leads (con filtros) |
| GET | `/api/leads/:id` | Obtener lead por ID |
| PATCH | `/api/leads/:id` | Editar lead |
| DELETE | `/api/leads/:id` | Eliminar lead |
| PATCH | `/api/leads/:id/status` | Cambiar estado del lead |

**Filtros disponibles (query params en GET /api/leads):**

| Param | Tipo | Descripcion |
| ----- | ---- | ----------- |
| `email` | string | Filtrar por email (parcial) |
| `status` | string | Filtrar por estado |
| `source` | string | Filtrar por fuente |
| `from` | string (ISO date) | Fecha inicio (createdAt) |
| `to` | string (ISO date) | Fecha fin (createdAt) |
| `page` | number | Pagina (default: 1) |
| `limit` | number | Resultados por pagina (default: 20, max: 100) |

**Response GET /api/leads:**

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

**Request body (POST /api/leads):**

```json
{
  "name": "Juan Perez",
  "email": "juan@example.com",
  "phone": "+521234567890",
  "source": "landing_page"
}
```

**Request body (PATCH /api/leads/:id/status):**

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
