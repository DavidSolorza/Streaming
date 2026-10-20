import { CartItem } from '@/modules/cart/domain/entities/CartItem';
import { OrderFormatter } from '../domain/services/orderFormatter';

export class WhatsAppAdapter {
  private static readonly PHONE_NUMBER = '573214465418';

  static generateOrderUrl(items: CartItem[], total: number, contactInfo?: string, customerName?: string): string {
    const orderId = OrderFormatter.generateOrderId();
    const message = OrderFormatter.formatQuoteMessage(items, total, contactInfo || '', orderId, customerName);
    return `https://wa.me/${this.PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  static generatePaymentProofUrl(items: CartItem[], total: number, contactInfo?: string, customerName?: string): string {
    const orderId = OrderFormatter.generateOrderId();
    const message = OrderFormatter.formatPaymentProofMessage(items, total, contactInfo || '', orderId, customerName);
    return `https://wa.me/${this.PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
  }
}
