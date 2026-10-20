import { CartItem } from '../entities/CartItem';
import { CartValidator } from './cartValidator';
import { eventBus } from '@/core/bus/eventBus';

export class CartItemOperations {
  static addItem(currentItems: CartItem[], item: CartItem): CartItem[] | null {
    const existingIndex = currentItems.findIndex(i => i.cartItemId === item.cartItemId);
    const maxAllowed = CartValidator.getMaxQuantity(item);

    if (existingIndex >= 0) {
      const newQty = currentItems[existingIndex].quantity + item.quantity;
      if (newQty > maxAllowed) {
        eventBus.emit('NOTIFICATION:SHOW', {
          title: 'Límite por Cliente',
          message: `El servicio "${item.name}" tiene un límite de ${maxAllowed} unidad por cliente.`,
          type: 'warning',
        });
        return null;
      }
      const updated = [...currentItems];
      updated[existingIndex].quantity = newQty;
      return updated;
    }

    const initialQty = Math.min(item.quantity, maxAllowed);
    return [...currentItems, { ...item, quantity: initialQty }];
  }

  static updateQuantity(currentItems: CartItem[], cartItemId: string, quantity: number): CartItem[] {
    const item = currentItems.find(i => i.cartItemId === cartItemId);
    let finalQty = quantity;
    if (item) {
      const maxAllowed = CartValidator.getMaxQuantity(item);
      if (quantity > maxAllowed) {
        finalQty = maxAllowed;
        eventBus.emit('NOTIFICATION:SHOW', {
          title: 'Límite por Cliente',
          message: `Máximo permitido para "${item.name}": ${maxAllowed} unidad.`,
          type: 'warning',
        });
      }
    }
    return currentItems.map(i => i.cartItemId === cartItemId ? { ...i, quantity: finalQty } : i);
  }
}
