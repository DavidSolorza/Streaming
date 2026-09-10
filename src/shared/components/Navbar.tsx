import React from 'react';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { eventBus } from '@/core/bus/eventBus';

export const Navbar: React.FC = () => {
  const totalItems = useCartStore(state => state.items.reduce((sum, i) => sum + i.quantity, 0));

  const handleOpenCart = () => {
    eventBus.emit('CART:OPEN_DRAWER', undefined);
  };

  return (
    <header className="sticky top-3 z-40 mx-4 max-w-7xl md:mx-auto transition-all">
      <div className="bg-white/90 backdrop-blur-xl border border-slate-900/[0.08] rounded-2xl h-16 shadow-luxury px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center font-black text-lg shadow-md shadow-blue-600/20 text-white">
            4S
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-none">Cuentas Stream</span>
            <span className="text-[9px] text-blue-700 font-bold uppercase tracking-wider block mt-0.5">Multiplataformas</span>
          </div>
        </div>

        {/* Menú Central */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-bold text-slate-600">
          <a href="#catalog" className="hover:text-blue-700 transition">Catálogo</a>
          <a href="#combos" className="hover:text-blue-700 transition">Arma tu Combo</a>
          <a href="#faq" className="hover:text-blue-700 transition">Garantía & FAQ</a>
        </nav>

        {/* Acciones */}
        <div className="flex items-center space-x-2.5">
          <a
            href="https://wa.me/573214465418?text=Hola%20%F0%9F%90%8B%20Quiero%20mas%20informacion"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-500/20 px-3.5 py-2 rounded-xl transition font-extrabold items-center gap-1.5"
          >
            💬 Soporte
          </a>
          <button
            onClick={handleOpenCart}
            className="relative bg-blue-700 hover:bg-blue-800 text-white p-2.5 rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center justify-center"
            title="Ver Carrito Express"
          >
            🛒
            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
              {totalItems}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
