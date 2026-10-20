import { TmdbHttpClient } from '@/core/http/tmdbHttpClient';

export interface TrendingItem {
  id: string;
  title: string;
  platform?: 'Netflix' | 'Disney+' | 'Max' | 'Prime Video' | 'Crunchyroll';
  platformId?: string;
  platformColor?: string;
  rating: number;
  posterUrl: string;
}

export const PLATFORM_CONFIGS: Record<string, { name: NonNullable<TrendingItem['platform']>; platformId: string; color: string }> = {
  netflix: { name: 'Netflix', platformId: 'netflix', color: 'bg-red-600' },
  max: { name: 'Max', platformId: 'max', color: 'bg-blue-600' },
  disney: { name: 'Disney+', platformId: 'disney', color: 'bg-sky-600' },
  prime: { name: 'Prime Video', platformId: 'prime', color: 'bg-cyan-600' },
  crunchyroll: { name: 'Crunchyroll', platformId: 'crunchyroll', color: 'bg-orange-500' },
};

export async function resolvePlatformForItem(item: any) {
  const mediaType = item.media_type === 'tv' ? 'tv' : 'movie';
  const detail = await TmdbHttpClient.getDetailsWithProviders(mediaType, item.id);

  const providers = detail?.['watch/providers']?.results || {};
  const flatrate = [...(providers.CO?.flatrate || []), ...(providers.MX?.flatrate || []), ...(providers.US?.flatrate || [])];
  const pNames = flatrate.map((p) => (p.provider_name || '').toLowerCase());

  if (pNames.some((p) => p.includes('crunchyroll'))) return PLATFORM_CONFIGS.crunchyroll;
  if (pNames.some((p) => p.includes('netflix'))) return PLATFORM_CONFIGS.netflix;
  if (pNames.some((p) => p.includes('disney'))) return PLATFORM_CONFIGS.disney;
  if (pNames.some((p) => p.includes('hbo') || p.includes('max'))) return PLATFORM_CONFIGS.max;
  if (pNames.some((p) => p.includes('amazon') || p.includes('prime'))) return PLATFORM_CONFIGS.prime;

  const titleLower = (item.title || item.name || '').toLowerCase();
  if (/spider-man|marvel|star wars|disney|moana|frozen/i.test(titleLower)) return PLATFORM_CONFIGS.disney;
  if (/batman|superman|dc |house of the dragon|dune/i.test(titleLower)) return PLATFORM_CONFIGS.max;
  if (/stranger things|squid game|bridgerton|wednesday/i.test(titleLower)) return PLATFORM_CONFIGS.netflix;
  if (/the boys|rings of power|fallout|reacher/i.test(titleLower)) return PLATFORM_CONFIGS.prime;

  // Si TMDb no reporta proveedor y no es franquicia exclusiva, se retorna null (sin etiqueta falsa)
  return null;
}
