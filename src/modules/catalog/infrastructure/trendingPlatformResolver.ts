export interface TrendingItem {
  id: string;
  title: string;
  platform: 'Netflix' | 'Disney+' | 'Max' | 'Prime Video' | 'Crunchyroll';
  platformId: string;
  platformColor: string;
  rating: number;
  posterUrl: string;
}

export const PLATFORM_CONFIGS: Record<string, { name: TrendingItem['platform']; platformId: string; color: string }> = {
  netflix: { name: 'Netflix', platformId: 'netflix', color: 'bg-red-600' },
  max: { name: 'Max', platformId: 'max', color: 'bg-blue-600' },
  disney: { name: 'Disney+', platformId: 'disney', color: 'bg-sky-600' },
  prime: { name: 'Prime Video', platformId: 'prime', color: 'bg-cyan-600' },
  crunchyroll: { name: 'Crunchyroll', platformId: 'crunchyroll', color: 'bg-orange-500' },
};

function getDeterministicPlatform(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = (hash << 5) - hash + title.charCodeAt(i);
  const fallbacks = [PLATFORM_CONFIGS.netflix, PLATFORM_CONFIGS.max, PLATFORM_CONFIGS.disney, PLATFORM_CONFIGS.prime];
  return fallbacks[Math.abs(hash) % fallbacks.length];
}

export async function resolvePlatformForItem(item: any, apiKey: string) {
  const mediaType = item.media_type === 'tv' ? 'tv' : 'movie';
  const detailUrl = `https://api.themoviedb.org/3/${mediaType}/${item.id}?api_key=${apiKey}&append_to_response=watch/providers`;
  let detail: any = null;
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(detailUrl, { signal: controller.signal });
    clearTimeout(t);
    if (res.ok) detail = await res.json();
  } catch (e) {}

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

  return getDeterministicPlatform(titleLower);
}
