# ADR-004: Separación Física (frontend/ y backend/) y Arquitectura de Frontend Cáscara (Thin Client)

## Estado
Propuesto / Pendiente de Aprobación

## Contexto
El usuario requiere una separación física completa del proyecto en dos carpetas aisladas (`frontend/` y `backend/`), eliminando todo el procesamiento de datos del frontend para convertirlo en una "cáscara" puramente visual (*Thin Client / Dumb Presenter Shell*).

## Decisiones
1. **Carpetas Raíz Aisladas:**
   - `backend/`: Node.js nativo con SQLite, Bus Service, lógica de negocio, cálculos de precios, validación y formateo de URLs de WhatsApp.
   - `frontend/`: React + Vite + Tailwind CSS actuando únicamente como receptor y presentador de datos preparados.
2. **Eliminación de Procesamiento en Frontend:**
   - El cálculo de totales de carrito, la aplicación de descuentos, el armado de mensajes y URLs de WhatsApp, la generación de IDs de orden y el cálculo de métricas financieras de administración se trasladan 100% al backend.
   - Los endpoints del backend entregan directamente ViewModels preparados (`priceFormatted`, `directWhatsAppUrl`, `totalFormatted`, etc.).
3. **Regla de Gobernanza:**
   - Ningún archivo superará las 150 líneas de código.

## Consecuencias
- **Positivas:**
  - Desacoplamiento total: el frontend se vuelve extremadamente ligero, rápido y fácil de mantener o migrar (a móvil, Flutter, etc.).
  - Centralización absoluta de la lógica de negocio y seguridad en el backend.
  - Estructura limpia y organizada sin mezclar dependencias de frontend y backend.
- **Riesgos Mitigados:**
  - Se configurarán scripts en la raíz para que el flujo de desarrollo siga siendo simple mediante `npm run dev`.
