import { create } from 'zustand';
import { CartItem } from '../domain/entities/CartItem';
import { CartCalculator } from '../domain/services/cartCalculator';
import { CartLocalStorage } from '../infrastructure/cartLocalStorage';
import { CartItemOperations } from '../domain/services/cartItemOperations';
import { CustomerProfileStorage } from '@/modules/customer/infrastructure/customerProfileStorage';
import { eventBus } from '@/core/bus/eventBus';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  customerName: string;
  customerContact: string;
  rememberCustomer: boolean;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleOpen: () => void;
  setCustomerName: (name: string) => void;
  setCustomerContact: (contact: string) => void;
  setRememberCustomer: (remember: boolean) => void;
  clearCart: () => void;
}

const initialProfile = CustomerProfileStorage.getProfile();

export const useCartStore = create<CartState>((set, get) => ({
  items: CartLocalStorage.getItems(),
  isOpen: false,
  customerName: initialProfile.name,
  customerContact: initialProfile.contact,
  rememberCustomer: initialProfile.rememberMe,
  total: CartCalculator.calculateTotal(CartLocalStorage.getItems()),

  addItem: (item: CartItem) => {
    const updated = CartItemOperations.addItem(get().items, item);
    if (!updated) return;
    CartLocalStorage.saveItems(updated);
    set({ items: updated, total: CartCalculator.calculateTotal(updated) });
    eventBus.emit('CART:ITEM_ADDED', item);
  },

  removeItem: (cartItemId: string) => {
    const updated = get().items.filter(i => i.cartItemId !== cartItemId);
    CartLocalStorage.saveItems(updated);
    set({ items: updated, total: CartCalculator.calculateTotal(updated) });
    eventBus.emit('CART:ITEM_REMOVED', cartItemId);
  },

  updateQuantity: (cartItemId: string, quantity: number) => {
    if (quantity <= 0) return get().removeItem(cartItemId);
    const updated = CartItemOperations.updateQuantity(get().items, cartItemId, quantity);
    CartLocalStorage.saveItems(updated);
    set({ items: updated, total: CartCalculator.calculateTotal(updated) });
  },

  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  toggleOpen: () => set(state => ({ isOpen: !state.isOpen })),

  setCustomerName: (name: string) => {
    set({ customerName: name });
    const { rememberCustomer, customerContact } = get();
    CustomerProfileStorage.saveProfile({ name, contact: customerContact, rememberMe: rememberCustomer });
  },

  setCustomerContact: (contact: string) => {
    set({ customerContact: contact });
    const { rememberCustomer, customerName } = get();
    CustomerProfileStorage.saveProfile({ name: customerName, contact, rememberMe: rememberCustomer });
  },

  setRememberCustomer: (remember: boolean) => {
    set({ rememberCustomer: remember });
    const { customerName, customerContact } = get();
    CustomerProfileStorage.saveProfile({ name: customerName, contact: customerContact, rememberMe: remember });
  },

  clearCart: () => {
    CartLocalStorage.clearItems();
    set({ items: [], total: 0 });
  },
}));
