# Documento 3: Especificación Técnica de API REST y Contratos de Datos

## Resumen Ejecutivo

Este documento especifica los contratos de interfaz RESTful de la plataforma de streaming. Todos los payloads de entrada y salida utilizan formato **JSON**, codificación UTF-8 y respuestas estructuradas con código de estado HTTP estándar.

---

## 1. Matriz Global de Códigos de Respuesta HTTP

| Código | Estado | Significado Técnico | Payload Estructurado de Respuesta |
| :--- | :--- | :--- | :--- |
| `200` | `OK` | Consulta o actualización exitosa. | `{ "success": true, "data": { ... } }` |
| `201` | `Created` | Recurso creado exitosamente (ej. Orden). | `{ "success": true, "data": { "id": "..." } }` |
| `400` | `Bad Request` | Error de regla de negocio quebrantada. | `{ "success": false, "error": { "code": "INVALID_RULE", "message": "..." } }` |
| `401` | `Unauthorized` | Token de autenticación ausente o inválido. | `{ "success": false, "error": { "code": "UNAUTHORIZED", "message": "..." } }` |
| `422` | `Unprocessable Entity` | Error de validación de esquema en payload. | `{ "success": false, "error": { "code": "VALIDATION_ERROR", "details": [...] } }` |
| `500` | `Internal Server Error` | Fallo catastrófico interno no previsto. | `{ "success": false, "error": { "code": "INTERNAL_ERROR", "message": "..." } }` |

---

## 2. Endpoints de la API

### 2.1. Listar Catálogo de Productos y Variantes
- **Ruta:** `GET /api/v1/products`
- **Parámetros Query:** `category` (optional), `search` (optional)
- **Respuesta Exitosa (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "c1f7a8b9-4d2e-4f1a-8c3b-5e9f2a7b1c3d",
      "name": "Netflix Ultra HD 4K",
      "brand": "Netflix",
      "category": "cine",
      "brandGlow": "brand-glow-netflix",
      "logoText": "🎬",
      "available": true,
      "bestseller": true,
      "badges": ["4K UHD", "Entrega Inmediata", "Renovable"],
      "modes": {
        "pantalla": {
          "label": "1 Pantalla (Perfil con PIN)",
          "devices": "1 Dispositivo simultáneo",
          "quality": "4K Ultra HD + HDR",
          "access": "Perfil privado con PIN de 4 dígitos",
          "prices": { "1m": 17000, "3m": 45000, "6m": 85000 },
          "regularPrices": { "1m": 28000, "3m": 75000, "6m": 140000 }
        },
        "cuenta": {
          "label": "Cuenta Completa (Hogar)",
          "devices": "4 Dispositivos simultáneos",
          "quality": "4K Ultra HD + Dolby Atmos",
          "access": "Correo y clave propia renovable",
          "prices": { "1m": 45000, "3m": 120000, "6m": 225000 },
          "regularPrices": { "1m": 70000, "3m": 180000, "6m": 330000 }
        }
      }
    }
  ]
}
```

### 2.2. Crear Pedido y Generar URL de WhatsApp
- **Ruta:** `POST /api/v1/checkout/whatsapp`
- **Payload de Entrada:**
```json
{
  "customerContact": "+573001234567",
  "items": [
    {
      "productId": "c1f7a8b9-4d2e-4f1a-8c3b-5e9f2a7b1c3d",
      "name": "Netflix Ultra HD 4K (1 Pantalla - 1 Mes)",
      "price": 17000,
      "quantity": 1
    }
  ]
}
```
- **Respuesta Exitosa (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "orderId": "ord_849201934",
    "whatsappUrl": "https://wa.me/573214465418?text=Hola%20%F0%9F%90%8B%20Quiero%20adquirir%3A%0A%E2%80%A2%20Netflix%20Ultra%20HD%204K%20(1%20Pantalla%20-%201%20Mes)%20x1%20-%20%2417.000%20COP%0A%0ATotal%3A%20%2417.000%20COP",
    "totalCop": 17000
  }
}
```
- **Respuesta de Error (`422 Unprocessable Entity`):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El campo customerContact es obligatorio para procesar la entrega."
  }
}
```
