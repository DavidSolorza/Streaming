import { DatabaseSync } from 'node:sqlite';
import type { IAdminRepository, StoreConfigDTO } from '../domain/adminContracts.ts';
import { SQLiteClient } from '../../../core/db/sqliteClient.ts';

export class SQLiteAdminRepository implements IAdminRepository {
  private get db(): DatabaseSync {
    return SQLiteClient.getInstance();
  }

  getStoreConfig(): StoreConfigDTO {
    const rows = this.db.prepare('SELECT key, value FROM store_settings').all() as Array<{ key: string; value: string }>;
    const map = new Map(rows.map(r => [r.key, r.value]));

    return {
      whatsappNumber: map.get('whatsapp_number') || '573214465418',
      nequiNumber: map.get('nequi_number') || '321 446 5418',
      nequiHolder: map.get('nequi_holder') || 'Juan Pérez',
      bancolombiaAccount: map.get('bancolombia_account') || '123-456789-01',
      bancolombiaHolder: map.get('bancolombia_holder') || 'Juan Pérez',
      daviplataNumber: map.get('daviplata_number') || '321 446 5418',
      daviplataHolder: map.get('daviplata_holder') || 'Juan Pérez',
    };
  }

  updateStoreConfig(config: Partial<StoreConfigDTO>): StoreConfigDTO {
    const stmt = this.db.prepare(`
      INSERT INTO store_settings (key, value, updated_at) 
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `);

    if (config.whatsappNumber !== undefined) stmt.run('whatsapp_number', config.whatsappNumber);
    if (config.nequiNumber !== undefined) stmt.run('nequi_number', config.nequiNumber);
    if (config.nequiHolder !== undefined) stmt.run('nequi_holder', config.nequiHolder);
    if (config.bancolombiaAccount !== undefined) stmt.run('bancolombia_account', config.bancolombiaAccount);
    if (config.bancolombiaHolder !== undefined) stmt.run('bancolombia_holder', config.bancolombiaHolder);
    if (config.daviplataNumber !== undefined) stmt.run('daviplata_number', config.daviplataNumber);
    if (config.daviplataHolder !== undefined) stmt.run('daviplata_holder', config.daviplataHolder);

    return this.getStoreConfig();
  }

  getAdminPasswordHash(): string {
    const row = this.db.prepare('SELECT value FROM store_settings WHERE key = ?').get('admin_password_hash') as { value: string } | undefined;
    return row ? row.value : 'admin123';
  }

  setAdminPassword(hash: string): void {
    const stmt = this.db.prepare(`
      INSERT INTO store_settings (key, value, updated_at)
      VALUES ('admin_password_hash', ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `);
    stmt.run(hash);
  }
}
