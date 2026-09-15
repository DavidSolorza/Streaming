import React from 'react';
import { PlatformIcon } from '@/shared/components/PlatformIcon';
import { Trash2 } from 'lucide-react';
import { CartItem } from '../domain/entities/CartItem';
import { useCartStore } from '../application/useCartStore';

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const removeItem = useCartStore(state => state.removeItem);

  return (
    <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-900/[0.08]">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white border border-slate-900/[0.08] flex items-center justify-center p-1.5 shadow-sm overflow-hidden">
          <PlatformIcon icon={item.image} name={item.name} className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-slate-900">{item.name}</h4>
          <span className="text-xs text-slate-500 font-medium">
            ${item.price.toLocaleString('es-CO')} COP x {item.quantity}
          </span>
        </div>
      </div>
      <button
        onClick={() => removeItem(item.cartItemId)}
        className="text-slate-400 hover:text-rose-600 p-1.5 transition rounded-lg hover:bg-rose-50"
        title="Eliminar del carrito"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
