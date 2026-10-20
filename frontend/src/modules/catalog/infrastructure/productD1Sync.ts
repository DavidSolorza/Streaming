export function getD1PlatformId(brand: string): string | null {
  const b = brand.toLowerCase();
  if (b.includes('netflix')) return 'netflix';
  if (b.includes('disney')) return 'disney';
  if (b.includes('max') || b.includes('hbo')) return 'max';
  if (b.includes('prime') || b.includes('amazon')) return 'prime';
  if (b.includes('spotify')) return 'spotify';
  if (b.includes('crunchyroll')) return 'crunchyroll';
  if (b.includes('youtube')) return 'youtube';
  if (b.includes('canva')) return 'canva';
  if (b.includes('capcut')) return 'capcut';
  if (b.includes('gemini')) return 'gemini';
  if (b.includes('iptv') || b.includes('magis')) return 'iptv';
  return null;
}
