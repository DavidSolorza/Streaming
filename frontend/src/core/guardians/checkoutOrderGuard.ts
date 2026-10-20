import { CartItem } from '@/modules/cart/domain/entities/CartItem';

export interface GuardValidationResult {
  isValid: boolean;
  message?: string;
}

export class CheckoutOrderGuard {
  static validateItems(items: CartItem[]): GuardValidationResult {
    if (!items || items.length === 0) {
      return { isValid: false, message: 'El carrito no contiene ningún servicio.' };
    }

    for (const item of items) {
      if (item.quantity <= 0) {
        return { isValid: false, message: `Cantidad inválida para ${item.name}.` };
      }
      if (item.price <= 0) {
        return { isValid: false, message: `Precio inválido para ${item.name}.` };
      }
    }

    return { isValid: true };
  }

  static sanitizeName(raw: string): string {
    return raw
      .replace(/[<>{}[\]\\]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
