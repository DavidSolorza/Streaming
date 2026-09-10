import React from 'react';
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
        <span className="text-xl">{item.image}</span>
        <div>
          <h4 className="text-xs font-extrabold text-slate-900">{item.name}</h4>
          <span className="text-xs text-slate-500 font-medium">
            ${item.price.toLocaleString('es-CO')} COP x {item.quantity}
          </span>
        </div>
      </div>
      <button
        onClick={() => removeItem(item.cartItemId)}
        className="text-slate-400 hover:text-rose-600 text-sm font-black px-2 py-1 transition"
        title="Eliminar del carrito"
      >
        &times;
      </button>
    </div>
  );
};
