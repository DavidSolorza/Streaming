-- ====================================================================
-- 🗄️ ESQUEMA DE BASE DE DATOS SQLITE LOCAL
-- Proyecto: Cuentas Stream Colombia (Backend Desacoplado)
-- Modo WAL recomendado: PRAGMA journal_mode = WAL;
-- ====================================================================

-- 1. Tabla de Plataformas de Streaming
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

-- 2. Tabla de Combos y Paquetes
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

-- 3. Tabla de Órdenes y Ventas
CREATE TABLE IF NOT EXISTS sales_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_code TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_contact TEXT,
    items_summary TEXT NOT NULL,
    total_cop INTEGER NOT NULL CHECK (total_cop >= 0),
    payment_method TEXT NOT NULL DEFAULT 'transferencia',
    status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'confirmado', 'cancelado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Reseñas y Testimonios
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name TEXT NOT NULL,
    city TEXT DEFAULT 'Colombia',
    comment TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    verified INTEGER DEFAULT 1 CHECK (verified IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Configuración de la Tienda (Cuentas y Teléfonos)
CREATE TABLE IF NOT EXISTS store_settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Índices de Alto Rendimiento
CREATE INDEX IF NOT EXISTS idx_plataformas_cat_act ON plataformas(categoria, activo);
CREATE INDEX IF NOT EXISTS idx_combos_dest ON combos(destacado);
CREATE INDEX IF NOT EXISTS idx_orders_code ON sales_orders(order_code);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
