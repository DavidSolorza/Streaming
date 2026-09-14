import { ENV } from '@/core/config/env';

export interface TrendingItem {
  id: string;
  title: string;
  platform: 'Netflix' | 'Disney+' | 'Max' | 'Prime Video' | 'Crunchyroll';
  platformId: string;
  platformColor: string;
  rating: number;
  posterUrl: string;
}

const CACHE_KEY = 'trending_estrenos_tmdb_live_v7';
const CACHE_TIME_KEY = 'trending_estrenos_timestamp_live_v7';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Lista de plataformas soportadas en el catálogo
const PLATFORM_CONFIGS: Record<string, { name: TrendingItem['platform']; color: string }> = {
  netflix: { name: 'Netflix', color: 'bg-red-600' },
  max: { name: 'Max', color: 'bg-blue-600' },
  disney: { name: 'Disney+', color: 'bg-sky-600' },
  prime: { name: 'Prime Video', color: 'bg-cyan-600' },
  crunchyroll: { name: 'Crunchyroll', color: 'bg-orange-500' },
};

const DEFAULT_PLATFORMS: Array<{ name: TrendingItem['platform']; color: string }> = [
  PLATFORM_CONFIGS.netflix,
  PLATFORM_CONFIGS.max,
  PLATFORM_CONFIGS.disney,
  PLATFORM_CONFIGS.prime,
  PLATFORM_CONFIGS.crunchyroll,
  PLATFORM_CONFIGS.disney,
];

export class TrendingRepository {
  /**
   * Obtiene datos iniciales desde la caché de la API si están disponibles
   */
  static getInitialData(): TrendingItem[] {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const parsed: TrendingItem[] = JSON.parse(cachedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      // Ignorar errores de localStorage
    }
    return [];
  }

  /**
   * Consulta en tiempo real la API oficial de TMDB para extraer las tendencias globales de la semana.
   */
  static async getTrending(): Promise<TrendingItem[]> {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

      if (cachedData && cachedTime) {
        const age = Date.now() - Number(cachedTime);
        if (age < ONE_WEEK_MS) {
          const parsed: TrendingItem[] = JSON.parse(cachedData);
          if (Array.isArray(parsed) && parsed.length >= 6) {
            return parsed;
          }
        }
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      // Petición directa a la API de TMDB (Tendencias de la semana en español)
      const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${ENV.TMDB_API_KEY}&language=es-MX`;
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error en API TMDB: ${response.status}`);
      }

      const data = await response.json();
      if (data && Array.isArray(data.results) && data.results.length > 0) {
        const filtered = data.results.filter(
          (item: any) => item.poster_path && (item.title || item.name)
        );

        if (filtered.length >= 6) {
          const mapped: TrendingItem[] = filtered.slice(0, 6).map((item: any, idx: number) => {
            const isAnime = item.original_language === 'ja' || (Array.isArray(item.origin_country) && item.origin_country.includes('JP'));
            
            let platformInfo = DEFAULT_PLATFORMS[idx % DEFAULT_PLATFORMS.length];
            if (isAnime) {
              platformInfo = PLATFORM_CONFIGS.crunchyroll;
            }

            const title = item.title || item.name || item.original_title || item.original_name || 'Estreno TMDB';
            const ratingRaw = item.vote_average ? Number(item.vote_average.toFixed(1)) : 8.5;
            const rating = ratingRaw > 0 ? ratingRaw : 8.5;

            return {
              id: `tmdb-${item.id}`,
              title,
              platform: platformInfo.name,
              platformId: 'cine',
              platformColor: platformInfo.color,
              rating,
              posterUrl: `${ENV.TMDB_IMAGE_BASE_URL}${item.poster_path}`,
            };
          });

          localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
          localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
          return mapped;
        }
      }
    } catch (error) {
      console.error('Error al extraer estrenos en vivo desde la API de TMDB:', error);
    }

    // Si ya existe caché previa la devuelve, de lo contrario devuelve arreglo vacío hasta la reconexión
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      try { return JSON.parse(cachedData); } catch (e) {}
    }
    return [];
  }
}
