import { DatabaseSync } from 'node:sqlite';
import type { ICatalogRepository, PlataformaDTO, ComboDTO } from '../domain/catalogContracts.ts';
import { SQLiteClient } from '../../../core/db/sqliteClient.ts';

export class SQLiteCatalogRepository implements ICatalogRepository {
  private get db(): DatabaseSync {
    return SQLiteClient.getInstance();
  }

  getAllPlatforms(): PlataformaDTO[] {
    const stmt = this.db.prepare('SELECT * FROM plataformas ORDER BY activo DESC, nombre ASC');
    return stmt.all() as unknown as PlataformaDTO[];
  }

  getPlatformById(id: string): PlataformaDTO | null {
    const stmt = this.db.prepare('SELECT * FROM plataformas WHERE id = ?');
    const result = stmt.get(id);
    return (result as unknown as PlataformaDTO) || null;
  }

  updatePlatformPriceAndStatus(id: string, precio: number, activo: boolean): PlataformaDTO | null {
    const stmt = this.db.prepare(`
      UPDATE plataformas 
      SET precio = ?, activo = ?, actualizado_en = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    stmt.run(precio, activo ? 1 : 0, id);
    return this.getPlatformById(id);
  }

  getAllCombos(): ComboDTO[] {
    const stmt = this.db.prepare('SELECT * FROM combos ORDER BY destacado DESC, id ASC');
    return stmt.all() as unknown as ComboDTO[];
  }

  updateCombo(id: number, precio: number, destacado: boolean): ComboDTO | null {
    const stmt = this.db.prepare(`
      UPDATE combos 
      SET precio = ?, destacado = ?, actualizado_en = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    stmt.run(precio, destacado ? 1 : 0, id);
    const getStmt = this.db.prepare('SELECT * FROM combos WHERE id = ?');
    return (getStmt.get(id) as unknown as ComboDTO) || null;
  }
}
