import { Product } from '../domain/entities/Product';
import { eventBus } from '@/core/bus/eventBus';
import excelData from './excelCatalogData.json';
import { ApiHttpClient } from '@/core/http/apiHttpClient';
import { getD1PlatformId } from './productD1Sync';

const STORAGE_KEY = 'cuentas_stream_products_v12';
export const initialProductsData: Product[] = excelData as Product[];

export class ProductRepository {
  private static cached: Product[] | null = null;

  static getProducts(): Product[] {
    if (this.cached) return this.cached;
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) { const p = JSON.parse(s); if (Array.isArray(p) && p.length) return (this.cached = p); }
    } catch {}
    this.cached = [...initialProductsData];
    this.persist(this.cached);
    return this.cached;
  }

  static async fetchProductsAsync(): Promise<Product[]> {
    const local = this.getProducts();
    try {
      const res = await ApiHttpClient.get<any[]>('/plataformas');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const updated = local.map((prod) => {
          const m = res.data!.find((p: any) => p.id === getD1PlatformId(prod.brand || prod.name));
          if (!m) return prod;
          const p = prod.modes?.pantalla;
          return {
            ...prod,
            available: m.activo === 1,
            directWhatsAppUrl: m.directWhatsAppUrl,
            priceFormatted: m.priceFormatted,
            modes: p ? { ...prod.modes, pantalla: { ...p, prices: { ...p.prices, '1m': m.precio } } } : prod.modes
          };
        });
        this.cached = updated;
        this.persist(updated);
        eventBus.emit('CATALOG:PRODUCTS_CHANGED', updated);
        return updated;
      }
    } catch (e) {
      console.warn('[ProductRepository] Error al sincronizar con backend SQLite:', e);
    }
    return local;
  }

  static getProductById(id: number): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  }

  static addProduct(newProd: Omit<Product, 'id'>): Product {
    const prods = this.getProducts();
    const created = { ...newProd, id: prods.length ? Math.max(...prods.map((p) => p.id)) + 1 : 1 };
    this.cached = [created, ...prods];
    this.persist(this.cached);
    eventBus.emit('CATALOG:PRODUCTS_CHANGED', this.cached);
    return created;
  }

  static updateProduct(id: number, fields: Partial<Product>): Product | undefined {
    const prods = this.getProducts();
    const idx = prods.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    const updated = { ...prods[idx], ...fields };
    prods[idx] = updated;
    this.cached = [...prods];
    this.persist(this.cached);
    eventBus.emit('CATALOG:PRODUCTS_CHANGED', this.cached);

    const platId = getD1PlatformId(updated.brand || updated.name);
    if (platId) {
      const price = updated.modes?.pantalla?.prices?.['1m'] || 15000;
      ApiHttpClient.put('/plataformas', { id: platId, precio: price, activo: updated.available !== false }).catch(() => {});
    }
    return updated;
  }

  static deleteProduct(id: number): boolean {
    this.cached = this.getProducts().filter((p) => p.id !== id);
    this.persist(this.cached);
    eventBus.emit('CATALOG:PRODUCTS_CHANGED', this.cached);
    return true;
  }

  static toggleAvailability(id: number): Product | undefined {
    const p = this.getProductById(id);
    return p ? this.updateProduct(id, { available: !p.available }) : undefined;
  }

  static resetToDefaults(): Product[] {
    this.cached = [...initialProductsData];
    this.persist(this.cached);
    eventBus.emit('CATALOG:PRODUCTS_CHANGED', this.cached);
    return this.cached;
  }

  private static persist(products: Product[]): void {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(products)); } catch {}
  }
}
