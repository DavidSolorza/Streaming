import { CartItem } from '../domain/entities/CartItem';

const CART_STORAGE_KEY = 'cuentas_stream_cart_items';

export class CartLocalStorage {
  static getItems(): CartItem[] {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveItems(items: CartItem[]): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Fallo al guardar carrito en localStorage:', e);
    }
  }

  static clearItems(): void {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {}
  }
}
