import React, { useState, useEffect } from 'react';
import { MessageCircle, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { AdminRepository } from '@/modules/admin/infrastructure/adminRepository';
import { PaymentConfig } from '@/modules/admin/domain/entities/AdminConfig';
import { eventBus } from '@/core/bus/eventBus';

export const Navbar: React.FC = () => {
  const totalItems = useCartStore(state => state.items.reduce((sum, i) => sum + i.quantity, 0));
  const [config, setConfig] = useState<PaymentConfig>(() => AdminRepository.getPaymentConfig());

  useEffect(() => {
    const unsub = eventBus.on('ADMIN:CONFIG_CHANGED', (newConfig) => {
      setConfig(newConfig);
    });
    return unsub;
  }, []);

  const handleOpenCart = () => {
    eventBus.emit('CART:OPEN_DRAWER', undefined);
  };

  const handleOpenAdmin = () => {
    window.location.hash = '#admin';
  };

  const cleanPhone = config.whatsappNumber.replace(/\D/g, '');

  return (
    <header className="sticky top-3 z-40 mx-4 max-w-7xl md:mx-auto transition-all">
      <div className="bg-white/95 backdrop-blur-xl border border-slate-900/[0.08] rounded-2xl h-20 sm:h-22 shadow-luxury px-4 sm:px-6 flex items-center justify-between">
        {/* Logo Agrandado de Alto Impacto */}
        <div
          className="flex items-center space-x-4 cursor-pointer py-2 group"
          onClick={() => {
            if (window.location.hash === '#admin') {
              window.location.hash = '';
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 border-blue-600 ring-4 ring-blue-500/25 shadow-2xl shadow-blue-600/30 flex items-center justify-center bg-white shrink-0 p-0.5 transition-all duration-300 group-hover:scale-105 group-hover:ring-blue-500/50">
            <img src="/perfil.png" alt={config.storeName} className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="min-w-0">
            <h1 className="font-black text-sm sm:text-base md:text-lg tracking-tight text-slate-900 leading-tight">
              {config.storeName && config.storeName.includes('JP') ? config.storeName : 'Cuentas y plataformas de streaming JP'}
            </h1>
            <span className="text-[10px] sm:text-[11px] text-blue-700 font-black uppercase tracking-wider block mt-0.5">
              {config.storeSubtitle && config.storeSubtitle !== 'Multiplataformas' ? config.storeSubtitle : 'Entretenimiento & Licencias Premium'}
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-xs font-extrabold text-slate-600">
          <a href="#catalog" className="hover:text-blue-700 transition">Catálogo</a>
          <a href="#premieres" className="hover:text-blue-700 transition">Estrenos</a>
          <a href="#testimonios" className="hover:text-blue-700 transition flex items-center gap-1">
            <span>Clientes</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-full font-black">NUEVO</span>
          </a>
          <a href="#faq" className="hover:text-blue-700 transition">Garantía & FAQ</a>
        </nav>

        {/* Acciones */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleOpenAdmin}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300/60 px-3 py-2 rounded-xl transition font-extrabold flex items-center gap-1.5"
            title="Panel Administrador (Mundo Independiente)"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Admin</span>
          </button>
          <a
            href={`https://wa.me/${cleanPhone}?text=Hola%20Quiero%20mas%20informacion`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-500/20 px-3.5 py-2 rounded-xl transition font-extrabold items-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            Soporte
          </a>
          <button
            onClick={handleOpenCart}
            className="hidden sm:flex relative bg-blue-700 hover:bg-blue-800 text-white p-2.5 rounded-xl transition shadow-lg shadow-blue-600/20 items-center justify-center"
            title="Ver Carrito Express"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
              {totalItems}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
