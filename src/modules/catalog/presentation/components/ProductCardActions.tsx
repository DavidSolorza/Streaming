import React from 'react';
import { MessageCircle, Info, ShoppingCart, Check } from 'lucide-react';
import { formatCOP } from '@/core/utils/currency';

interface ProductCardActionsProps {
  currentPrice: number;
  available: boolean;
  whatsAppUrl: string;
  isAdded: boolean;
  onAddToCart: () => void;
  onOpenDetails: () => void;
}

export const ProductCardActions: React.FC<ProductCardActionsProps> = ({
  currentPrice, available, whatsAppUrl, isAdded, onAddToCart, onOpenDetails
}) => (
  <div className="pt-3 border-t border-slate-900/[0.08] space-y-2.5">
    <div className="flex items-baseline justify-between">
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-black text-slate-900">{formatCOP(currentPrice)}</span>
        <span className="text-[10px] font-medium text-slate-500">/ mes</span>
      </div>
    </div>
    {available ? (
      <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-luxury transition-all duration-200 hover:scale-[1.01]">
        <MessageCircle className="w-4 h-4 fill-current shrink-0" />
        <span>Pedir por WhatsApp Directo</span>
      </a>
    ) : (
      <button disabled className="w-full py-2.5 px-4 bg-slate-200 text-slate-500 font-bold text-xs rounded-xl text-center cursor-not-allowed">
        Agotado Temporalmente
      </button>
    )}
    <div className="grid grid-cols-2 gap-2 text-slate-600 text-xs font-bold">
      <button onClick={onOpenDetails} aria-label="Ver detalles del producto" className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center gap-1 transition">
        <Info className="w-3.5 h-3.5" />
        <span>Detalles</span>
      </button>
      <button disabled={!available} onClick={onAddToCart} aria-label="Añadir producto al carrito" className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 border transition disabled:opacity-50 ${isAdded ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold' : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-transparent hover:border-blue-200'}`}>
        {isAdded ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700">¡Añadido!</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>+ Carrito</span>
          </>
        )}
      </button>
    </div>
  </div>
);
