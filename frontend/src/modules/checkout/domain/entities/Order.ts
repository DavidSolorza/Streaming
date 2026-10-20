import { CartItem } from '@/modules/cart/domain/entities/CartItem';

export interface Order {
  id: string;
  customerContact: string;
  items: CartItem[];
  totalCop: number;
  paymentMethod: 'whatsapp' | 'nequi' | 'daviplata' | 'bancolombia';
  createdAt: Date;
}
