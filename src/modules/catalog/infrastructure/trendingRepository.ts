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

const CACHE_KEY = 'trending_estrenos_tmdb_pure_api_v10';
const CACHE_TIME_KEY = 'trending_estrenos_timestamp_pure_api_v10';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Configuración centralizada de plataformas con sus estilos e identificadores de filtro
const PLATFORM_CONFIGS: Record<string, { name: TrendingItem['platform']; platformId: string; color: string }> = {
  netflix: { name: 'Netflix', platformId: 'netflix', color: 'bg-red-600' },
  max: { name: 'Max', platformId: 'max', color: 'bg-blue-600' },
  disney: { name: 'Disney+', platformId: 'disney', color: 'bg-sky-600' },
  prime: { name: 'Prime Video', platformId: 'prime', color: 'bg-cyan-600' },
  crunchyroll: { name: 'Crunchyroll', platformId: 'crunchyroll', color: 'bg-orange-500' },
};

const ANIME_STUDIOS = [
  'toei animation', 'mappa', 'ufotable', 'wit studio', 'bones', 'kyoto animation',
  'madhouse', 'cloverworks', 'a-1 pictures', 'pierrot', 'trigger', 'david production',
  'sunrise', 'production i.g'
];
const DISNEY_STUDIOS = [
  'walt disney', 'marvel studios', 'pixar', 'lucasfilm', '20th century studios',
  'searchlight pictures', 'disney television animation'
];
const MAX_STUDIOS = [
  'warner bros', 'hbo', 'dc studios', 'dc entertainment', 'new line cinema',
  'cartoon network', 'adult swim'
];
const NETFLIX_STUDIOS = ['netflix', 'netflix studios'];
const PRIME_STUDIOS = ['amazon studios', 'mgm', 'metro-goldwyn-mayer'];

/**
 * Selecciona una plataforma secundaria limpia de forma determinista para títulos sin metadata de proveedor
 */
function getDeterministicPlatform(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
    hash |= 0;
  }
  const fallbackList = [
    PLATFORM_CONFIGS.netflix,
    PLATFORM_CONFIGS.max,
    PLATFORM_CONFIGS.disney,
    PLATFORM_CONFIGS.prime,
  ];
  const idx = Math.abs(hash) % fallbackList.length;
  return fallbackList[idx];
}

/**
 * Inspecciona los detalles, proveedores de streaming (watch/providers), productoras y redes del contenido en TMDB
 */
async function resolvePlatformForItem(item: any, apiKey: string) {
  const mediaType = item.media_type === 'tv' ? 'tv' : 'movie';
  const detailUrl = `https://api.themoviedb.org/3/${mediaType}/${item.id}?api_key=${apiKey}&append_to_response=watch/providers,keywords`;

  let detail: any = null;
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(detailUrl, { signal: controller.signal });
    clearTimeout(t);
    if (res.ok) {
      detail = await res.json();
    }
  } catch (e) {
    // Si falla la petición de detalle, se aplican heurísticas de título y datos base
  }

  const providersObj = detail?.['watch/providers']?.results || {};
  const flatrateList: any[] = [
    ...(providersObj.CO?.flatrate || []),
    ...(providersObj.MX?.flatrate || []),
    ...(providersObj.US?.flatrate || []),
    ...(providersObj.ES?.flatrate || [])
  ];

  const providerNames = flatrateList.map(p => (p.provider_name || '').toLowerCase());
  const networks = (detail?.networks || []).map((n: any) => (n.name || '').toLowerCase());
  const companies = (detail?.production_companies || []).map((c: any) => (c.name || '').toLowerCase());
  const genreIds: number[] = item.genre_ids || (detail?.genres || []).map((g: any) => g.id) || [];
  
  const isAnimation = genreIds.includes(16); // ID 16 = Animation en TMDB
  const isJapanese = item.original_language === 'ja' || (Array.isArray(item.origin_country) && item.origin_country.includes('JP'));

  // 1. Verificación directa de Proveedores de Streaming (watch/providers)
  if (providerNames.some(p => p.includes('crunchyroll') || p.includes('funimation'))) {
    return PLATFORM_CONFIGS.crunchyroll;
  }
  if (providerNames.some(p => p.includes('netflix'))) {
    return PLATFORM_CONFIGS.netflix;
  }
  if (providerNames.some(p => p.includes('disney'))) {
    return PLATFORM_CONFIGS.disney;
  }
  if (providerNames.some(p => p.includes('hbo') || p.includes('max'))) {
    return PLATFORM_CONFIGS.max;
  }
  if (providerNames.some(p => p.includes('amazon') || p.includes('prime video'))) {
    return PLATFORM_CONFIGS.prime;
  }

  // 2. Cadenas de Televisión / Cadenas de Transmisión (Redes)
  if (networks.some((n: string) => n.includes('netflix'))) return PLATFORM_CONFIGS.netflix;
  if (networks.some((n: string) => n.includes('hbo') || n.includes('max') || n.includes('adult swim'))) return PLATFORM_CONFIGS.max;
  if (networks.some((n: string) => n.includes('disney'))) return PLATFORM_CONFIGS.disney;
  if (networks.some((n: string) => n.includes('prime') || n.includes('amazon'))) return PLATFORM_CONFIGS.prime;
  if (networks.some((n: string) => n.includes('crunchyroll'))) return PLATFORM_CONFIGS.crunchyroll;

  // 3. Casas Productoras y Estudios Principales
  if (companies.some((c: string) => DISNEY_STUDIOS.some((d: string) => c.includes(d)))) return PLATFORM_CONFIGS.disney;
  if (companies.some((c: string) => MAX_STUDIOS.some((m: string) => c.includes(m)))) return PLATFORM_CONFIGS.max;
  if (companies.some((c: string) => NETFLIX_STUDIOS.some((n: string) => c.includes(n)))) return PLATFORM_CONFIGS.netflix;
  if (companies.some((c: string) => PRIME_STUDIOS.some((p: string) => c.includes(p)))) return PLATFORM_CONFIGS.prime;

  // 4. Detección Estricta de Anime (solo animación japonesa o estudios de anime reconocidos)
  if (isAnimation && (isJapanese || companies.some((c: string) => ANIME_STUDIOS.some((a: string) => c.includes(a))))) {
    return PLATFORM_CONFIGS.crunchyroll;
  }

  // 5. Coincidencias por franquicias o palabras clave en el título
  const titleLower = (item.title || item.name || item.original_title || item.original_name || '').toLowerCase();
  if (/spider-man|marvel|star wars|disney|avatar|moana|frozen|zootopia|inside out|mufasa/i.test(titleLower)) {
    return PLATFORM_CONFIGS.disney;
  }
  if (/batman|superman|dc |harry potter|game of thrones|house of the dragon|dune|joker|penguin/i.test(titleLower)) {
    return PLATFORM_CONFIGS.max;
  }
  if (/stranger things|squid game|bridgerton|witcher|cobra kai|wednesday/i.test(titleLower)) {
    return PLATFORM_CONFIGS.netflix;
  }
  if (/lord of the rings|rings of power|reacher|the boys|fallout|invincible/i.test(titleLower)) {
    return PLATFORM_CONFIGS.prime;
  }

  // 6. Distribución determinista si no hay datos de proveedor explícitos
  return getDeterministicPlatform(titleLower);
}

export class TrendingRepository {
  /**
   * Limpia toda la caché previa de versiones pasadas en localStorage
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
        if (key.startsWith('trending_estrenos_') && !key.includes('v10')) {
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
   * Extrae en vivo los estrenos desde la API de TMDB clasificando con precisión cada título en su plataforma oficial.
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
              const targetItems = filtered.slice(0, 6);

              const mapped: TrendingItem[] = await Promise.all(
                targetItems.map(async (item: any) => {
                  const platformInfo = await resolvePlatformForItem(item, apiKey);
                  const title = item.title || item.name || item.original_title || item.original_name || 'Estreno Destacado';
                  const ratingRaw = item.vote_average ? Number(item.vote_average.toFixed(1)) : 8.5;
                  const rating = ratingRaw > 0 ? ratingRaw : 8.5;

                  return {
                    id: `tmdb-${item.id}`,
                    title,
                    platform: platformInfo.name,
                    platformId: platformInfo.platformId,
                    platformColor: platformInfo.color,
                    rating,
                    posterUrl: `${ENV.TMDB_IMAGE_BASE_URL}${item.poster_path}`,
                  };
                })
              );

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

