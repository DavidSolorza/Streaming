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

const CACHE_KEY = 'trending_estrenos_cache_v2';
const CACHE_TIME_KEY = 'trending_estrenos_timestamp_v2';
const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24 Horas

// Lista de respaldo 100% confiable con pósteres HD verificados de TMDb
const FALLBACK_ESTRENOS: TrendingItem[] = [
  {
    id: 'f1',
    title: 'Stranger Things 5',
    platform: 'Netflix',
    platformId: 'cine',
    platformColor: 'bg-red-600',
    rating: 8.9,
    posterUrl: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
  },
  {
    id: 'f2',
    title: 'La Casa del Dragón',
    platform: 'Max',
    platformId: 'cine',
    platformColor: 'bg-blue-600',
    rating: 8.7,
    posterUrl: 'https://image.tmdb.org/t/p/w500/1XDDXPXGiI8id7MrUxK26ke7Wus.jpg',
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
    posterUrl: 'https://image.tmdb.org/t/p/w500/7Ns6tO3aYjppI5LoNOEGvdipAAL.jpg',
  },
  {
    id: 'f5',
    title: 'Intensamente 2',
    platform: 'Disney+',
    platformId: 'cine',
    platformColor: 'bg-sky-600',
    rating: 8.5,
    posterUrl: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpeYr2s52sY69v3C8h2.jpg',
  },
  {
    id: 'f6',
    title: 'Dragon Ball DAIMA',
    platform: 'Crunchyroll',
    platformId: 'cine',
    platformColor: 'bg-orange-500',
    rating: 9.1,
    posterUrl: 'https://image.tmdb.org/t/p/w500/z6c98qUv64t00M85iH2qXQjXgU3.jpg',
  }
];

export class TrendingRepository {
  /**
   * Obtiene datos iniciales de forma SÍNCRONA para 0ms de retardo al cargar la página
   */
  static getInitialData(): TrendingItem[] {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

      if (cachedData && cachedTime) {
        const isStillFresh = Date.now() - parseInt(cachedTime, 10) < ONE_DAY_MS;
        if (isStillFresh) {
          const parsed: TrendingItem[] = JSON.parse(cachedData);
          if (Array.isArray(parsed) && parsed.length >= 4) {
            return parsed;
          }
        }
      }
    } catch (e) {
      // Ignorar errores
    }
    return FALLBACK_ESTRENOS;
  }

  static async getTrending(): Promise<TrendingItem[]> {
    // 1. Revisar si tenemos datos frescos en caché v2 (< 24 horas)
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

      if (cachedData && cachedTime) {
        const isStillFresh = Date.now() - parseInt(cachedTime, 10) < ONE_DAY_MS;
        if (isStillFresh) {
          const parsed: TrendingItem[] = JSON.parse(cachedData);
          if (Array.isArray(parsed) && parsed.length >= 4) {
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn('Error leyendo localStorage caché v2:', err);
    }

    // 2. Si no hay caché o ya venció, consultamos TMDb en español
    try {
      const apiKey = ENV.TMDB_API_KEY;
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=es-MX`
      );

      if (!response.ok) throw new Error(`HTTP Error ${response.status} al conectar con TMDb`);

      const data = await response.json();

      if (!data || !Array.isArray(data.results)) {
        throw new Error('Formato de datos TMDb no válido');
      }

      // 3. Sanitización estricta: Solo títulos con póster válido
      const validItems = data.results.filter(
        (item: any) => item.poster_path && (item.title || item.name)
      );

      if (validItems.length < 4) {
        return FALLBACK_ESTRENOS;
      }

      // 4. Mapeo a las plataformas del catálogo
      const platformsPool: Array<{ name: TrendingItem['platform']; id: string; color: string }> = [
        { name: 'Netflix', id: 'cine', color: 'bg-red-600' },
        { name: 'Max', id: 'cine', color: 'bg-blue-600' },
        { name: 'Disney+', id: 'cine', color: 'bg-sky-600' },
        { name: 'Prime Video', id: 'cine', color: 'bg-cyan-600' },
        { name: 'Crunchyroll', id: 'cine', color: 'bg-orange-500' },
      ];

      const formattedList: TrendingItem[] = validItems.slice(0, 8).map((item: any, index: number) => {
        const platform = platformsPool[index % platformsPool.length];
        return {
          id: String(item.id),
          title: item.title || item.name,
          platform: platform.name,
          platformId: platform.id,
          platformColor: platform.color,
          rating: Number(item.vote_average ? item.vote_average.toFixed(1) : 8.5),
          posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
        };
      });

      // 5. Guardar en caché local v2 por 24 horas
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(formattedList));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
      } catch (err) {
        console.warn('Error guardando en localStorage v2:', err);
      }

      return formattedList;
    } catch (error) {
      console.warn('Usando lista de respaldo para estrenos:', error);
      return FALLBACK_ESTRENOS;
    }
  }
}
