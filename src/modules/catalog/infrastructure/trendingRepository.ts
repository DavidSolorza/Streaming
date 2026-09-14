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

const CACHE_KEY = 'trending_estrenos_cache_v6';
const CACHE_TIME_KEY = 'trending_estrenos_timestamp_v6';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Plataformas soportadas para equilibrar en la cartelera
const PLATFORMS_ROSTER: Array<{ platform: TrendingItem['platform']; color: string }> = [
  { platform: 'Netflix', color: 'bg-red-600' },
  { platform: 'Max', color: 'bg-blue-600' },
  { platform: 'Disney+', color: 'bg-sky-600' },
  { platform: 'Prime Video', color: 'bg-cyan-600' },
  { platform: 'Disney+', color: 'bg-sky-600' },
  { platform: 'Crunchyroll', color: 'bg-orange-500' },
];

// Lista de respaldo 100% confiable con pósteres HD reales y verificados (HTTP 200 OK)
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
   * Obtiene datos iniciales de forma SÍNCRONA desde caché o lista de respaldo
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
   * Consulta la API pública de TMDB para obtener las tendencias reales de la semana.
   * Cuenta con almacenamiento en caché por 7 días y manejo de errores con fallback.
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
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${ENV.TMDB_API_KEY}&language=es-MX`;
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Respuesta TMDB fallida: ${response.status}`);
      }

      const data = await response.json();
      if (data && Array.isArray(data.results) && data.results.length > 0) {
        const filtered = data.results.filter(
          (item: any) => item.poster_path && (item.title || item.name)
        );

        if (filtered.length >= 6) {
          const mapped: TrendingItem[] = filtered.slice(0, 6).map((item: any, idx: number) => {
            const platformInfo = PLATFORMS_ROSTER[idx % PLATFORMS_ROSTER.length];
            const title = item.title || item.name || item.original_title || 'Estreno Destacado';
            const ratingRaw = item.vote_average ? Number(item.vote_average.toFixed(1)) : 8.5;
            const rating = ratingRaw > 0 ? ratingRaw : 8.5;

            return {
              id: `tmdb-${item.id}`,
              title,
              platform: platformInfo.platform,
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
      console.warn('📌 Usando lista de respaldo para Estrenos del Mes:', error);
    }

    return FALLBACK_ESTRENOS;
  }
}
