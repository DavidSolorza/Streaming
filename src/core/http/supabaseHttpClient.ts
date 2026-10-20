import { ENV } from '../config/env';

/**
 * 🏛️ Cliente HTTP Nativo para Supabase PostgREST (Cero SDKs comerciales según Regla 4.2)
 * Consume directamente la API REST de PostgreSQL (/rest/v1) mediante fetch nativo.
 */
export class SupabaseHttpClient {
  private static get isConfigured(): boolean {
    return Boolean(
      ENV.SUPABASE_URL &&
      ENV.SUPABASE_ANON_KEY &&
      !ENV.SUPABASE_URL.includes('your-project-ref') &&
      !ENV.SUPABASE_ANON_KEY.includes('your-supabase-anon-key')
    );
  }

  private static getHeaders(): HeadersInit {
    return {
      'apikey': ENV.SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${ENV.SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    };
  }

  static async select<T>(table: string, queryParams: string = 'select=*'): Promise<T[] | null> {
    if (!this.isConfigured) return null;
    try {
      const url = `${ENV.SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/${table}?${queryParams}`;
      const response = await fetch(url, { method: 'GET', headers: this.getHeaders() });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  static async insert<T>(table: string, record: Partial<T>): Promise<T | null> {
    if (!this.isConfigured) return null;
    try {
      const url = `${ENV.SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/${table}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(record),
      });
      if (!response.ok) return null;
      const data = await response.json();
      return Array.isArray(data) ? data[0] : data;
    } catch {
      return null;
    }
  }

  static async update<T>(table: string, id: string | number, record: Partial<T>): Promise<T | null> {
    if (!this.isConfigured) return null;
    try {
      const url = `${ENV.SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/${table}?id=eq.${id}`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(record),
      });
      if (!response.ok) return null;
      const data = await response.json();
      return Array.isArray(data) ? data[0] : data;
    } catch {
      return null;
    }
  }

  static async delete(table: string, id: string | number): Promise<boolean> {
    if (!this.isConfigured) return false;
    try {
      const url = `${ENV.SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/${table}?id=eq.${id}`;
      const response = await fetch(url, { method: 'DELETE', headers: this.getHeaders() });
      return response.ok;
    } catch {
      return false;
    }
  }
}
