-- ====================================================================
-- 🗄️ ESQUEMA DE BASE DE DATOS SQLITE PARA CLOUDFLARE D1
-- Proyecto: Tienda Web de Cuentas y Combos de Streaming Colombia
-- ====================================================================

-- 1. Tabla de Plataformas de Streaming y Servicios
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

-- 2. Tabla de Combos y Paquetes de Streaming
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

-- 3. Índices de Alto Rendimiento para Consultas Rápidas
CREATE INDEX IF NOT EXISTS idx_plataformas_categoria ON plataformas(categoria);
CREATE INDEX IF NOT EXISTS idx_plataformas_activo ON plataformas(activo);
CREATE INDEX IF NOT EXISTS idx_combos_destacado ON combos(destacado);
