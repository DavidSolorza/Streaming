import { CartItem } from '@/modules/cart/domain/entities/CartItem';

export class WhatsAppAdapter {
  private static readonly PHONE_NUMBER = '573214465418';

  static generateOrderUrl(items: CartItem[], total: number, contactInfo?: string): string {
    let message = "Hola 👋 ¡Quiero adquirir los siguientes servicios en Cuentas Stream:\n\n";
    items.forEach(item => {
      message += `• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString('es-CO')} COP\n`;
    });
    message += `\n*Total a pagar:* $${total.toLocaleString('es-CO')} COP\n`;
    if (contactInfo && contactInfo.trim()) {
      message += `*Datos de Contacto:* ${contactInfo.trim()}\n`;
    }
    message += `\nQuedo atento a los datos para realizar la transferencia. ¡Muchas gracias!`;

    const encodedText = encodeURIComponent(message);
    return `https://wa.me/${this.PHONE_NUMBER}?text=${encodedText}`;
  }

  static generatePaymentProofUrl(items: CartItem[], total: number, contactInfo?: string): string {
    let message = "Hola 👋 Ya realicé mi pago en Cuentas Stream para los siguientes servicios:\n\n";
    items.forEach(item => {
      message += `• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString('es-CO')} COP\n`;
    });
    message += `\n*Total pagado:* $${total.toLocaleString('es-CO')} COP\n`;
    if (contactInfo && contactInfo.trim()) {
      message += `*Contacto:* ${contactInfo.trim()}\n`;
    }
    message += `\nAdjunto el comprobante de transferencia para la activación de mis credenciales.`;

    const encodedText = encodeURIComponent(message);
    return `https://wa.me/${this.PHONE_NUMBER}?text=${encodedText}`;
  }
}
