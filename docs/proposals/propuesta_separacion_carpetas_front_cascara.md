# Propuesta Técnica: Separación Física (frontend/ y backend/) y Transformación a Frontend Cáscara (Thin Client)

**Versión:** 1.0.0  
**Fecha:** 2026-10-20  
**Estado:** PENDIENTE DE REVISIÓN Y APROBACIÓN DEL USUARIO  
**Autor:** Antigravity Engineering Multi-Agent Team  
**Gobernanza:** Regla de Oro < 150 líneas por archivo • Clean Architecture • Cero SDKs comerciales  

---

## 1. Resumen Ejecutivo (Agente 1: VP of Engineering)

El usuario solicita dos transformaciones arquitectónicas profundas:
1. **Separación física en dos carpetas independientes:**
   - `frontend/`: Todo el cliente web, UI, estilos y assets.
   - `backend/`: Todo el servidor Node.js, SQLite, Bus Service, lógica de negocio y persistencia.
2. **Frontend como Cáscara Pura (Thin Client / Presenter Shell):**
   - El frontend **NO procesará datos**: no calculará precios, no calculará totales, no aplicará descuentos, no validará reglas de negocio, ni formateará mensajes o URLs de WhatsApp.
   - El frontend será una **cáscara visual pasiva**: recibe datos listos desde la API del backend y simplemente los renderiza. Al interactuar, despacha la intención al backend y el backend responde con las URLs o estados finales ya computados.

---

## 2. Arquitectura de "Frontend Cáscara" (Agente 2: Staff Architect)

### 2.1. Patrón Backend-Driven UI / Thin Presenter
En esta arquitectura, toda la inteligencia reside en el backend:

```mermaid
graph LR
    subgraph FrontendApp ["Frontend (Cáscara Pura - frontend/)"]
        View["Componentes UI (Solo Pintan)"]
        ClickAction["Click de Usuario (Intención)"]
    end

    subgraph BackendApp ["Backend Inteligente (backend/)"]
        API["REST API Controller"]
        Bus["Bus Service & Handlers"]
        Calculators["Motor de Negocio: Totales, Descuentos, URLs WhatsApp"]
        SQLite[("SQLite Engine: data/streaming.db")]
    end

    View -->|1. Pide Catálogo| API
    API -->|2. Entrega ViewModel Listo (Precios formateados, Badges, Direct WhatsApp URLs)| View
    ClickAction -->|3. Envía Intención: 'Comprar item X'| API
    API --> Bus
    Bus --> Calculators
    Calculators --> SQLite
    API -->|4. Retorna URL de WhatsApp generada y lista para abrir| ClickAction
```

### 2.2. Lógica que se Retira del Frontend y se Centraliza en el Backend:
1. **Cálculo de Precios y Carrito:**
   - *Antes:* `CartCalculator` sumaba items y calculaba subtotales en el cliente.
   - *Ahora:* El backend expone `POST /api/cart/calculate` y entrega `subtotalFormatted`, `discountFormatted`, `totalFormatted`.
2. **Generación de Mensajes y URLs de WhatsApp:**
   - *Antes:* `OrderFormatter` y `WhatsAppAdapter` construían las cadenas de texto y links en React.
   - *Ahora:* El backend entrega el link directo listo `product.whatsAppOrderUrl` en cada producto y en cada checkout.
3. **Métricas del Panel de Administración:**
   - *Antes:* `SalesRepository.calculateMonthlyMetrics()` agrupaba y sumaba órdenes en memoria del navegador.
   - *Ahora:* `GET /api/stats` entrega el objeto de KPIs completamente computado desde SQLite.
4. **Validación de Pedidos:**
   - *Antes:* `CartValidator` validaba en el navegador.
   - *Ahora:* Validación 100% en backend; el frontend solo muestra mensajes de error si la API responde con fallo.

---

## 3. Mapa de Estructura de Directorios en 2 Carpetas

```
Streaming/
├── backend/                               # Directorio Exclusivo del Backend
│   ├── core/
│   │   ├── bus/                           # BusService y eventos (< 60 líneas)
│   │   ├── db/                            # SQLiteClient y SchemaInitializer (< 100 líneas)
│   │   ├── guardians/                     # Auth, Cors, RateLimit (< 40 líneas c/u)
│   │   ├── receptors/                     # Auditoría y eventos (< 35 líneas c/u)
│   │   └── security/                      # Tokens HMAC y hashing (< 50 líneas c/u)
│   ├── features/
│   │   ├── catalog/                       # Catálogo con URLs y ViewModels listos (< 110 líneas c/u)
│   │   ├── orders/                        # Creación de orden y WhatsApp URL generator (< 110 líneas c/u)
│   │   ├── admin/                         # Configuración y auth con tokens (< 90 líneas c/u)
│   │   └── reviews/                       # Testimonios (< 50 líneas c/u)
│   ├── data/
│   │   └── streaming.db                   # Base de datos SQLite
│   ├── router.ts                          # Router HTTP REST (< 120 líneas)
│   └── index.ts                           # Entrypoint puerto 3001 (< 60 líneas)
│
├── frontend/                              # Directorio Exclusivo del Frontend (Cáscara)
│   ├── src/
│   │   ├── core/                          # Cliente HTTP puro (/api) y Bus UI (< 60 líneas)
│   │   ├── modules/
│   │   │   ├── catalog/presentation/      # Tarjetas pasivas que solo pintan (< 80 líneas)
│   │   │   ├── cart/presentation/         # Drawer pasivo (< 70 líneas)
│   │   │   ├── checkout/presentation/     # Modal pasivo de pago (< 80 líneas)
│   │   │   └── admin/presentation/        # Vistas de métricas pasivas (< 80 líneas)
│   │   ├── shared/components/             # Navbar, Footer, Buttons, Modal (< 70 líneas)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/                            # Favicon, íconos y logos
│   ├── index.html                         # Metadatos SEO, OpenGraph y JSON-LD
│   ├── vite.config.ts                     # Proxy a backend:3001
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── docs/                                  # Gobernanza, propuestas y ADRs
└── package.json                           # Scripts raíz: "dev", "dev:front", "dev:back"
```

---

## 4. Fases de Ejecución Controlada

1. **Fase 1 (Backend - Inteligencia Centralizada):**
   - Mover la lógica de cálculo de carrito, armado de mensaje WhatsApp y métricas al backend.
   - Cada producto en `/api/plataformas` y `/api/combos` incluirá `directWhatsAppUrl` y `priceFormatted`.
   - Nuevo endpoint `POST /api/orders/checkout` que recibe los items, guarda la orden en SQLite y retorna `{ success: true, whatsAppUrl }`.
2. **Fase 2 (Frontend - Conversión a Cáscara Pasiva):**
   - Simplificar los componentes: eliminar `CartCalculator`, `OrderFormatter`, `WhatsAppAdapter` del frontend.
   - Los componentes de tarjeta simplemente renderizan `<a href={product.directWhatsAppUrl}>`.
   - El botón de checkout simplemente llama a la API y abre el enlace retornado por el backend.
3. **Fase 3 (Reorganización Física):**
   - Mover el código a `frontend/` y `backend/`.
   - Configurar scripts unificados en la raíz para iniciar ambos entornos con facilidad.
4. **Fase 4 (Auditoría Estática):**
   - Verificar que ningún archivo supere las 150 líneas.
   - Validar compilación TypeScript y pruebas con 0 errores.
