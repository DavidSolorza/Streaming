import { CartItem } from '@/modules/cart/domain/entities/CartItem';
import { Product } from '@/modules/catalog/domain/entities/Product';

export type AppEvents = {
  'CART:ITEM_ADDED': CartItem;
  'CART:ITEM_REMOVED': string;
  'CART:OPEN_DRAWER': void;
  'CART:CLOSE_DRAWER': void;
  'CATALOG:OPEN_DETAILS': Product;
  'PAYMENT:OPEN_MODAL': void;
  'PAYMENT:CLOSE_MODAL': void;
  'NOTIFICATION:SHOW': { message: string; type: 'success' | 'info' | 'error' };
};
