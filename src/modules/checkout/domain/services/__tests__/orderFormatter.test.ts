import { describe, it, expect } from 'vitest';
import { OrderFormatter } from '../orderFormatter';
import { CartItem } from '@/modules/cart/domain/entities/CartItem';

describe('OrderFormatter', () => {
  const items: CartItem[] = [
    { cartItemId: '1', id: 2, name: 'Netflix Original 4K', price: 17000, quantity: 1, image: '' }
  ];

  it('generates order ID in standard format ORD-XXXXXX', () => {
    const id = OrderFormatter.generateOrderId();
    expect(id).toMatch(/^ORD-\d{6}$/);
  });

  it('formats friendly quote message with customer name and exact amounts', () => {
    const msg = OrderFormatter.formatQuoteMessage(items, 17000, '3101234567', 'ORD-123456', 'Juan Pérez');
    expect(msg).toContain('Juan Pérez');
    expect(msg).toContain('*COTIZACIÓN OFICIAL*');
    expect(msg).toContain('ORD-123456');
    expect(msg).toContain('$17.000 COP');
    expect(msg).toContain('*Ref. Control:* `ORD-123456-17000`');
    expect(msg).not.toContain('\uFFFD');
    expect(msg).not.toContain('▪');
  });

  it('formats payment proof message cleanly for WhatsApp', () => {
    const msg = OrderFormatter.formatPaymentProofMessage(items, 17000, '3101234567', 'ORD-123456', 'Laura');
    expect(msg).toContain('*REPORTE DE PAGO*');
    expect(msg).toContain('Laura');
    expect(msg).toContain('*TOTAL LIQUIDADO:* *$17.000 COP*');
    expect(msg).toContain('Adjunto comprobante bancario');
    expect(msg).not.toContain('\uFFFD');
  });
});
