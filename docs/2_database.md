# Documento 2: Diseño de Base de Datos y Diccionario de Datos

## Resumen Ejecutivo

Este documento especifica el modelo relacional de persistencia para el sistema **Cuentas Stream Multiplataforma**. Todas las tablas y campos siguen las convenciones estrictas de nomenclatura en minúsculas `snake_case`, llaves primarias globales inmutables mediante identificadores únicos universales (`UUID`), restricciones explícitas de llaves foráneas (`ON DELETE RESTRICT` / `CASCADE`) y validaciones `NOT NULL` y `CHECK`.

---

## 1. Script DDL (PostgreSQL)

```sql
-- Habilitar extensión para UUIDs universales
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Categorías de Productos
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Tabla Principal de Productos de Streaming
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    logo_icon VARCHAR(50) NOT NULL,
    brand_glow_class VARCHAR(100) NOT NULL,
    is_available BOOLEAN DEFAULT true NOT NULL,
    is_bestseller BOOLEAN DEFAULT false NOT NULL,
    search_tags TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Tabla de Modalidades y Variantes de Precios
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    mode_type VARCHAR(20) NOT NULL CHECK (mode_type IN ('pantalla', 'cuenta')),
    duration_months INT NOT NULL CHECK (duration_months IN (1, 3, 6)),
    label VARCHAR(150) NOT NULL,
    devices_info VARCHAR(150) NOT NULL,
    quality_info VARCHAR(150) NOT NULL,
    access_info VARCHAR(200) NOT NULL,
    price_cop NUMERIC(12, 2) NOT NULL CHECK (price_cop > 0),
    regular_price_cop NUMERIC(12, 2) NOT NULL CHECK (regular_price_cop > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT unique_product_variant UNIQUE (product_id, mode_type, duration_months)
);

-- Tabla de Incluidos / Beneficios del Producto
CREATE TABLE product_includes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    sort_order INT DEFAULT 0 NOT NULL
);

-- Tabla de Pedidos / Compras Express
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_contact VARCHAR(150) NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('whatsapp', 'nequi', 'daviplata', 'bancolombia', 'pse')),
    total_cop NUMERIC(12, 2) NOT NULL CHECK (total_cop >= 0),
    status VARCHAR(30) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'paid', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Tabla de Ítems del Pedido
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    quantity INT DEFAULT 1 NOT NULL CHECK (quantity > 0),
    unit_price_cop NUMERIC(12, 2) NOT NULL CHECK (unit_price_cop > 0)
);

-- Índices de Rendimiento
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_orders_status ON orders(status);
```

---

## 2. Diccionario de Datos Exhaustivo

### Tabla `products`
| Nombre de Columna | Tipo de Datos | Restricciones | Regla de Negocio / Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, NOT NULL` | Identificador único universal del producto. |
| `category_id` | `UUID` | `FK, NOT NULL` | Llave foránea que vincula la categoría. Restricción `ON DELETE RESTRICT`. |
| `slug` | `VARCHAR(100)` | `UNIQUE, NOT NULL` | Identificador amigable para URLs (ej. `netflix-4k`). |
| `name` | `VARCHAR(150)` | `NOT NULL` | Nombre comercial completo de la plataforma. |
| `brand` | `VARCHAR(100)` | `NOT NULL` | Marca oficial (ej. Netflix, Disney+, Max). |
| `logo_icon` | `VARCHAR(50)` | `NOT NULL` | Emoji o ícono representativo. |
| `is_available` | `BOOLEAN` | `NOT NULL, DEFAULT true` | Estado de inventario activo/agotado. |

### Tabla `product_variants`
| Nombre de Columna | Tipo de Datos | Restricciones | Regla de Negocio / Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, NOT NULL` | Identificador único de la variante. |
| `product_id` | `UUID` | `FK, NOT NULL` | Llave foránea hacia `products`. `ON DELETE CASCADE`. |
| `mode_type` | `VARCHAR(20)` | `NOT NULL, CHECK` | Modalidad (`pantalla` = PIN 1 perfil, `cuenta` = Hogar completa). |
| `duration_months` | `INT` | `NOT NULL, CHECK` | Duración del plan (1, 3 o 6 meses). |
| `price_cop` | `NUMERIC(12, 2)` | `NOT NULL, CHECK > 0` | Precio en pesos colombianos con descuento aplicado. |
| `regular_price_cop` | `NUMERIC(12, 2)` | `NOT NULL, CHECK > 0` | Precio sin descuento para cálculo de ahorro. |
