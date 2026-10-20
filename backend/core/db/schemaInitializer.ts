import { DatabaseSync } from 'node:sqlite';
import { CatalogSeeder } from './catalogSeeder.ts';

export class SchemaInitializer {
  static initialize(db: DatabaseSync): void {
    db.exec(`
      CREATE TABLE IF NOT EXISTS plataformas (
        id TEXT PRIMARY KEY NOT NULL,
        nombre TEXT NOT NULL,
        categoria TEXT NOT NULL CHECK (categoria IN ('CINE', 'MUSICA', 'TRABAJO', 'IPTV')),
        precio INTEGER NOT NULL CHECK (precio > 0),
        entrega_inmediata INTEGER DEFAULT 1,
        subtitulo TEXT,
        logo_url TEXT,
        activo INTEGER DEFAULT 1,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS combos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        plataformas_nombres TEXT NOT NULL,
        precio INTEGER NOT NULL CHECK (precio > 0),
        ahorro INTEGER DEFAULT 0,
        destacado INTEGER DEFAULT 0,
        entrega_inmediata INTEGER DEFAULT 1,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sales_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_code TEXT UNIQUE NOT NULL,
        customer_name TEXT NOT NULL,
        customer_contact TEXT,
        items_summary TEXT NOT NULL,
        total_cop INTEGER NOT NULL,
        payment_method TEXT NOT NULL DEFAULT 'transferencia',
        status TEXT NOT NULL DEFAULT 'pendiente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author_name TEXT NOT NULL,
        city TEXT DEFAULT 'Colombia',
        comment TEXT NOT NULL,
        rating INTEGER NOT NULL,
        verified INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS store_settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_plataformas_cat ON plataformas(categoria, activo);
      CREATE INDEX IF NOT EXISTS idx_orders_code ON sales_orders(order_code);
    `);

    CatalogSeeder.seedFromCatalogJson(db);
    this.seedReviewsAndSettings(db);
  }

  private static seedReviewsAndSettings(db: DatabaseSync): void {

    const revCount = db.prepare('SELECT COUNT(*) as count FROM reviews').get() as { count: number };
    if (revCount.count === 0) {
      const insRev = db.prepare('INSERT INTO reviews (author_name, city, comment, rating, verified) VALUES (?, ?, ?, ?, 1)');
      insRev.run('Camila Torres', 'Bogotá D.C.', '¡Excelente servicio! Pagué por Nequi mi suscripción de Canva Pro.', 5);
      insRev.run('Mateo Bermúdez', 'Medellín', 'Llevo 8 meses renovando mis pantallas con JP. La atención es súper rápida.', 5);
      insRev.run('Daniela Morales', 'Cali', 'Compré el combo para ver mis series y animes favoritos. El ahorro es gigante.', 5);
      insRev.run('Santiago Ríos', 'Bucaramanga', 'Trabajo creando contenido y necesitaba CapCut sin marca de agua e IA.', 5);
    }

    const setStmt = db.prepare('INSERT OR IGNORE INTO store_settings (key, value) VALUES (?, ?)');
    setStmt.run('whatsapp_number', '573214465418');
    setStmt.run('nequi_number', '321 446 5418');
    setStmt.run('nequi_holder', 'Juan Pérez');
    setStmt.run('bancolombia_account', '123-456789-01');
    setStmt.run('bancolombia_holder', 'Juan Pérez');
    setStmt.run('daviplata_number', '321 446 5418');
    setStmt.run('daviplata_holder', 'Juan Pérez');
    setStmt.run('admin_password_hash', 'admin123');
  }
}
