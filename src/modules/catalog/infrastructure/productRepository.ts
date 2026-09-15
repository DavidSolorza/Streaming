import { Product } from '../domain/entities/Product';
import { eventBus } from '@/core/bus/eventBus';
import excelData from './excelCatalogData.json';
import { obtenerCatalogo, actualizarPlataforma } from '@/shared/services/apiService';

const PRODUCTS_STORAGE_KEY = 'cuentas_stream_products_v11';

export const initialProductsData: Product[] = excelData as Product[];

function getD1PlatformId(brand: string): string | null {
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

export class ProductRepository {
  private static cachedProducts: Product[] | null = null;

  /**
   * Obtiene la lista actual de productos (con persistencia en localStorage)
   */
  static getProducts(): Product[] {
    if (this.cachedProducts) {
      return this.cachedProducts;
    }

    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.cachedProducts = parsed;
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error al leer productos de localStorage:', e);
    }

    this.cachedProducts = [...initialProductsData];
    this.persist(this.cachedProducts);
    return this.cachedProducts;
  }

  /**
   * Servicio para obtener datos con sincronización remota en Cloudflare D1 (SQLite) y fallback local
   */
  static async fetchProductsAsync(): Promise<Product[]> {
    try {
      const localProducts = this.getProducts();

      // Intentar sincronizar en tiempo real desde Cloudflare D1
      try {
        const d1Data = await obtenerCatalogo();
        if (d1Data && d1Data.plataformas && d1Data.plataformas.length > 0) {
          const updatedList = localProducts.map((prod) => {
            const d1Id = getD1PlatformId(prod.brand || prod.name);
            if (!d1Id) return prod;
            const matchD1 = d1Data.plataformas.find((p) => p.id === d1Id);
            if (!matchD1) return prod;

            const newAvailable = matchD1.entrega_inmediata === 1;
            let newModes = { ...prod.modes };

            if (newModes.pantalla && newModes.pantalla.prices) {
              newModes.pantalla = {
                ...newModes.pantalla,
                prices: {
                  ...newModes.pantalla.prices,
                  '1m': matchD1.precio,
                },
              };
            }

            return {
              ...prod,
              available: newAvailable,
              modes: newModes,
            };
          });

          this.cachedProducts = updatedList;
          this.persist(updatedList);
          eventBus.emit('CATALOG:PRODUCTS_CHANGED', updatedList);
          return updatedList;
        }
      } catch (d1Err) {
        console.warn('Fallback a datos locales ante falta de conexión con D1:', d1Err);
      }

      return localProducts;
    } catch (error) {
      console.error('Fallo al obtener servicios del catálogo:', error);
      return this.getProducts();
    }
  }

  /**
   * Busca un producto por ID
   */
  static getProductById(id: number): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  }

  /**
   * Añade un nuevo producto al catálogo
   */
  static addProduct(newProduct: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const created: Product = { ...newProduct, id: nextId };

    const updatedList = [created, ...products];
    this.cachedProducts = updatedList;
    this.persist(updatedList);
    eventBus.emit('CATALOG:PRODUCTS_CHANGED', updatedList);
    return created;
  }

  /**
   * Edita la información o precios de un producto existente y sincroniza con Cloudflare D1
   */
  static updateProduct(id: number, updatedFields: Partial<Product>): Product | undefined {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    const updatedProduct = { ...products[index], ...updatedFields };
    products[index] = updatedProduct;

    this.cachedProducts = [...products];
    this.persist(this.cachedProducts);
    eventBus.emit('CATALOG:PRODUCTS_CHANGED', this.cachedProducts);

    // Persistir cambios en Cloudflare D1 en segundo plano
    const d1Id = getD1PlatformId(updatedProduct.brand || updatedProduct.name);
    if (d1Id) {
      const price1M = updatedProduct.modes?.pantalla?.prices?.['1m'] || 15000;
      actualizarPlataforma(d1Id, price1M, updatedProduct.available).catch((err) => {
        console.warn(`[Cloudflare D1] Error al actualizar plataforma ${d1Id}:`, err);
      });
    }

    return updatedProduct;
  }

  /**
   * Elimina un producto del catálogo
   */
  static deleteProduct(id: number): boolean {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;

    this.cachedProducts = filtered;
    this.persist(filtered);
    eventBus.emit('CATALOG:PRODUCTS_CHANGED', filtered);
    return true;
  }

  /**
   * Alterna el estado de disponibilidad ("Entrega Inmediata" vs "Agotado") en 1 clic y sincroniza con D1
   */
  static toggleAvailability(id: number): Product | undefined {
    const product = this.getProductById(id);
    if (!product) return undefined;
    return this.updateProduct(id, { available: !product.available });
  }

  /**
   * Restablece el catálogo a los datos originales por defecto
   */
  static resetToDefaults(): Product[] {
    this.cachedProducts = [...initialProductsData];
    this.persist(this.cachedProducts);
    eventBus.emit('CATALOG:PRODUCTS_CHANGED', this.cachedProducts);
    return this.cachedProducts;
  }

  private static persist(products: Product[]): void {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn('Error al guardar productos en localStorage:', e);
    }
  }
}
