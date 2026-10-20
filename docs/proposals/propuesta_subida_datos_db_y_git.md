# Propuesta Técnica: Sincronización Integral de Datos (SQLite/Supabase) y Publicación en Repositorio Git

**Versión:** 1.0.0  
**Fecha:** 2026-10-20  
**Estado:** APROBADA POR EL USUARIO (En fase de ejecución)  
**Autor:** Antigravity Engineering Multi-Agent Team  
**Gobernanza:** Regla de Oro < 150 líneas por archivo • Clean Architecture • Cero SDKs comerciales  

---

## 1. Resumen Ejecutivo (Agente 1: VP of Engineering)

El usuario ha ordenado la ejecución dual:
1. **Subida y sincronización de datos:** Poblar la base de datos (SQLite en `backend/data/streaming.db`, `data/streaming.db`, scripts de semillas `seed.sql` y `supabase/schema.sql`) con los 44 productos del catálogo real (`excelCatalogData.json`), incluyendo las 16 plataformas individuales de streaming/productividad y los 28 combos destacados con sus precios oficiales en pesos colombianos (COP).
2. **Publicación y sincronización en Git (GitHub):** Versionar la nueva estructura limpia de `backend/`, `frontend/`, `docs/`, `supabase/` y realizar el commit y `push` a la rama `main` del repositorio remoto `https://github.com/DavidSolorza/Streaming.git`.

---

## 2. Arquitectura de Datos y Persistencia (Agente 3: Principal DBA)

### 2.1. Normalización y Consistencia de Datos
Los 44 productos de `excelCatalogData.json` se clasifican y migran de forma idempotente:
- **16 Plataformas Principales:** Netflix, Disney+, Max, Prime Video, Paramount+, Crunchyroll, Plex, Vix, Canva Pro, CapCut Pro, Gemini AI, Jellyfin, IPTV Latino, Spotify, YouTube Premium y Cuenta Demo ($1.000 COP).
- **28 Combos Multi-Plataforma:** Combos dúo, trío y paquetes completos de entretenimiento y herramientas de trabajo con cálculo de ahorro y precio paquetizado.

### 2.2. Esquemas Actualizados
- **SQLite (`streaming.db`):** Tablas `plataformas`, `combos`, `sales_orders`, `reviews`, `store_settings`. Checkpoint forzado (`wal_checkpoint(TRUNCATE)`) para evitar bloqueos y corrupción de archivos temporales.
- **DDL Supabase (`supabase/schema.sql`):** Esquema PostgreSQL 15 con políticas RLS y semillas completas para despliegue en la nube.
- **DDL D1/SQL (`seed.sql`):** Script SQL portable con sentencias `INSERT ... ON CONFLICT DO UPDATE`.

---

## 3. Plan de Ejecución Git y Gobernanza (Agente 4 & 5)

1. **Ajuste de `.gitignore`:** Excluir archivos temporales de base de datos (`*.db-shm`, `*.db-wal`) y carpetas temporales (`.aider-desk/`).
2. **Poblado de Base de Datos:** Creación del módulo `CatalogSeeder` (< 150 líneas) y ejecución de inserción de las 16 plataformas y 28 combos.
3. **Validación de Integridad:** Ejecución de suite de pruebas unitarias (`vitest`) para asegurar 100% de tests aprobados.
4. **Git Commit & Push:**
   - `git add .`
   - `git commit -m "feat(data): seed all 44 catalog platforms and combos, sync sqlite & push backend/frontend architecture"`
   - `git push origin main`
5. **Informe de Cierre:** Emisión de `docs/informe_subida_datos_y_push_git.md`.
