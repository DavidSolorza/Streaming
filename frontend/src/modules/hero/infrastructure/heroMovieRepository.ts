import { ENV } from '@/core/config/env';
import { FeaturedMovieItem } from '../presentation/useHeroShowcase';
import { ProductRepository } from '@/modules/catalog/infrastructure/productRepository';
import { TmdbHttpClient } from '@/core/http/tmdbHttpClient';

const CACHE_KEY = 'hero_live_movies_v3';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export class HeroMovieRepository {
  static getCachedMovies(): FeaturedMovieItem[] | null {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      const time = localStorage.getItem(`${CACHE_KEY}_time`);
      if (stored && time && Date.now() - Number(time) < ONE_DAY_MS) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return null;
  }

  static async fetchLiveMovies(): Promise<FeaturedMovieItem[]> {
    try {
      const results = await TmdbHttpClient.getTrendingMovies('week');
      if (!results || results.length === 0) return [];

      const rawItems = results.filter((m) => m.poster_path && m.title).slice(0, 6);
      const products = ProductRepository.getProducts();

      const processed = await Promise.all(
        rawItems.map(async (item) => {
          const videos = await TmdbHttpClient.getVideos('movie', item.id);
          const trailer = videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
          const trailerKey = trailer?.key || '';
          const platform = await this.resolvePlatform(item.id, item.title || '', item.overview || '', products);

          return {
            id: `tmdb-${item.id}`,
            movieTitle: item.title || 'Estreno en Cartelera',
            brand: platform ? platform.brand : undefined,
            icon: platform ? platform.icon : undefined,
            rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : 8.5,
            tagline: platform ? `Estreno HD • ${platform.brand}` : 'Estreno HD • Cartelera Oficial',
            description: item.overview || 'Sinopsis oficial obtenida en tiempo real desde TMDb.',
            price: platform ? platform.price : undefined,
            productId: platform ? platform.productId : undefined,
            youtubeId: trailerKey || 'Bk1Hf0FtR7k',
            posterUrl: `${ENV.TMDB_IMAGE_BASE_URL}${item.poster_path}`,
            backdropUrl: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : undefined,
            whatsappMessage: platform
              ? `*SOLICITUD DE STREAMING*\n──────────────────────────\n*Película:* ${item.title}\n*Plataforma:* ${platform.brand}\n*Precio:* $${platform.price.toLocaleString('es-CO')} COP / mes\n──────────────────────────\nDeseo contratar este servicio. ¿Me compartes los datos de pago para entrega inmediata?`
              : `*CONSULTA DE CARTELERA*\n──────────────────────────\n*Película:* ${item.title}\n──────────────────────────\nMe interesa esta película. ¿En qué plataforma o servicio de streaming la tienen disponible?`,
          } as FeaturedMovieItem;
        })
      );

      const valid = processed.filter(Boolean);
      if (valid.length > 0) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(valid));
        localStorage.setItem(`${CACHE_KEY}_time`, String(Date.now()));
        return valid;
      }
    } catch (e) {
      console.error('Error al actualizar películas del Hero:', e);
    }
    return [];
  }

  private static async resolvePlatform(id: number, title: string, overview: string, products: any[]) {
    const detail = await TmdbHttpClient.getDetailsWithProviders('movie', id);
    const providers = detail?.['watch/providers']?.results || {};
    const flatrate = [...(providers.CO?.flatrate || []), ...(providers.MX?.flatrate || []), ...(providers.US?.flatrate || [])];
    const pNames = flatrate.map((p: any) => (p.provider_name || '').toLowerCase());

    const platformsMap: Record<string, { brand: string; icon: string; defaultPrice: number; productId: number }> = {
      netflix: { brand: 'Netflix', icon: '/icons/icons8-netflix-desktop-app-windows-11-color/icons8-netflix-desktop-app-96.png', defaultPrice: 17000, productId: 2 },
      disney: { brand: 'Disney+', icon: '/icons/icons8-disney-plus-windows-11-color/icons8-disney-plus-96.png', defaultPrice: 16000, productId: 3 },
      max: { brand: 'Max', icon: '/icons/icons8-hbo-max-ios-27-outlined/icons8-hbo-max-100.png', defaultPrice: 15000, productId: 4 },
      prime: { brand: 'Prime Video', icon: '/icons/icons8-amazon-prime-video-color/icons8-amazon-prime-video-96.png', defaultPrice: 14000, productId: 5 },
      crunchyroll: { brand: 'Crunchyroll', icon: '/icons/icons8-crunchyroll-windows-11-color/icons8-crunchyroll-96.png', defaultPrice: 12000, productId: 7 },
    };

    let key: string | null = null;
    if (pNames.some((p: string) => p.includes('crunchyroll'))) key = 'crunchyroll';
    else if (pNames.some((p: string) => p.includes('netflix'))) key = 'netflix';
    else if (pNames.some((p: string) => p.includes('disney'))) key = 'disney';
    else if (pNames.some((p: string) => p.includes('hbo') || p.includes('max'))) key = 'max';
    else if (pNames.some((p: string) => p.includes('amazon') || p.includes('prime'))) key = 'prime';

    if (!key) {
      const text = (title + ' ' + overview).toLowerCase();
      if (/spider-man|marvel|star wars|moana|frozen/i.test(text)) key = 'disney';
      else if (/batman|superman|dc |house of the dragon/i.test(text)) key = 'max';
      else if (/stranger things|squid game/i.test(text)) key = 'netflix';
      else if (/the boys|rings of power/i.test(text)) key = 'prime';
    }

    if (!key) return null; // No inventar plataformas si TMDb no reporta dónde verla

    const base = platformsMap[key];
    let price = base.defaultPrice;
    let productId = base.productId;
    const matchProd = products.find((p) => p.brand?.toLowerCase() === base.brand.toLowerCase());
    if (matchProd?.modes?.pantalla?.prices?.['1m']) {
      price = matchProd.modes.pantalla.prices['1m'];
      productId = matchProd.id;
    }
    return { brand: base.brand, icon: base.icon, price, productId };
  }
}
