import React from 'react';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { eventBus } from '@/core/bus/eventBus';

export const MobileBottomDock: React.FC = () => {
  const totalItems = useCartStore(state => state.items.reduce((sum, i) => sum + i.quantity, 0));

  const handleOpenCart = () => {
    eventBus.emit('CART:OPEN_DRAWER', undefined);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-900/[0.08] px-2 py-2 flex justify-around items-center text-[10px] font-bold text-slate-500 shadow-luxury">
      <a href="#catalogo" className="flex flex-col items-center gap-1 text-slate-900">
        <span className="text-base">🎬</span> Catálogo
      </a>
      <a href="#constructor" className="flex flex-col items-center gap-1 hover:text-slate-900">
        <span className="text-base">⚡</span> Combos
      </a>
      <button onClick={handleOpenCart} className="flex flex-col items-center gap-1 relative hover:text-slate-900">
        <span className="text-base">🛒</span> Carrito
        <span className="absolute -top-1 right-2 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {totalItems}
        </span>
      </button>
      <a href="https://wa.me/573214465418?text=Hola%20%F0%9F%90%8B%20Necesito%20ayuda" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-emerald-600">
        <span className="text-base">💬</span> Ayuda
      </a>
    </div>
  );
};
