/**
 * 🗄️ Capa de Acceso a Datos (Repositorio) - Combos Cloudflare D1 (SQLite)
 */
export class ComboD1Repository {
  constructor(db) {
    this.db = db;
  }

  async findAll() {
    const { results } = await this.db.prepare(
      'SELECT id, nombre, plataformas_nombres, precio, ahorro, destacado, entrega_inmediata FROM combos ORDER BY destacado DESC, id ASC'
    ).all();
    return results || [];
  }

  async findById(id) {
    return await this.db.prepare(
      'SELECT id, nombre, plataformas_nombres, precio, ahorro, destacado, entrega_inmediata FROM combos WHERE id = ?'
    ).bind(id).first();
  }

  async updatePriceAndSavings(id, precio, ahorro, entregaInmediata) {
    const stmt = this.db.prepare(
      'UPDATE combos SET precio = ?, ahorro = ?, entrega_inmediata = ?, actualizado_en = CURRENT_TIMESTAMP WHERE id = ?'
    );
    const info = await stmt.bind(precio, ahorro, entregaInmediata, id).run();
    return info.meta ? info.meta.changes : 0;
  }
}
