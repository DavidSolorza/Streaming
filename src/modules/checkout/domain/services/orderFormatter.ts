import { CartItem } from '@/modules/cart/domain/entities/CartItem';

export class OrderFormatter {
  static generateOrderId(): string {
    const randomHex = Math.floor(100000 + Math.random() * 900000);
    return `ORD-${randomHex}`;
  }

  static formatQuoteMessage(items: CartItem[], total: number, contact: string, orderId: string, customerName?: string): string {
    let msg = '';
    if (customerName && customerName.trim()) {
      msg += `¡Hola equipo JP! Mi nombre es *${customerName.trim()}*, un gusto saludarlos.\n\n`;
    }
    msg += `*COTIZACIÓN OFICIAL*\n`;
    msg += `*Orden:* \`${orderId}\`\n`;
    if (customerName && customerName.trim()) {
      msg += `*Cliente:* ${customerName.trim()}\n`;
    }
    if (contact && contact.trim()) {
      msg += `*Contacto:* \`${contact.trim()}\`\n`;
    }
    msg += `──────────────────────────\n`;
    msg += `*Detalle del pedido:*\n`;

    items.forEach((item) => {
      const subtotal = item.price * item.quantity;
      msg += `*${item.name}*\n`;
      msg += `   • Cantidad: ${item.quantity}\n`;
      msg += `   • Subtotal: *$${subtotal.toLocaleString('es-CO')} COP*\n`;
    });

    msg += `──────────────────────────\n`;
    msg += `*TOTAL A PAGAR:* *$${total.toLocaleString('es-CO')} COP*\n`;
    msg += `*Ref. Control:* \`${orderId}-${total}\`\n`;
    msg += `──────────────────────────\n`;
    msg += `*Aviso de Conciliación:*\n`;
    msg += `El valor transferido debe coincidir exactamente con los *$${total.toLocaleString('es-CO')} COP* cotizados. Cualquier cambio en cantidades o pantallas adicionales requiere re-cotización previa antes del pago.\n\n`;
    msg += `Quedo muy atento a las instrucciones para realizar el pago. ¡Muchas gracias!`;
    return msg;
  }

  static formatPaymentProofMessage(items: CartItem[], total: number, contact: string, orderId: string, customerName?: string): string {
    let msg = '';
    if (customerName && customerName.trim()) {
      msg += `¡Hola equipo JP! Mi nombre es *${customerName.trim()}*.\n\n`;
    }
    msg += `*REPORTE DE PAGO*\n`;
    msg += `*Orden:* \`${orderId}\`\n`;
    if (customerName && customerName.trim()) {
      msg += `*Cliente:* ${customerName.trim()}\n`;
    }
    if (contact && contact.trim()) {
      msg += `*Contacto:* \`${contact.trim()}\`\n`;
    }
    msg += `──────────────────────────\n`;
    msg += `*Detalle de la orden:*\n`;

    items.forEach((item) => {
      const subtotal = item.price * item.quantity;
      msg += `*${item.name}*\n`;
      msg += `   • Cantidad: ${item.quantity}\n`;
      msg += `   • Subtotal: *$${subtotal.toLocaleString('es-CO')} COP*\n`;
    });

    msg += `──────────────────────────\n`;
    msg += `*TOTAL LIQUIDADO:* *$${total.toLocaleString('es-CO')} COP*\n`;
    msg += `*Ref. Control:* \`${orderId}-${total}\`\n`;
    msg += `──────────────────────────\n`;
    msg += `*Estado:* Adjunto comprobante bancario para validación de la orden y entrega de credenciales. ¡Muchas gracias por la atención!`;
    return msg;
  }
}
