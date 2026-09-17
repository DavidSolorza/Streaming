import React, { useEffect } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '../application/useCartStore';
import { CartItemRow } from './CartItemRow';
import { CartDrawerFooter } from './CartDrawerFooter';
import { eventBus } from '@/core/bus/eventBus';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, setIsOpen } = useCartStore();

  useEffect(() => {
    const unsubOpen = eventBus.on('CART:OPEN_DRAWER', () => setIsOpen(true));
    const unsubClose = eventBus.on('CART:CLOSE_DRAWER', () => setIsOpen(false));
    return () => { unsubOpen(); unsubClose(); };
  }, [setIsOpen]);

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsOpen(false)} />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen max-w-md bg-white border-l border-slate-900/[0.08] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-6 border-b border-slate-900/[0.08]">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-700" /> Tu Carrito Express
            </h2>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-900 p-1 transition rounded-lg hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <p className="text-slate-500 text-center py-12 text-xs font-semibold">Tu carrito está vacío. Agrega servicios desde el catálogo.</p>
            ) : (
              items.map((item) => <CartItemRow key={item.cartItemId} item={item} />)
            )}
          </div>
          <CartDrawerFooter />
        </div>
      </div>
    </div>
  );
};
