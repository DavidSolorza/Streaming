# Documento 3: Especificación de Contratos de API RESTful (Supabase PostgREST)

## Resumen Ejecutivo

Este documento define la especificación rigurosa de los contratos de API REST consumidos por el frontend a través del cliente HTTP nativo (`src/core/http/supabaseHttpClient.ts`). La interfaz expone los endpoints generados automáticamente por el motor **PostgREST de Supabase (PostgreSQL 15+)**.

Todas las peticiones incluyen los encabezados obligatorios de autenticación y contenido:
- `apikey: <VITE_SUPABASE_ANON_KEY>`
- `Authorization: Bearer <VITE_SUPABASE_ANON_KEY>`
- `Content-Type: application/json`
- `Prefer: return=representation` (para operaciones de mutación)

---

## 1. Endpoints de Órdenes de Venta (`sales_orders`)

### 1.1. Listar Órdenes de Venta (`GET /rest/v1/sales_orders`)
- **Método HTTP:** `GET`
- **Ruta:** `/rest/v1/sales_orders?select=*&order=created_at.desc`
- **Descripción:** Obtiene la lista completa de órdenes registradas para el cálculo de estadísticas mensuales y conciliación en el panel administrativo.

#### Respuesta Exitosa (`200 OK`):
```json
[
  {
    "id": "c1f7a220-7f28-4034-bc23-88849b3848b1",
    "order_code": "ORD-819201",
    "customer_name": "Carlos Mendoza",
    "customer_contact": "3104567890",
    "total_cop": 48000,
    "status": "completada",
    "payment_method": "nequi",
    "items_summary": "Netflix Original 4K (x1), Spotify (x1)",
    "created_at": "2026-09-30T14:22:10.000Z"
  }
]
```

---

### 1.2. Registrar Nueva Orden (`POST /rest/v1/sales_orders`)
- **Método HTTP:** `POST`
- **Ruta:** `/rest/v1/sales_orders`
- **Descripción:** Registra un nuevo pedido reportado tras el envío de comprobante por WhatsApp.

#### Payload de Entrada (`Content-Type: application/json`):
```json
{
  "order_code": "ORD-938210",
  "customer_name": "Laura Ramírez",
  "customer_contact": "3123456789",
  "total_cop": 35000,
  "status": "pendiente",
  "payment_method": "transferencia",
  "items_summary": "Canva Pro 12 Meses (x1)"
}
```

#### Respuesta Exitosa (`201 Created`):
```json
[
  {
    "id": "e9b2c340-8e12-4f32-ab12-998877665544",
    "order_code": "ORD-938210",
    "customer_name": "Laura Ramírez",
    "customer_contact": "3123456789",
    "total_cop": 35000,
    "status": "pendiente",
    "payment_method": "transferencia",
    "items_summary": "Canva Pro 12 Meses (x1)",
    "created_at": "2026-10-01T16:45:00.000Z"
  }
]
```

---

### 1.3. Actualizar Estado de Orden (`PATCH /rest/v1/sales_orders`)
- **Método HTTP:** `PATCH`
- **Ruta:** `/rest/v1/sales_orders?id=eq.{id}`
- **Descripción:** Cambia el estado de una orden a `validada`, `completada` o `cancelada`.

#### Payload de Entrada:
```json
{
  "status": "completada"
}
```

#### Respuesta Exitosa (`200 OK`):
```json
[
  {
    "id": "e9b2c340-8e12-4f32-ab12-998877665544",
    "status": "completada"
  }
]
```

---

## 2. Endpoints de Reseñas y Testimonios (`reviews`)

### 2.1. Listar Reseñas Aprobadas (`GET /rest/v1/reviews`)
- **Método HTTP:** `GET`
- **Ruta:** `/rest/v1/reviews?select=*&order=created_at.desc`
- **Descripción:** Retorna las reseñas visibles para clientes y para el panel administrativo.

#### Respuesta Exitosa (`200 OK`):
```json
[
  {
    "id": "a1b2c3d4-0001-4000-8000-000000000001",
    "customer_name": "Camila Torres",
    "city": "Bogotá D.C.",
    "product_name": "Canva Pro (12 Meses)",
    "comment": "¡Excelente servicio! Pagué por Nequi mi suscripción de Canva Pro y en menos de 3 minutos ya la tenía activada en mi correo personal.",
    "rating": 5,
    "is_approved": true,
    "initials": "CT",
    "avatar_bg": "bg-teal-500/20 text-teal-700 border-teal-300",
    "created_at": "2026-09-29T10:15:00.000Z"
  }
]
```

---

### 2.2. Publicar Nueva Reseña (`POST /rest/v1/reviews`)
- **Método HTTP:** `POST`
- **Ruta:** `/rest/v1/reviews`
- **Descripción:** Inserta una nueva reseña de usuario o ingresada por el administrador.

#### Payload de Entrada:
```json
{
  "customer_name": "Mateo Bermúdez",
  "city": "Medellín",
  "product_name": "Netflix Original & Disney+",
  "comment": "Llevo 8 meses renovando mis pantallas con JP. La atención por WhatsApp es súper rápida y amigable.",
  "rating": 5,
  "is_approved": true,
  "initials": "MB",
  "avatar_bg": "bg-red-500/20 text-red-700 border-red-300"
}
```

#### Respuesta Exitosa (`201 Created`):
```json
[
  {
    "id": "b2c3d4e5-0002-4000-8000-000000000002",
    "customer_name": "Mateo Bermúdez",
    "rating": 5,
    "is_approved": true,
    "created_at": "2026-10-01T16:50:00.000Z"
  }
]
```

---

### 2.3. Moderar Aprobación de Reseña (`PATCH /rest/v1/reviews`)
- **Método HTTP:** `PATCH`
- **Ruta:** `/rest/v1/reviews?id=eq.{id}`
- **Descripción:** Alterna entre visible (`is_approved: true`) y oculta (`is_approved: false`).

#### Payload de Entrada:
```json
{
  "is_approved": false
}
```

---

### 2.4. Eliminar Reseña (`DELETE /rest/v1/reviews`)
- **Método HTTP:** `DELETE`
- **Ruta:** `/rest/v1/reviews?id=eq.{id}`
- **Descripción:** Elimina definitivamente una reseña de la base de datos.

#### Respuesta Exitosa (`204 No Content` o `200 OK`).

---

## 3. Matriz Estricta de Respuestas y Códigos de Error HTTP

| Código HTTP | Nombre | Escenario de Disparo | Estructura de Respuesta JSON |
| :--- | :--- | :--- | :--- |
| `200 OK` | Petición Exitosa | Consulta `GET` o actualización `PATCH` exitosa con datos devueltos. | Objeto o arreglo JSON con los registros solicitados. |
| `201 Created` | Recurso Creado | Inserción `POST` de orden o reseña confirmada en PostgreSQL. | Objeto con el nuevo registro generado incluyendo su `id` UUID. |
| `204 No Content` | Sin Contenido | Eliminación `DELETE` exitosa de una reseña. | Cuerpo vacío. |
| `400 Bad Request` | Error de Sintaxis / Regla | El payload no cumple con una restricción de chequeo (ej. `rating < 1` o `total_cop <= 0`). | `{"code": "23514", "message": "new row for relation violates check constraint"}` |
| `401 Unauthorized` | No Autorizado | Clave de API de Supabase ausente o incorrecta (`apikey` no válida). | `{"message": "Invalid API key"}` |
| `403 Forbidden` | Acceso Prohibido | Políticas de Row Level Security (RLS) bloquean la mutación. | `{"message": "permission denied for table"}` |
| `404 Not Found` | No Encontrado | El ID de orden o reseña especificado no existe en la base de datos. | `[]` (Arreglo vacío o 0 filas afectadas). |
| `422 Unprocessable Entity` | Error de Validación | Tipos de datos incompatibles enviados en el payload (ej. texto en columna `NUMERIC`). | `{"code": "22P02", "message": "invalid input syntax for type numeric"}` |
| `500 Internal Server Error` | Falla del Servidor | Error de conexión con el clúster de base de datos de PostgreSQL. | `{"message": "Internal Server Error"}` |
