import { SupabaseHttpClient } from '@/core/http/supabaseHttpClient';
import { Product } from '../domain/entities/Product';

export class ProductSupabaseSync {
  static async syncToSupabase(product: Product): Promise<void> {
    const slug = (product.brand || product.name).toLowerCase().replace(/[^a-z0-9]/g, '-');
    const price1m = product.modes?.pantalla?.prices?.['1m'] || product.modes?.cuenta?.prices?.['1m'] || 0;
    await SupabaseHttpClient.insert('products', {
      name: product.name,
      slug,
      brand: product.brand || 'Streaming',
      category: product.category || 'cine',
      is_available: product.available !== false,
      price_1m: price1m,
      metadata: { modes: product.modes, product },
    });
  }

  static async fetchFromSupabase(): Promise<Product[] | null> {
    const data = await SupabaseHttpClient.select<any>('products', 'select=*&is_active=eq.true');
    if (!data || !Array.isArray(data) || data.length === 0) return null;
    return data.map((d, idx) => {
      if (d.metadata?.product) return d.metadata.product as Product;
      const p1m = Number(d.price_1m) || 15000;
      return {
        id: idx + 1000,
        name: d.name,
        brand: d.brand,
        category: d.category || 'cine',
        brandGlow: 'from-blue-600 to-indigo-600',
        iconName: 'lucide:tv',
        logoBg: 'bg-blue-600',
        available: d.is_available,
        bestseller: false,
        badges: [],
        searchTags: [d.name.toLowerCase()],
        modes: d.metadata?.modes || {
          pantalla: {
            label: 'Pantalla', devices: '1 Pantalla', quality: 'Ultra HD', access: 'Código PIN',
            prices: { '1m': p1m, '3m': p1m * 3, '6m': p1m * 6, '12m': p1m * 12 },
            regularPrices: { '1m': p1m, '3m': p1m * 3, '6m': p1m * 6, '12m': p1m * 12 }
          },
          cuenta: {
            label: 'Cuenta Completa', devices: 'Múltiples', quality: '4K HDR', access: 'Correo y Clave',
            prices: { '1m': p1m * 2, '3m': p1m * 6, '6m': p1m * 12, '12m': p1m * 24 },
            regularPrices: { '1m': p1m * 2, '3m': p1m * 6, '6m': p1m * 12, '12m': p1m * 24 }
          }
        },
        includes: ['Garantía total', 'Soporte 24/7']
      };
    });
  }
}
