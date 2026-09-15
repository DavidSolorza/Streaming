# Documento 2: Especificación y Diccionario de Base de Datos (Cloudflare D1 / SQLite)

## Resumen Ejecutivo

Este documento especifica el diseño de la base de datos relacional SQLite alojada en **Cloudflare D1** para la plataforma de cuentas y combos de streaming. El diseño cumple con restricciones explícitas `PRIMARY KEY`, `NOT NULL`, `CHECK`, valores por defecto y nomenclatura idiomática en minúsculas `snake_case`.

---

## 1. Script DDL Completo (`schema.sql`)

```sql
-- Tabla de Plataformas de Streaming y Servicios
CREATE TABLE IF NOT EXISTS plataformas (
    id TEXT PRIMARY KEY NOT NULL,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL CHECK (categoria IN ('CINE', 'MUSICA', 'TRABAJO', 'IPTV')),
    precio INTEGER NOT NULL CHECK (precio > 0),
    entrega_inmediata INTEGER DEFAULT 1 CHECK (entrega_inmediata IN (0, 1)),
    subtitulo TEXT,
    logo_url TEXT,
    activo INTEGER DEFAULT 1 CHECK (activo IN (0, 1)),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Combos y Paquetes de Streaming
CREATE TABLE IF NOT EXISTS combos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    plataformas_nombres TEXT NOT NULL,
    precio INTEGER NOT NULL CHECK (precio > 0),
    ahorro INTEGER DEFAULT 0 CHECK (ahorro >= 0),
    destacado INTEGER DEFAULT 0 CHECK (destacado IN (0, 1)),
    entrega_inmediata INTEGER DEFAULT 1 CHECK (entrega_inmediata IN (0, 1)),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_plataformas_categoria ON plataformas(categoria);
CREATE INDEX IF NOT EXISTS idx_plataformas_activo ON plataformas(activo);
CREATE INDEX IF NOT EXISTS idx_combos_destacado ON combos(destacado);
```

---

## 2. Diccionario de Datos Exhaustivo

### Tabla `plataformas`

| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `TEXT` | `PRIMARY KEY, NOT NULL` | Identificador único textual e inmutable de la plataforma (ej. `'netflix'`, `'disney'`, `'canva'`). |
| `nombre` | `TEXT` | `NOT NULL` | Nombre comercial completo (ej. `'Netflix Original 4K'`). |
| `categoria` | `TEXT` | `NOT NULL, CHECK` | Categoría principal (`'CINE'`, `'MUSICA'`, `'TRABAJO'`, `'IPTV'`). |
| `precio` | `INTEGER` | `NOT NULL, CHECK > 0` | Precio de venta en pesos colombianos (COP) (ej. `17000`, `22000`). |
| `entrega_inmediata` | `INTEGER` | `DEFAULT 1, CHECK (0,1)` | Flag booleano (1 = disponible de inmediato, 0 = bajo pedido). |
| `subtitulo` | `TEXT` | `NULLABLE` | Descripción corta de la modalidad o plan (ej. `'1 Pantalla con PIN'`). |
| `logo_url` | `TEXT` | `NULLABLE` | Ruta o URL de la imagen del ícono de la marca. |
| `activo` | `INTEGER` | `DEFAULT 1, CHECK (0,1)` | Flag de estado habilitado/inhabilitado en el catálogo. |
| `creado_en` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Marca de tiempo de registro inicial. |
| `actualizado_en` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Marca de tiempo de última modificación. |

---

### Tabla `combos`

| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | Identificador numérico secuencial autoincrementable. |
| `nombre` | `TEXT` | `NOT NULL` | Nombre comercial del paquete (ej. `'Combo #1 Dúo Estelar'`). |
| `plataformas_nombres` | `TEXT` | `NOT NULL` | Descripción de servicios incluidos (ej. `'Netflix original + Disney premium'`). |
| `precio` | `INTEGER` | `NOT NULL, CHECK > 0` | Precio total del paquete promocional en COP (ej. `29000`). |
| `ahorro` | `INTEGER` | `DEFAULT 0, CHECK >= 0` | Valor en COP ahorrado en comparación con la compra individual. |
| `destacado` | `INTEGER` | `DEFAULT 0, CHECK (0,1)` | Flag booleano para resaltar en la sección Hero / Bestsellers. |
| `entrega_inmediata` | `INTEGER` | `DEFAULT 1, CHECK (0,1)` | Disponibilidad de entrega inmediata del combo. |
| `creado_en` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Marca de tiempo de creación del combo. |
| `actualizado_en` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Marca de tiempo de última modificación. |
