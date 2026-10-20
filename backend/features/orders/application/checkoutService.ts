import type { IOrderRepository } from '../domain/orderContracts.ts';
import type { IAdminRepository } from '../../admin/domain/adminContracts.ts';
import { busService } from '../../../core/bus/busService.ts';

export interface CheckoutItemInput {
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutResult {
  success: boolean;
  orderCode: string;
  total: number;
  totalFormatted: string;
  whatsAppUrl: string;
}

export class CheckoutService {
  private orderRepo: IOrderRepository;
  private adminRepo: IAdminRepository;

  constructor(orderRepo: IOrderRepository, adminRepo: IAdminRepository) {
    this.orderRepo = orderRepo;
    this.adminRepo = adminRepo;
  }

  processCheckout(customerName: string, customerContact: string | undefined, items: CheckoutItemInput[]): CheckoutResult {
    const validItems = (items || []).filter((i) => i.quantity > 0 && i.price > 0);
    const total = validItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalFormatted = `$${total.toLocaleString('es-CO')} COP`;

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderCode = `ORD-${randomSuffix}`;
    const cleanName = (customerName || '').trim() || 'Cliente VIP';
    const itemsSummary = validItems.map((i) => `${i.name} (x${i.quantity})`).join(', ');

    this.orderRepo.createOrder({
      orderCode,
      customerName: cleanName,
      customerContact,
      itemsSummary,
      totalCop: total,
      paymentMethod: 'transferencia'
    });

    busService.publish('ORDER:CREATED', {
      orderCode,
      customerName: cleanName,
      customerContact,
      itemsSummary,
      totalCop: total,
      paymentMethod: 'transferencia'
    });

    const storeConfig = this.adminRepo.getStoreConfig();
    const phone = (storeConfig.whatsappNumber || '573214465418').replace(/\D/g, '');

    const lines = [
      '👋 *¡Hola! Vengo de la tienda web y quiero confirmar mi pedido:*',
      `🧾 *Código de Pedido:* \`${orderCode}\``,
      `👤 *Cliente:* ${cleanName}`,
      '',
      '*📦 Detalle de Servicios:*',
      ...validItems.map((i) => `• ${i.name} x${i.quantity} — $${(i.price * i.quantity).toLocaleString('es-CO')} COP`),
      '',
      `💰 *Total a Transferir:* *${totalFormatted}*`,
      '💳 *Medio de Pago:* Nequi / Bancolombia / Daviplata',
      '',
      '¿Me confirmas disponibilidad para realizar la transferencia? ¡Muchas gracias!'
    ];

    const message = lines.join('\n');
    const whatsAppUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    return {
      success: true,
      orderCode,
      total,
      totalFormatted,
      whatsAppUrl
    };
  }
}
