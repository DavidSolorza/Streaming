import { CartItem } from '@/modules/cart/domain/entities/CartItem';
import { Product } from '@/modules/catalog/domain/entities/Product';
import { PaymentConfig } from '@/modules/admin/domain/entities/AdminConfig';

export type AppEvents = {
  'CART:ITEM_ADDED': CartItem;
  'CART:ITEM_REMOVED': string;
  'CART:OPEN_DRAWER': void;
  'CART:CLOSE_DRAWER': void;
  'CATALOG:OPEN_DETAILS': Product;
  'CATALOG:PRODUCTS_CHANGED': Product[];
  'PAYMENT:OPEN_MODAL': void;
  'PAYMENT:CLOSE_MODAL': void;
  'ADMIN:OPEN_MODAL': void;
  'ADMIN:CLOSE_MODAL': void;
  'ADMIN:EDIT_PRODUCT': Product;
  'ADMIN:CONFIG_CHANGED': PaymentConfig;
  'NOTIFICATION:SHOW': { message: string; type: 'success' | 'info' | 'error' };
};
