# ADR-003: Backend Desacoplado con SQLite Nativo, Bus Service, Guardianes, Receptores y Seguridad de Tokens

## Estado
Aprobado por el usuario (en fase de ejecución)

## Contexto
El usuario aprobó la propuesta inicial y solicitó explícitamente:
1. Carpetas de **`guardians`** (Guardianes de seguridad y autorización) y **`receptors`** (Receptores oyentes del Bus Service) tanto para el frontend como para el backend.
2. Manejo robusto de **tokens** criptográficos para seguridad y autenticación.
3. Máxima seguridad en transporte y almacenamiento (CORS, timing attack prevention, saneamiento).
4. Optimización integral de **SEO** (Search Engine Optimization) con metadatos OpenGraph, Twitter y JSON-LD Schema.org.

## Decisiones de Arquitectura
1. **Patrón Guardianes (`guardians/`):**
   - En Backend: `authGuardian.ts`, `rateLimitGuardian.ts`, `corsGuardian.ts`.
   - En Frontend: `adminGuard.ts`, `checkoutGuard.ts`.
2. **Patrón Receptores (`receptors/`):**
   - Suscriptores reactivos al `BusService` que ejecutan efectos secundarios (auditoría, sincronización de cachés, notificaciones) sin acoplar los casos de uso.
3. **Manejo de Tokens con Criptografía Nativa (`node:crypto`):**
   - Generación de tokens de sesión con firma digital HMAC-SHA256 y expiración integrada.
   - Verificación de credenciales con `crypto.timingSafeEqual` para prevenir ataques de canal lateral.
4. **Persistencia SQLite con Modo WAL:**
   - Base de datos en `data/streaming.db` operada mediante el motor estándar `node:sqlite` de Node.js v24.
5. **SEO Avanzado en Frontend:**
   - Inserción de metadatos OpenGraph, Twitter Cards y etiquetas Schema.org en `index.html`.
6. **Regla de Gobernanza:**
   - Todos los archivos respetan el límite estricto de máximo 150 líneas.
