import React from 'react';
import { Film, HelpCircle, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { eventBus } from '@/core/bus/eventBus';

export const MobileBottomDock: React.FC = () => {
  const totalItems = useCartStore(state => state.items.reduce((sum, i) => sum + i.quantity, 0));

  const handleOpenCart = () => {
    eventBus.emit('CART:OPEN_DRAWER', undefined);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-900/[0.08] px-2 py-2.5 flex justify-around items-center text-[10px] font-bold text-slate-500 shadow-luxury">
      <a href="#catalog" className="flex flex-col items-center gap-1 text-slate-900">
        <Film className="w-4 h-4 text-blue-700" />
        <span>Catálogo</span>
      </a>
      <a href="#faq" className="flex flex-col items-center gap-1 hover:text-slate-900">
        <HelpCircle className="w-4 h-4 text-slate-600" />
        <span>Garantía</span>
      </a>
      <button onClick={handleOpenCart} className="flex flex-col items-center gap-1 relative hover:text-slate-900">
        <ShoppingBag className="w-4 h-4 text-slate-600" />
        <span>Carrito</span>
        <span className="absolute -top-1 right-2 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {totalItems}
        </span>
      </button>
      <a href="https://wa.me/573214465418?text=Hola%20Necesito%20ayuda" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-emerald-600">
        <MessageCircle className="w-4 h-4 text-emerald-600" />
        <span>Ayuda</span>
      </a>
    </div>
  );
};
