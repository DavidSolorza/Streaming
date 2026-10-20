/**
 * ⚙️ Gestor POO Centralizado de Variables de Entorno Seguras (.env)
 */
export class EnvironmentConfig {
  static get apiBaseUrl(): string {
    return import.meta.env.VITE_API_BASE_URL || 'https://api.cuentasstream.com/api/v1';
  }

  static get apiTimeoutMs(): number {
    return Number(import.meta.env.VITE_API_TIMEOUT_MS) || 10000;
  }

  static get enableMockData(): boolean {
    return import.meta.env.VITE_ENABLE_MOCK_DATA !== 'false';
  }

  static get tmdbApiKey(): string {
    return import.meta.env.VITE_TMDB_API_KEY || 'feb96c98fcc13714f71e40fba2ec74ed';
  }

  static get tmdbReadAccessToken(): string {
    return import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN || '';
  }

  static get youtubeApiKey(): string {
    return import.meta.env.VITE_YOUTUBE_API_KEY || '';
  }

  static get tmdbImageBaseUrl(): string {
    return import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500';
  }

  static get whatsappNumber(): string {
    return import.meta.env.VITE_WHATSAPP_NUMBER || '573214465418';
  }

  static get nequiNumber(): string {
    return import.meta.env.VITE_NEQUI_NUMBER || '3214465418';
  }

  static get bancolombiaNumber(): string {
    return import.meta.env.VITE_BANCOLOMBIA_NUMBER || '03214465418';
  }

  static get daviplataNumber(): string {
    return import.meta.env.VITE_DAVIPLATA_NUMBER || '3214465418';
  }

  static get appTitle(): string {
    return import.meta.env.VITE_APP_TITLE || 'Cuentas y plataformas de streaming JP';
  }

  static get appEnv(): string {
    return import.meta.env.VITE_APP_ENV || 'development';
  }

  static get supabaseUrl(): string {
    return import.meta.env.VITE_SUPABASE_URL || '';
  }

  static get supabaseAnonKey(): string {
    return import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  }
}
