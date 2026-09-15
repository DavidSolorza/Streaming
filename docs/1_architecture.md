# Documento 1: Arquitectura del Sistema Fullstack (Cloudflare Pages + D1 SQLite)

## Resumen Ejecutivo

Este documento define la arquitectura técnica y los patrones de diseño para la plataforma **Cuentas Stream Multiplataforma** desplegada en **Cloudflare Pages**, respaldada por funciones serverless (**Cloudflare Pages Functions**) y una base de datos SQLite relacional distribuida (**Cloudflare D1**).

El sistema está diseñado bajo los principios de **Clean Architecture**, **Domain-Driven Design (DDD)**, **Vertical Slicing (Feature-Sliced Design)** y persistencia ligera de alto rendimiento.

---

## 1. Mapeo de Capas (Fullstack Serverless Edge)

```
┌─────────────────────────────────────────────────────────────┐
│  CAPA DE PRESENTACIÓN (UI / React 18 + Tailwind CSS)        │
│  - Renderizado adaptativo, Modales de Administración.       │
└─────────────────────────────┬───────────────────────────────┘
                              │ Invocación del servicio API
┌─────────────────────────────▼───────────────────────────────┐
│  CAPA DE SERVICIOS FRONTEND (src/shared/services/apiService)│
│  - Cliente HTTP nativo (fetch), Tipado estricto TypeScript  │
└─────────────────────────────┬───────────────────────────────┘
                              │ Peticiones REST HTTP / JSON
┌─────────────────────────────▼───────────────────────────────┐
│  BACKEND SERVERLESS (Cloudflare Pages Functions /api/*)     │
│  - /api/plataformas.js, /api/combos.js                      │
│  - Validación de esquemas, CORS, Manejo de HTTP Status      │
└─────────────────────────────┬───────────────────────────────┘
                              │ Binding nativo env.DB
┌─────────────────────────────▼───────────────────────────────┐
│  CAPA DE PERSISTENCIA (Cloudflare D1 / SQLite Engine)       │
│  - Tablas: `plataformas`, `combos`                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Diagrama de Componentes del Sistema (Mermaid)

```mermaid
graph TD
    subgraph Frontend ["Frontend (Cloudflare Pages Static Assets)"]
        UI["React 18 UI Components"]
        AdminModal["AdminProductModal"]
        APIService["apiService.ts (fetch nativo)"]
    end

    subgraph Serverless ["Cloudflare Pages Functions Edge API"]
        PlatEndpoint["/api/plataformas.js (GET, PUT, POST)"]
        CombosEndpoint["/api/combos.js (GET, PUT, POST)"]
    end

    subgraph Database ["Persistencia Cloudflare D1 (SQLite)"]
        D1Binding["DB (env.DB Binding)"]
        PlatTable[("Tabla: plataformas")]
        CombosTable[("Tabla: combos")]
    end

    UI -->|"Consulta catálogo"| APIService
    AdminModal -->|"Actualiza precio y estado"| APIService
    APIService -->|"GET /api/plataformas"| PlatEndpoint
    APIService -->|"PUT /api/plataformas"| PlatEndpoint
    APIService -->|"GET /api/combos"| CombosEndpoint
    APIService -->|"PUT /api/combos"| CombosEndpoint
    PlatEndpoint -->|"SQL Query / Execute"| D1Binding
    CombosEndpoint -->|"SQL Query / Execute"| D1Binding
    D1Binding --> PlatTable
    D1Binding --> CombosTable
```

---

## 3. Diagrama de Secuencia de Actualización en Administración (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrador
    participant Modal as AdminProductModal (UI)
    participant Service as apiService.ts
    participant Function as /api/plataformas.js (Function)
    participant D1 as Cloudflare D1 (SQLite)

    Admin->>Modal: Modifica Precio ($22.000) y activa "Entrega Inmediata"
    Admin->>Modal: Presiona "Guardar Cambios"
    Modal->>Service: actualizarPlataforma('disney', 22000, 1)
    Service->>Function: PUT /api/plataformas JSON { id, precio, entrega_inmediata }
    Function->>Function: Valida tipos y presencia de campos (400 / 422)
    Function->>D1: UPDATE plataformas SET precio = ?, entrega_inmediata = ? WHERE id = ?
    D1-->>Function: Retorna resultado { meta: { changes: 1 } }
    Function->>D1: SELECT * FROM plataformas WHERE id = ?
    D1-->>Function: Retorna fila de la plataforma actualizada
    Function-->>Service: HTTP 200 OK + Payload JSON { success: true, data: {...} }
    Service-->>Modal: Retorna confirmación de éxito
    Modal->>Admin: Muestra notificación Toast "¡Plataforma actualizada correctamente!"
```

---

## 4. Registro de Decisiones de Arquitectura (ADR)

### ADR 001: Migración a Cloudflare D1 (SQLite en el Edge)
- **Estatus:** ACEPTADO
- **Contexto:** Se requiere una base de datos relacional ligera, económica y ultra-rápida sin servidores dedicada a una tienda web de cuentas en Colombia.
- **Decisión:** Implementar Cloudflare D1 como motor SQLite nativo vinculado directamente a Cloudflare Pages Functions vía `env.DB`.
- **Consecuencias:** Latencia mínima en lectura (<20ms global), costo cero en capa gratuita y simplicidad de mantenimiento.

### ADR 002: Cero SDKs Comerciales de Terceros
- **Estatus:** ACEPTADO
- **Contexto:** Mantener cero dependencias comerciales pesadas (ej. Supabase SDK, Firebase SDK).
- **Decisión:** Consumir los endpoints de Cloudflare Pages Functions usando el cliente `fetch` nativo de JavaScript/TypeScript (`apiService.ts`).
