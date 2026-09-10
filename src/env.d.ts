/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT_MS: string;
  readonly VITE_ENABLE_MOCK_DATA: string;
  readonly VITE_TMDB_API_KEY: string;
  readonly VITE_TMDB_IMAGE_BASE_URL: string;
  readonly VITE_WHATSAPP_NUMBER: string;
  readonly VITE_NEQUI_NUMBER: string;
  readonly VITE_BANCOLOMBIA_NUMBER: string;
  readonly VITE_DAVIPLATA_NUMBER: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.mp4' {
  const src: string;
  export default src;
}
