import { EnvironmentConfig } from './EnvironmentConfig';

export { EnvironmentConfig };

export const ENV = {
  API_BASE_URL: EnvironmentConfig.apiBaseUrl,
  API_TIMEOUT_MS: EnvironmentConfig.apiTimeoutMs,
  ENABLE_MOCK_DATA: EnvironmentConfig.enableMockData,
  TMDB_API_KEY: EnvironmentConfig.tmdbApiKey,
  TMDB_READ_ACCESS_TOKEN: EnvironmentConfig.tmdbReadAccessToken,
  YOUTUBE_API_KEY: EnvironmentConfig.youtubeApiKey,
  TMDB_IMAGE_BASE_URL: EnvironmentConfig.tmdbImageBaseUrl,
  WHATSAPP_NUMBER: EnvironmentConfig.whatsappNumber,
  NEQUI_NUMBER: EnvironmentConfig.nequiNumber,
  BANCOLOMBIA_NUMBER: EnvironmentConfig.bancolombiaNumber,
  DAVIPLATA_NUMBER: EnvironmentConfig.daviplataNumber,
  APP_TITLE: EnvironmentConfig.appTitle,
  APP_ENV: EnvironmentConfig.appEnv,
  SUPABASE_URL: EnvironmentConfig.supabaseUrl,
  SUPABASE_ANON_KEY: EnvironmentConfig.supabaseAnonKey,
};
