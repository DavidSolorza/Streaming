import { create } from 'zustand';
import { CartItem } from '../domain/entities/CartItem';
import { CartCalculator } from '../domain/services/cartCalculator';
import { CartLocalStorage } from '../infrastructure/cartLocalStorage';
import { eventBus } from '@/core/bus/eventBus';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  customerContact: string;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleOpen: () => void;
  setCustomerContact: (contact: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: CartLocalStorage.getItems(),
  isOpen: false,
  customerContact: '',
  total: CartCalculator.calculateTotal(CartLocalStorage.getItems()),

  addItem: (item: CartItem) => {
    const currentItems = get().items;
    const existingIndex = currentItems.findIndex(i => i.cartItemId === item.cartItemId);
    let updatedItems: CartItem[];

    if (existingIndex >= 0) {
      updatedItems = [...currentItems];
      updatedItems[existingIndex].quantity += item.quantity;
    } else {
      updatedItems = [...currentItems, item];
    }

    CartLocalStorage.saveItems(updatedItems);
    set({
      items: updatedItems,
      total: CartCalculator.calculateTotal(updatedItems),
      isOpen: true, // Abre el mini-cart de inmediato en 1 clic
    });

    // Despacha evento al bus desacoplado
    eventBus.emit('CART:ITEM_ADDED', item);
  },

  removeItem: (cartItemId: string) => {
    const updatedItems = get().items.filter(i => i.cartItemId !== cartItemId);
    CartLocalStorage.saveItems(updatedItems);
    set({
      items: updatedItems,
      total: CartCalculator.calculateTotal(updatedItems),
    });
    eventBus.emit('CART:ITEM_REMOVED', cartItemId);
  },

  updateQuantity: (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(cartItemId);
      return;
    }
    const updatedItems = get().items.map(i => i.cartItemId === cartItemId ? { ...i, quantity } : i);
    CartLocalStorage.saveItems(updatedItems);
    set({
      items: updatedItems,
      total: CartCalculator.calculateTotal(updatedItems),
    });
  },

  setIsOpen: (isOpen: boolean) => set({ isOpen }),

  toggleOpen: () => set(state => ({ isOpen: !state.isOpen })),

  setCustomerContact: (contact: string) => set({ customerContact: contact }),

  clearCart: () => {
    CartLocalStorage.clearItems();
    set({ items: [], total: 0 });
  },
}));
