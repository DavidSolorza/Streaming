import { EnvironmentConfig } from '../config/EnvironmentConfig';

export interface TmdbVideoItem {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official?: boolean;
}

export interface TmdbMediaItem {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  media_type?: string;
  release_date?: string;
  first_air_date?: string;
}

export class TmdbHttpClient {
  private static readonly BASE_URL = 'https://api.themoviedb.org/3';

  private static getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'accept': 'application/json',
    };
    const readToken = EnvironmentConfig.tmdbReadAccessToken;
    if (readToken) {
      headers['Authorization'] = `Bearer ${readToken}`;
    }
    return headers;
  }

  private static buildUrl(endpoint: string, params: Record<string, string | number> = {}): string {
    const url = new URL(`${this.BASE_URL}${endpoint}`);
    const apiKey = EnvironmentConfig.tmdbApiKey;
    if (apiKey) {
      url.searchParams.set('api_key', apiKey);
    }
    if (!params.language) {
      url.searchParams.set('language', 'es-MX');
    }
    Object.entries(params).forEach(([key, val]) => {
      url.searchParams.set(key, String(val));
    });
    return url.toString();
  }

  static async get<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T | null> {
    try {
      const url = this.buildUrl(endpoint, params);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (!response.ok) return null;
      return (await response.json()) as T;
    } catch (e) {
      return null;
    }
  }

  static async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<TmdbMediaItem[]> {
    const data = await this.get<{ results: TmdbMediaItem[] }>(`/trending/movie/${timeWindow}`);
    return data?.results || [];
  }

  static async getTrendingAll(timeWindow: 'day' | 'week' = 'week'): Promise<TmdbMediaItem[]> {
    const data = await this.get<{ results: TmdbMediaItem[] }>(`/trending/all/${timeWindow}`);
    return data?.results || [];
  }

  static async getVideos(mediaType: 'movie' | 'tv', id: number): Promise<TmdbVideoItem[]> {
    const latin = await this.get<{ results: TmdbVideoItem[] }>(`/${mediaType}/${id}/videos`, { language: 'es-MX' });
    if (latin?.results && latin.results.length > 0) return latin.results;

    const global = await this.get<{ results: TmdbVideoItem[] }>(`/${mediaType}/${id}/videos`, { language: 'en-US' });
    return global?.results || [];
  }

  static async getDetailsWithProviders(mediaType: 'movie' | 'tv', id: number): Promise<any> {
    return this.get(`/${mediaType}/${id}`, { append_to_response: 'watch/providers' });
  }
}
