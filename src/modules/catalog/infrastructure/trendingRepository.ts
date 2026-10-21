import { ENV } from '@/core/config/env';
import { TrendingItem, resolvePlatformForItem } from './trendingPlatformResolver';
import { TmdbHttpClient } from '@/core/http/tmdbHttpClient';

export type { TrendingItem };

const CACHE_KEY = 'trending_estrenos_tmdb_pure_api_v10';
const CACHE_TIME_KEY = 'trending_estrenos_timestamp_pure_api_v10';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const DEFAULT_TRENDING: TrendingItem[] = [
  { id: 'tmdb-1058424', title: 'Moana 2', platform: 'Disney+', platformId: 'disney', platformColor: 'bg-sky-600', rating: 7.0, posterUrl: 'https://image.tmdb.org/t/p/w342/mLAGAFUrRw9pphjnbnhtG1hASSN.jpg' },
  { id: 'tmdb-969681', title: 'La Casa del Dragón', platform: 'Max', platformId: 'max', platformColor: 'bg-blue-600', rating: 8.4, posterUrl: 'https://image.tmdb.org/t/p/w342/szyVpg9K3LL5s8VFAGkXzlxgZUk.jpg' },
  { id: 'tmdb-1153576', title: 'Stranger Things', platform: 'Netflix', platformId: 'netflix', platformColor: 'bg-red-600', rating: 8.6, posterUrl: 'https://image.tmdb.org/t/p/w342/AsPD90QEQsIAtSxfSjV3fN7XFpt.jpg' },
  { id: 'tmdb-1400940', title: 'The Boys', platform: 'Prime Video', platformId: 'prime', platformColor: 'bg-cyan-600', rating: 8.5, posterUrl: 'https://image.tmdb.org/t/p/w342/2meX1nMdScFOoV4370rqHWKm5oY.jpg' },
  { id: 'tmdb-1288069', title: 'Jujutsu Kaisen', platform: 'Crunchyroll', platformId: 'crunchyroll', platformColor: 'bg-orange-500', rating: 8.6, posterUrl: 'https://image.tmdb.org/t/p/w342/hHPIefotew38oJm3YCJPAzpi26c.jpg' },
  { id: 'tmdb-1561726', title: 'Arcane', platform: 'Netflix', platformId: 'netflix', platformColor: 'bg-red-600', rating: 8.9, posterUrl: 'https://image.tmdb.org/t/p/w342/fqldf2t8ztc9aiwn396mlX3cfq.jpg' },
];

export class TrendingRepository {
  static clearCache(): void {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('trending_estrenos_')) localStorage.removeItem(key);
      });
    } catch (e) {}
  }

  static getInitialData(): TrendingItem[] {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (Array.isArray(parsed) && parsed.length >= 6) return parsed;
      }
    } catch (e) {}
    return DEFAULT_TRENDING;
  }

  static async getTrending(forceRefresh: boolean = false): Promise<TrendingItem[]> {
    if (forceRefresh) this.clearCache();
    try {
      if (!forceRefresh) {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
        if (cachedData && cachedTime && Date.now() - Number(cachedTime) < ONE_WEEK_MS) {
          const parsed = JSON.parse(cachedData);
          if (Array.isArray(parsed) && parsed.length >= 6) return parsed;
        }
      }
      const results = await TmdbHttpClient.getTrendingAll('week');
      if (results && results.length > 0) {
        const filtered = results.filter((i: any) => i.poster_path && (i.title || i.name)).slice(0, 6);
        const mapped: TrendingItem[] = await Promise.all(
          filtered.map(async (item: any) => {
            const platformInfo = await resolvePlatformForItem(item);
            return {
              id: `tmdb-${item.id}`,
              title: item.title || item.name || 'Estreno Destacado',
              platform: platformInfo ? platformInfo.name : undefined,
              platformId: platformInfo ? platformInfo.platformId : undefined,
              platformColor: platformInfo ? platformInfo.color : undefined,
              rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : 8.5,
              posterUrl: `${ENV.TMDB_IMAGE_BASE_URL}${item.poster_path}`,
            };
          })
        );
        localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
        localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
        return mapped;
      }
    } catch (e) {
      console.error('Error al extraer estrenos TMDB:', e);
    }
    return [];
  }
}
