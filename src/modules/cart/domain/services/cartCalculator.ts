import { CartItem } from '../entities/CartItem';

export class CartCalculator {
  static calculateTotal(items: CartItem[]): number {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  static calculateSavings(items: CartItem[]): number {
    return items.reduce((acc, item) => {
      const original = item.originalPrice || item.price;
      return acc + (original - item.price) * item.quantity;
    }, 0);
  }
}
