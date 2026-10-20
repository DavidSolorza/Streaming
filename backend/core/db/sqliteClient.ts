import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

export class SQLiteClient {
  private static instance: DatabaseSync | null = null;

  private static getDbDir(): string {
    const backendData = path.resolve(process.cwd(), 'backend', 'data');
    if (fs.existsSync(path.resolve(process.cwd(), 'backend'))) {
      return backendData;
    }
    return path.resolve(process.cwd(), 'data');
  }

  static getInstance(): DatabaseSync {
    if (!this.instance) {
      const dbDir = this.getDbDir();
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      const dbPath = path.join(dbDir, 'streaming.db');
      this.instance = new DatabaseSync(dbPath);
      this.instance.exec('PRAGMA journal_mode = WAL;');
      this.instance.exec('PRAGMA foreign_keys = ON;');
      this.instance.exec('PRAGMA synchronous = NORMAL;');
    }
    return this.instance;
  }

  static close(): void {
    if (this.instance) {
      this.instance.close();
      this.instance = null;
    }
  }
}
