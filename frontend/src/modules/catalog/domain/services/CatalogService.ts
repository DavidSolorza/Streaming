import { Product } from '../entities/Product';

/**
 * ⚙️ Capa de Lógica de Negocio (Servicio) - Reglas de Dominio del Catálogo
 */
export class CatalogService {
  static filterProducts(
    products: Product[],
    category: string,
    query: string = ''
  ): Product[] {
    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      const matchCategory = category === 'all' || p.category === category;
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.searchTags.some((t) => t.toLowerCase().includes(q));
      return matchCategory && matchQuery;
    });
  }

  static getProductPrice1M(product: Product): number {
    if (product.customPlans && product.customPlans.length > 0) {
      return product.customPlans[0].price;
    }
    return product.modes.pantalla.prices['1m'] || 15000;
  }

  static calculateSavings(currentPrice: number, regularPrice?: number): number {
    if (!regularPrice || regularPrice <= currentPrice) return 0;
    return regularPrice - currentPrice;
  }
}
