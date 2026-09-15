# Documento 3: Especificación de Contrato de API RESTful (Cloudflare Pages Functions)

## Resumen Ejecutivo

Este documento define la especificación del contrato de la API REST para los endpoints serverless alojados en **Cloudflare Pages Functions** (`functions/api/`). Cada endpoint expone soporte para peticiones `GET`, `PUT`, `POST` y `OPTIONS` con formato de transferencia JSON y encabezados CORS habilitados.

---

## 1. Endpoint: `/api/plataformas`

### 1.1. Consulta de Plataformas Activas (`GET /api/plataformas`)
- **Método HTTP:** `GET`
- **Ruta:** `/api/plataformas`
- **Descripción:** Retorna la lista completa de plataformas de streaming con estado `activo = 1`.

#### Respuesta Exitosa (`200 OK`):
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "netflix",
      "nombre": "Netflix Original 4K",
      "categoria": "CINE",
      "precio": 17000,
      "entrega_inmediata": 1,
      "subtitulo": "1 Pantalla Ultra HD con PIN privado",
      "logo_url": "/icons/icons8-netflix.png",
      "activo": 1
    },
    {
      "id": "disney",
      "nombre": "Disney+ Premium",
      "categoria": "CINE",
      "precio": 16000,
      "entrega_inmediata": 1,
      "subtitulo": "4K UHD + ESPN + IMAX Enhanced",
      "logo_url": "/icons/icons8-disney-plus.png",
      "activo": 1
    }
  ]
}
```

---

### 1.2. Actualización de Plataforma (`PUT /api/plataformas` o `POST /api/plataformas`)
- **Método HTTP:** `PUT` / `POST`
- **Ruta:** `/api/plataformas`
- **Descripción:** Permite a la vista de administración actualizar el `precio` y la disponibilidad de `entrega_inmediata` de una plataforma por su `id`.

#### Payload de Entrada (`Content-Type: application/json`):
```json
{
  "id": "disney",
  "precio": 18000,
  "entrega_inmediata": 1
}
```

#### Respuestas y Matriz de Errores:

##### `200 OK` - Actualización Exitosa:
```json
{
  "success": true,
  "message": "Plataforma \"disney\" actualizada exitosamente.",
  "data": {
    "id": "disney",
    "nombre": "Disney+ Premium",
    "categoria": "CINE",
    "precio": 18000,
    "entrega_inmediata": 1,
    "subtitulo": "4K UHD + ESPN + IMAX Enhanced",
    "logo_url": "/icons/icons8-disney-plus.png",
    "activo": 1
  }
}
```

##### `400 Bad Request` - Identificador o JSON Inválido:
```json
{
  "success": false,
  "error": "MISSING_PLATFORM_ID",
  "message": "El campo \"id\" es obligatorio y debe ser una cadena de texto."
}
```

##### `404 Not Found` - Plataforma No Existente:
```json
{
  "success": false,
  "error": "PLATFORM_NOT_FOUND",
  "message": "No existe ninguna plataforma registrada con el id \"desconocido\"."
}
```

##### `422 Unprocessable Entity` - Validación de Precio Fallida:
```json
{
  "success": false,
  "error": "INVALID_PRICE",
  "message": "El campo \"precio\" es obligatorio y debe ser un número mayor a cero (COP)."
}
```

##### `500 Internal Server Error` - Error de Persistencia D1:
```json
{
  "success": false,
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Error ejecutando la actualización en Cloudflare D1"
}
```

---

## 2. Endpoint: `/api/combos`

### 2.1. Consulta de Combos (`GET /api/combos`)
- **Método HTTP:** `GET`
- **Ruta:** `/api/combos`
- **Descripción:** Retorna la lista de todos los combos y paquetes registrados.

#### Respuesta Exitosa (`200 OK`):
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "nombre": "Combo #1 Dúo Estelar",
      "plataformas_nombres": "Netflix 4K + Disney+ Premium",
      "precio": 29000,
      "ahorro": 4000,
      "destacado": 1,
      "entrega_inmediata": 1
    }
  ]
}
```

---

### 2.2. Actualización de Combo (`PUT /api/combos` o `POST /api/combos`)
- **Método HTTP:** `PUT` / `POST`
- **Ruta:** `/api/combos`

#### Payload de Entrada (`Content-Type: application/json`):
```json
{
  "id": 1,
  "precio": 31000,
  "entrega_inmediata": 1,
  "ahorro": 5000,
  "destacado": 1
}
```

#### Respuesta Exitosa (`200 OK`):
```json
{
  "success": true,
  "message": "Combo #1 actualizado exitosamente.",
  "data": {
    "id": 1,
    "nombre": "Combo #1 Dúo Estelar",
    "plataformas_nombres": "Netflix 4K + Disney+ Premium",
    "precio": 31000,
    "ahorro": 5000,
    "destacado": 1,
    "entrega_inmediata": 1
  }
}
```
