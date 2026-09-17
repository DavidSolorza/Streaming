import { CartItem } from '../entities/CartItem';

/**
 * ⚙️ Capa de Lógica de Negocio (Servicio) - Reglas de Dominio del Carrito
 */
export class CartService {
  static calculateSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  static calculateTotalCount(items: CartItem[]): number {
    return items.reduce((count, item) => count + item.quantity, 0);
  }

  static buildWhatsAppCheckoutMessage(items: CartItem[], total: number, contact: string): string {
    let msg = "¡Hola! Quiero adquirir los siguientes servicios en Cuentas JP:\n\n";
    items.forEach((item) => {
      msg += `• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString('es-CO')} COP\n`;
    });
    msg += `\n*Total a pagar:* $${total.toLocaleString('es-CO')} COP\n`;
    if (contact.trim()) msg += `*Contacto:* ${contact.trim()}\n`;
    msg += `\nQuedo atento a los datos para la transferencia. ¡Muchas gracias!`;
    return msg;
  }
}
