import { ENV } from '@/core/config/env';
import { TrendingItem, resolvePlatformForItem } from './trendingPlatformResolver';
import { TmdbHttpClient } from '@/core/http/tmdbHttpClient';

export type { TrendingItem };

const CACHE_KEY = 'trending_estrenos_tmdb_pure_api_v10';
const CACHE_TIME_KEY = 'trending_estrenos_timestamp_pure_api_v10';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

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
    return [];
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
