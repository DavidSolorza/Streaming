/**
 * 🗄️ Capa de Acceso a Datos (Repositorio) - Plataformas Cloudflare D1 (SQLite)
 */
export class PlatformD1Repository {
  constructor(db) {
    this.db = db;
  }

  async findAllActive() {
    const { results } = await this.db.prepare(
      'SELECT id, nombre, categoria, precio, entrega_inmediata, subtitulo, logo_url, activo FROM plataformas WHERE activo = 1 ORDER BY categoria ASC, nombre ASC'
    ).all();
    return results || [];
  }

  async findById(id) {
    return await this.db.prepare(
      'SELECT id, nombre, categoria, precio, entrega_inmediata, subtitulo, logo_url, activo FROM plataformas WHERE id = ?'
    ).bind(id).first();
  }

  async updatePriceAndStatus(id, precio, entregaInmediata) {
    const stmt = this.db.prepare(
      'UPDATE plataformas SET precio = ?, entrega_inmediata = ?, actualizado_en = CURRENT_TIMESTAMP WHERE id = ?'
    );
    const info = await stmt.bind(precio, entregaInmediata, id).run();
    return info.meta ? info.meta.changes : 0;
  }
}
