-- ==============================================================================
-- 🏛️ SCRIPT DDL OFICIAL - SUPABASE (POSTGRESQL 15+)
-- Plataforma: Cuentas y Plataformas de Streaming JP
-- ==============================================================================

-- Extensión para generación de UUIDs seguros
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. TABLA: products (Catálogo y Precios de Cuentas y Pantallas)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('cine', 'musica', 'trabajo', 'iptv', 'combos')),
    price_1m NUMERIC(12, 2) NOT NULL CHECK (price_1m >= 0),
    price_3m NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (price_3m >= 0),
    price_6m NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (price_6m >= 0),
    price_12m NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (price_12m >= 0),
    available BOOLEAN NOT NULL DEFAULT TRUE,
    bestseller BOOLEAN NOT NULL DEFAULT FALSE,
    icon_name VARCHAR(255) NOT NULL,
    logo_bg VARCHAR(100) NOT NULL DEFAULT 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. TABLA: sales_orders (Ventas y Órdenes para Estadísticas y Conciliación)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sales_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(150) NOT NULL,
    customer_contact VARCHAR(150),
    total_cop NUMERIC(12, 2) NOT NULL CHECK (total_cop >= 0),
    status VARCHAR(30) NOT NULL DEFAULT 'completada' CHECK (status IN ('pendiente', 'validada', 'completada', 'cancelada')),
    payment_method VARCHAR(50) NOT NULL DEFAULT 'transferencia' CHECK (payment_method IN ('nequi', 'bancolombia', 'daviplata', 'transferencia', 'whatsapp')),
    items_summary TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. TABLA: reviews (Reseñas y Testimonios de Clientes Verificados)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Colombia',
    product_name VARCHAR(150) NOT NULL,
    comment TEXT NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    initials VARCHAR(10) NOT NULL,
    avatar_bg VARCHAR(100) NOT NULL DEFAULT 'bg-teal-500/20 text-teal-700 border-teal-300',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. TABLA: store_settings (Configuración y Cuentas Bancarias de JP)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.store_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    store_name VARCHAR(150) NOT NULL DEFAULT 'Cuentas y plataformas de streaming JP',
    store_subtitle VARCHAR(200) NOT NULL DEFAULT 'Entretenimiento & Licencias Premium',
    whatsapp_number VARCHAR(50) NOT NULL DEFAULT '573214465418',
    nequi_number VARCHAR(50) NOT NULL DEFAULT '3214465418',
    nequi_holder VARCHAR(150) NOT NULL DEFAULT 'Juan Pablo',
    bancolombia_account VARCHAR(50) NOT NULL DEFAULT '03214465418',
    bancolombia_holder VARCHAR(150) NOT NULL DEFAULT 'Juan Pablo',
    daviplata_number VARCHAR(50) NOT NULL DEFAULT '3214465418',
    daviplata_holder VARCHAR(150) NOT NULL DEFAULT 'Juan Pablo',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- ÍNDICES DE RENDIMIENTO
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON public.products(available);
CREATE INDEX IF NOT EXISTS idx_sales_orders_created_at ON public.sales_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_orders_status ON public.sales_orders(status);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating DESC);

-- ------------------------------------------------------------------------------
-- POLÍTICAS DE SEGURIDAD (Row Level Security - RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública (Catálogo, Configuración y Reseñas aprobadas)
CREATE POLICY "Lectura pública de productos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Lectura pública de reseñas aprobadas" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Lectura pública de configuración de tienda" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Inserción pública de reseñas de clientes" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Inserción de órdenes desde el checkout" ON public.sales_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Lectura de órdenes para analítica" ON public.sales_orders FOR SELECT USING (true);

-- ------------------------------------------------------------------------------
-- DATOS INICIALES SEMILLA (SEEDS)
-- ------------------------------------------------------------------------------
INSERT INTO public.store_settings (id, store_name, store_subtitle, whatsapp_number, nequi_number, nequi_holder, bancolombia_account, bancolombia_holder, daviplata_number, daviplata_holder)
VALUES ('default', 'Cuentas y plataformas de streaming JP', 'Entretenimiento & Licencias Premium', '573214465418', '3214465418', 'Juan Pablo', '03214465418', 'Juan Pablo', '3214465418', 'Juan Pablo')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, brand, category, price_1m, price_3m, price_6m, price_12m, available, bestseller, icon_name, logo_bg) VALUES
(1, 'Cuenta Demo / Prueba ($1.000 COP)', 'Cuenta Demo', 'cine', 1000, 2000, 3000, 5000, true, true, '/icons/icons8-netflix-desktop-app-windows-11-color/icons8-netflix-desktop-app-96.png', 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'),
(2, 'Netflix Original 4K', 'Netflix', 'cine', 17000, 48000, 92000, 175000, true, true, '/icons/icons8-netflix-desktop-app-windows-11-color/icons8-netflix-desktop-app-96.png', 'bg-rose-500/10 text-rose-500 border-rose-500/20'),
(3, 'Disney+ Premium', 'Disney+', 'cine', 16000, 45000, 86000, 165000, true, true, '/icons/icons8-disney-plus-windows-11-color/icons8-disney-plus-96.png', 'bg-blue-500/10 text-blue-500 border-blue-500/20'),
(4, 'Max (HBO)', 'Max', 'cine', 15000, 42000, 80000, 150000, true, true, '/icons/icons8-hbo-max-ios-27-outlined/icons8-hbo-max-100.png', 'bg-purple-500/10 text-purple-500 border-purple-500/20'),
(5, 'Prime Video', 'Prime Video', 'cine', 14000, 39000, 74000, 140000, true, false, '/icons/icons8-amazon-prime-video-color/icons8-amazon-prime-video-96.png', 'bg-sky-500/10 text-sky-500 border-sky-500/20'),
(6, 'Canva Pro Educativo / Personal', 'Canva', 'trabajo', 10000, 25000, 45000, 35000, true, true, '/icons/icons8-canva-app-windows-11-color/icons8-canva-app-96.png', 'bg-teal-500/10 text-teal-600 border-teal-500/20'),
(7, 'Crunchyroll Fan', 'Crunchyroll', 'cine', 12000, 33000, 62000, 115000, true, false, '/icons/icons8-crunchyroll-windows-11-color/icons8-crunchyroll-96.png', 'bg-amber-500/10 text-amber-600 border-amber-500/20'),
(8, 'Spotify Premium Individual', 'Spotify', 'musica', 12000, 34000, 65000, 120000, true, true, '/icons/icons8-spotify-windows-11-color/icons8-spotify-96.png', 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'),
(9, 'IPTV Pro Ultra HD', 'IPTV Pro', 'iptv', 18000, 50000, 95000, 180000, true, true, '/icons/icons8-tv-color/icons8-tv-96.png', 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.reviews (customer_name, city, product_name, comment, rating, is_approved, initials, avatar_bg) VALUES
('Camila Torres', 'Bogotá D.C.', 'Canva Pro (12 Meses)', '¡Excelente servicio! Pagué por Nequi mi suscripción de Canva Pro y en menos de 3 minutos ya la tenía activada en mi correo personal.', 5, true, 'CT', 'bg-teal-500/20 text-teal-700 border-teal-300'),
('Mateo Bermúdez', 'Medellín', 'Netflix Original & Disney+', 'Llevo 8 meses renovando mis pantallas con JP. La atención por WhatsApp es súper rápida y amigable. Nunca he tenido caídas.', 5, true, 'MB', 'bg-red-500/20 text-red-700 border-red-300'),
('Daniela Morales', 'Cali', 'Combo VIP (Max + Crunchyroll)', 'Compré el combo para ver mis series y animes favoritos. El ahorro frente a pagar las plataformas por separado es gigante.', 5, true, 'DM', 'bg-purple-500/20 text-purple-700 border-purple-300'),
('Santiago Ríos', 'Bucaramanga', 'CapCut Pro & Gemini AI', 'Trabajo creando contenido y necesitaba CapCut sin marca de agua e inteligencia artificial. Me activaron ambas herramientas el mismo día.', 5, true, 'SR', 'bg-blue-500/20 text-blue-700 border-blue-300')
ON CONFLICT DO NOTHING;

INSERT INTO public.sales_orders (order_code, customer_name, customer_contact, total_cop, status, payment_method, items_summary, created_at) VALUES
('ORD-819201', 'Carlos Mendoza', '3104567890', 48000, 'completada', 'nequi', 'Netflix Original 4K (x1), Spotify Premium (x1), Disney+ (x1)', NOW() - INTERVAL '1 day'),
('ORD-719380', 'Andrea Gómez', '3001234567', 35000, 'completada', 'bancolombia', 'Canva Pro (12 Meses) (x1)', NOW() - INTERVAL '2 days'),
('ORD-628192', 'Felipe Ortiz', '3157891234', 32000, 'completada', 'daviplata', 'Disney+ Premium (x2)', NOW() - INTERVAL '4 days'),
('ORD-519283', 'Mariana Castro', '3209876543', 17000, 'completada', 'nequi', 'Netflix Original 4K (x1)', NOW() - INTERVAL '5 days'),
('ORD-492817', 'Julián Pardo', '3186543210', 50000, 'completada', 'bancolombia', 'IPTV Pro Ultra HD (3 Meses) (x1)', NOW() - INTERVAL '7 days')
ON CONFLICT (order_code) DO NOTHING;
