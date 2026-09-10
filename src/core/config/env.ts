/**
 * ⚙️ Módulo Centralizado de Variables de Entorno Seguras
 */
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.cuentasstream.com/api/v1',
  API_TIMEOUT_MS: Number(import.meta.env.VITE_API_TIMEOUT_MS) || 10000,
  ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA !== 'false',
  TMDB_API_KEY: import.meta.env.VITE_TMDB_API_KEY || 'c4b8fa671dd3a68297b80a13ebec05b2',
  TMDB_IMAGE_BASE_URL: import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500',
  WHATSAPP_NUMBER: import.meta.env.VITE_WHATSAPP_NUMBER || '573214465418',
  NEQUI_NUMBER: import.meta.env.VITE_NEQUI_NUMBER || '3214465418',
  BANCOLOMBIA_NUMBER: import.meta.env.VITE_BANCOLOMBIA_NUMBER || '03214465418',
  DAVIPLATA_NUMBER: import.meta.env.VITE_DAVIPLATA_NUMBER || '3214465418',
  APP_TITLE: import.meta.env.VITE_APP_TITLE || 'Cuentas Stream Colombia',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
};
