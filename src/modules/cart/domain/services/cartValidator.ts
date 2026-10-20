import { CartItem } from '../entities/CartItem';

export class CartValidator {
  /**
   * Determina si un producto es de prueba promocional o demo
   */
  static isTestItem(item: { id?: number; name: string }): boolean {
    const name = (item.name || '').toLowerCase();
    return item.id === 1 || name.includes('prueba') || name.includes('demo') || name.includes('test');
  }

  /**
   * Obtiene la cantidad máxima permitida para este ítem en una orden
   */
  static getMaxQuantity(item: { id?: number; name: string }): number {
    return this.isTestItem(item) ? 1 : 10;
  }

  /**
   * Valida la integridad del carrito:
   * - No permite más de 1 unidad en cuentas de prueba
   * - Verifica que precios y cantidades sean coherentes
   */
  static validateCart(items: CartItem[]): { isValid: boolean; error?: string } {
    for (const item of items) {
      if (this.isTestItem(item) && item.quantity > 1) {
        return {
          isValid: false,
          error: `El servicio "${item.name}" es una cuenta de prueba limitada a máximo 1 unidad por cliente.`,
        };
      }
      if (item.quantity <= 0) {
        return {
          isValid: false,
          error: `La cantidad para "${item.name}" debe ser mayor a 0.`,
        };
      }
    }
    return { isValid: true };
  }
}
