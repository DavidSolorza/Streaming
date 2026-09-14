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

const CACHE_KEY = 'trending_estrenos_tmdb_live_v8';
const CACHE_TIME_KEY = 'trending_estrenos_timestamp_live_v8';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Lista de plataformas soportadas para mapeo equilibrado
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

// Lista de respaldo de alta disponibilidad para modo sin conexión
const FALLBACK_ESTRENOS: TrendingItem[] = [
  {
    id: 'f1',
    title: 'Stranger Things 5',
    platform: 'Netflix',
    platformId: 'cine',
    platformColor: 'bg-red-600',
    rating: 8.9,
    posterUrl: 'https://image.tmdb.org/t/p/w500/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg',
  },
  {
    id: 'f2',
    title: 'La Casa del Dragón',
    platform: 'Max',
    platformId: 'cine',
    platformColor: 'bg-blue-600',
    rating: 8.7,
    posterUrl: 'https://image.tmdb.org/t/p/w500/7V0Ebks0GgpKvQ7QbLAIdX5dos4.jpg',
  },
  {
    id: 'f3',
    title: 'Deadpool & Wolverine',
    platform: 'Disney+',
    platformId: 'cine',
    platformColor: 'bg-sky-600',
    rating: 8.2,
    posterUrl: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
  },
  {
    id: 'f4',
    title: 'The Boys (T4)',
    platform: 'Prime Video',
    platformId: 'cine',
    platformColor: 'bg-cyan-600',
    rating: 8.6,
    posterUrl: 'https://image.tmdb.org/t/p/w500/in1R2dDc421JxsoRWaIIAqVI2KE.jpg',
  },
  {
    id: 'f5',
    title: 'Intensamente 2',
    platform: 'Disney+',
    platformId: 'cine',
    platformColor: 'bg-sky-600',
    rating: 8.5,
    posterUrl: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
  },
  {
    id: 'f6',
    title: 'Dragon Ball DAIMA',
    platform: 'Crunchyroll',
    platformId: 'cine',
    platformColor: 'bg-orange-500',
    rating: 9.1,
    posterUrl: 'https://image.tmdb.org/t/p/w500/lMULbSFZNXUC87MqOZQ4SSV9DXI.jpg',
  }
];

export class TrendingRepository {
  /**
   * Limpia toda la caché guardada de versiones anteriores o actuales de los estrenos
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
   * Obtiene datos iniciales de forma SÍNCRONA (desde caché o lista de respaldo)
   */
  static getInitialData(): TrendingItem[] {
    try {
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
    return FALLBACK_ESTRENOS;
  }

  /**
   * Consulta la API en vivo de TMDB (The Movie Database) para extraer las tendencias globales de la semana.
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
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-MX`
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
          // Continuar al siguiente endpoint si uno falla
        }
      }
    } catch (error) {
      console.error('Error al consultar API TMDB:', error);
    }

    return FALLBACK_ESTRENOS;
  }
}
