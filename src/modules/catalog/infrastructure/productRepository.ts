import { Product } from '../domain/entities/Product';
import { eventBus } from '@/core/bus/eventBus';
import excelData from './excelCatalogData.json';
import { obtenerCatalogo, actualizarPlataforma } from '@/shared/services/apiService';
import { getD1PlatformId } from './productD1Sync';

const PRODUCTS_STORAGE_KEY = 'cuentas_stream_products_v11';
export const initialProductsData: Product[] = excelData as Product[];

export class ProductRepository {
  private static cachedProducts: Product[] | null = null;

  static getProducts(): Product[] {
    if (this.cachedProducts) return this.cachedProducts;
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return (this.cachedProducts = parsed);
      }
    } catch (e) {}
    this.cachedProducts = [...initialProductsData];
    this.persist(this.cachedProducts);
    return this.cachedProducts;
  }

  static async fetchProductsAsync(): Promise<Product[]> {
    const local = this.getProducts();
    try {
      const d1Data = await obtenerCatalogo();
      if (d1Data?.plataformas?.length) {
        const updated = local.map((prod) => {
          const d1Id = getD1PlatformId(prod.brand || prod.name);
          const match = d1Id ? d1Data.plataformas.find((p) => p.id === d1Id) : null;
          if (!match) return prod;
          return { ...prod, available: match.entrega_inmediata === 1, modes: prod.modes?.pantalla ? { ...prod.modes, pantalla: { ...prod.modes.pantalla, prices: { ...prod.modes.pantalla.prices, '1m': match.precio } } } : prod.modes };
        });
        this.cachedProducts = updated;
        this.persist(updated);
        eventBus.emit('CATALOG:PRODUCTS_CHANGED', updated);
        return updated;
      }
    } catch (e) {}
    return local;
  }

  static getProductById(id: number): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  }

  static addProduct(newProd: Omit<Product, 'id'>): Product {
    const prods = this.getProducts();
    const created = { ...newProd, id: prods.length > 0 ? Math.max(...prods.map((p) => p.id)) + 1 : 1 };
    this.cachedProducts = [created, ...prods];
    this.persist(this.cachedProducts);
    eventBus.emit('CATALOG:PRODUCTS_CHANGED', this.cachedProducts);
    return created;
  }

  static updateProduct(id: number, fields: Partial<Product>): Product | undefined {
    const prods = this.getProducts();
    const idx = prods.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    const updated = { ...prods[idx], ...fields };
    prods[idx] = updated;
    this.cachedProducts = [...prods];
    this.persist(this.cachedProducts);
    eventBus.emit('CATALOG:PRODUCTS_CHANGED', this.cachedProducts);
    const d1Id = getD1PlatformId(updated.brand || updated.name);
    if (d1Id) actualizarPlataforma(d1Id, updated.modes?.pantalla?.prices?.['1m'] || 15000, updated.available).catch(() => {});
    return updated;
  }

  static deleteProduct(id: number): boolean {
    const filtered = this.getProducts().filter((p) => p.id !== id);
    this.cachedProducts = filtered;
    this.persist(filtered);
    eventBus.emit('CATALOG:PRODUCTS_CHANGED', filtered);
    return true;
  }

  static toggleAvailability(id: number): Product | undefined {
    const product = this.getProductById(id);
    return product ? this.updateProduct(id, { available: !product.available }) : undefined;
  }

  static resetToDefaults(): Product[] {
    this.cachedProducts = [...initialProductsData];
    this.persist(this.cachedProducts);
    eventBus.emit('CATALOG:PRODUCTS_CHANGED', this.cachedProducts);
    return this.cachedProducts;
  }

  private static persist(products: Product[]): void {
    try { localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products)); } catch (e) {}
  }
}
