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

const CACHE_KEY = 'trending_estrenos_tmdb_pure_api_v9';
const CACHE_TIME_KEY = 'trending_estrenos_timestamp_pure_api_v9';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Lista de plataformas soportadas en el catálogo para distribución limpia
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
   * Limpia toda la caché previa o antigua de versiones pasadas en localStorage
   */
  static clearCache(): void {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('trending_estrenos_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      // Ignorar errores de localStorage
    }
  }

  /**
   * Obtiene únicamente datos previamente extraídos de la API guardados en caché
   */
  static getInitialData(): TrendingItem[] {
    try {
      // Limpieza preventiva de versiones anteriores
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('trending_estrenos_') && !key.includes('v9')) {
          localStorage.removeItem(key);
        }
      });

      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const parsed: TrendingItem[] = JSON.parse(cachedData);
        if (Array.isArray(parsed) && parsed.length >= 6) {
          return parsed;
        }
      }
    } catch (e) {
      // Ignorar errores de localStorage
    }
    return [];
  }

  /**
   * Extrae en vivo los estrenos desde la API de TMDB sin depender de ninguna lista estática ni antigua.
   */
  static async getTrending(forceRefresh: boolean = false): Promise<TrendingItem[]> {
    if (forceRefresh) {
      this.clearCache();
    }

    try {
      if (!forceRefresh) {
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
      }

      const apiKey = ENV.TMDB_API_KEY;
      const endpoints = [
        `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=es-MX`,
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-MX`,
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=es-MX`
      ];

      for (const url of endpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);
          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (!response.ok) continue;

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

                const title = item.title || item.name || item.original_title || item.original_name || 'Estreno Destacado';
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
        } catch (e) {
          // Intentar con el siguiente endpoint de TMDB
        }
      }
    } catch (error) {
      console.error('Error al extraer estrenos en vivo desde TMDB:', error);
    }

    return [];
  }
}
