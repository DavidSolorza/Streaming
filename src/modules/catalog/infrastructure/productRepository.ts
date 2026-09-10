import { Product } from '../domain/entities/Product';
import { eventBus } from '@/core/bus/eventBus';
import excelData from './excelCatalogData.json';

const PRODUCTS_STORAGE_KEY = 'cuentas_stream_products_v4';

export const initialProductsData: Product[] = excelData as Product[];

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
   * Edita la información o precios de un producto existente
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
   * Alterna el estado de disponibilidad ("Entrega Inmediata" vs "Agotado") en 1 clic
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
