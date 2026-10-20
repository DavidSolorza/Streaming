# Documento 2: Especificación y Diccionario de Base de Datos (Supabase / PostgreSQL)

## Resumen Ejecutivo

Este documento especifica el diseño de la base de datos relacional PostgreSQL alojada en **Supabase** para la plataforma **Cuentas y Plataformas de Streaming JP**. El diseño cumple rigurosamente con la 3ra Forma Normal (3NF), restricciones explícitas `PRIMARY KEY`, `NOT NULL`, `CHECK`, valores por defecto, nomenclatura en minúsculas `snake_case` e indexación de alto rendimiento.

---

## 1. Script DDL Completo (`supabase/schema.sql`)

```sql
-- Extensión para generación de UUIDs seguros
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABLA: products (Catálogo y Precios de Cuentas y Pantallas)
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

-- 2. TABLA: sales_orders (Ventas y Órdenes para Estadísticas y Conciliación)
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

-- 3. TABLA: reviews (Reseñas y Testimonios de Clientes Verificados)
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

-- 4. TABLA: store_settings (Configuración y Cuentas Bancarias de JP)
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

-- Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON public.products(available);
CREATE INDEX IF NOT EXISTS idx_sales_orders_created_at ON public.sales_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(is_approved);
```

---

## 2. Diccionario de Datos Exhaustivo

### Tabla `products`

| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY, NOT NULL` | Identificador autoincremental de la cuenta o servicio. |
| `name` | `VARCHAR(150)` | `NOT NULL` | Nombre comercial del servicio (ej. `'Netflix Original 4K'`). |
| `brand` | `VARCHAR(100)` | `NOT NULL` | Marca proveedora (ej. `'Netflix'`, `'Disney+'`, `'Canva'`). |
| `category` | `VARCHAR(50)` | `NOT NULL, CHECK` | Categoría de catálogo (`'cine'`, `'musica'`, `'trabajo'`, `'iptv'`, `'combos'`). |
| `price_1m` | `NUMERIC(12, 2)` | `NOT NULL, CHECK >= 0` | Precio en COP por 1 mes de servicio. |
| `price_3m` | `NUMERIC(12, 2)` | `DEFAULT 0, CHECK >= 0` | Precio en COP por 3 meses de servicio con descuento. |
| `price_6m` | `NUMERIC(12, 2)` | `DEFAULT 0, CHECK >= 0` | Precio en COP por 6 meses de servicio. |
| `price_12m` | `NUMERIC(12, 2)` | `DEFAULT 0, CHECK >= 0` | Precio en COP por 12 meses de servicio. |
| `available` | `BOOLEAN` | `DEFAULT TRUE` | Disponibilidad para entrega inmediata. |
| `bestseller` | `BOOLEAN` | `DEFAULT FALSE` | Indicador de cuenta más vendida. |
| `icon_name` | `VARCHAR(255)` | `NOT NULL` | Ruta relativa del ícono de plataforma. |
| `logo_bg` | `VARCHAR(100)` | `NOT NULL` | Clases Tailwind CSS para fondo temático. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Fecha y hora de creación del registro. |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Fecha y hora de última modificación. |

---

### Tabla `sales_orders`

| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Identificador global único e inmutable de la orden. |
| `order_code` | `VARCHAR(50)` | `NOT NULL, UNIQUE` | Código de control reconciliable (ej. `'ORD-719380'`). |
| `customer_name` | `VARCHAR(150)` | `NOT NULL` | Nombre completo o apodo del comprador. |
| `customer_contact` | `VARCHAR(150)` | `NULLABLE` | WhatsApp o email proporcionado para la entrega. |
| `total_cop` | `NUMERIC(12, 2)` | `NOT NULL, CHECK >= 0` | Monto liquidado de la compra en pesos colombianos. |
| `status` | `VARCHAR(30)` | `NOT NULL, CHECK` | Estado: `'pendiente'`, `'validada'`, `'completada'`, `'cancelada'`. |
| `payment_method` | `VARCHAR(50)` | `NOT NULL, CHECK` | Método: `'nequi'`, `'bancolombia'`, `'daviplata'`, `'transferencia'`. |
| `items_summary` | `TEXT` | `NOT NULL` | Resumen legible de servicios y cantidades adquiridas. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Fecha exacta de la transacción para reportes mensuales. |

---

### Tabla `reviews`

| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Identificador único de la reseña. |
| `customer_name` | `VARCHAR(150)` | `NOT NULL` | Nombre visible del cliente calificador. |
| `city` | `VARCHAR(100)` | `NOT NULL` | Ciudad de procedencia en Colombia. |
| `product_name` | `VARCHAR(150)` | `NOT NULL` | Servicio o combo calificado. |
| `comment` | `TEXT` | `NOT NULL` | Opinión honesta del cliente. |
| `rating` | `SMALLINT` | `NOT NULL, CHECK (1..5)` | Calificación en estrellas (1 a 5). |
| `is_approved` | `BOOLEAN` | `NOT NULL, DEFAULT TRUE` | Flag de moderación y aprobación por el Administrador. |
| `initials` | `VARCHAR(10)` | `NOT NULL` | Iniciales para el avatar visual. |
| `avatar_bg` | `VARCHAR(100)` | `NOT NULL` | Paleta de color del avatar. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Fecha de publicación de la opinión. |

---

### Tabla `store_settings`

| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(50)` | `PRIMARY KEY` | Clave singleton de configuración (`'default'`). |
| `store_name` | `VARCHAR(150)` | `NOT NULL` | Nombre comercial de la marca. |
| `store_subtitle` | `VARCHAR(200)` | `NOT NULL` | Lema o subtítulo publicitario. |
| `whatsapp_number` | `VARCHAR(50)` | `NOT NULL` | Teléfono internacional de recepción de pedidos. |
| `nequi_number` | `VARCHAR(50)` | `NOT NULL` | Número telefónico de la cuenta Nequi. |
| `nequi_holder` | `VARCHAR(150)` | `NOT NULL` | Nombre del titular de la cuenta Nequi. |
| `bancolombia_account`| `VARCHAR(50)` | `NOT NULL` | Número de cuenta de ahorros Bancolombia. |
| `bancolombia_holder` | `VARCHAR(150)` | `NOT NULL` | Nombre del titular de la cuenta Bancolombia. |
| `daviplata_number` | `VARCHAR(50)` | `NOT NULL` | Número de cuenta Daviplata. |
| `daviplata_holder` | `VARCHAR(150)` | `NOT NULL` | Nombre del titular de la cuenta Daviplata. |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Marca de tiempo de última actualización. |
