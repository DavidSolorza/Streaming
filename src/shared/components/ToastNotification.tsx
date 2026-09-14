import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { ShoppingBag, CheckCircle2, X, ArrowRight } from 'lucide-react';
import { eventBus } from '@/core/bus/eventBus';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { formatCOP } from '@/core/utils/currency';

interface ToastData {
  id: string;
  title: string;
  subtitle: string;
  iconName?: string;
  price?: number;
  type: 'cart' | 'success' | 'info';
}

export const ToastNotification: React.FC = () => {
  const [toast, setToast] = useState<ToastData | null>(null);
  const setIsOpen = useCartStore(state => state.setIsOpen);

  useEffect(() => {
    // Escucha la adición de artículos al carrito
    const unsubCart = eventBus.on('CART:ITEM_ADDED', (item) => {
      setToast({
        id: String(Date.now()),
        title: '¡Añadido al Carrito!',
        subtitle: item.name,
        iconName: item.image,
        price: item.price,
        type: 'cart'
      });
    });

    // Escucha notificaciones genéricas
    const unsubNotif = eventBus.on('NOTIFICATION:SHOW', (data) => {
      setToast({
        id: String(Date.now()),
        title: data.type === 'success' ? '¡Éxito!' : 'Notificación',
        subtitle: data.message,
        type: data.type === 'success' ? 'success' : 'info'
      });
    });

    return () => {
      unsubCart();
      unsubNotif();
    };
  }, []);

  // Auto-ocultar notificación tras 4 segundos
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const handleOpenCart = () => {
    setIsOpen(true);
    setToast(null);
  };

  return (
    <div className="fixed top-5 right-4 sm:right-6 z-50 max-w-sm w-full animate-bounce-short">
      <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/60 rounded-2xl p-4 shadow-luxury flex items-center justify-between gap-3 relative overflow-hidden group">
        {/* Barra lateral de acento verde radiante */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 to-emerald-600"></div>

        <div className="flex items-center gap-3 pl-2 min-w-0">
          {/* Icono del servicio o de éxito */}
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            {toast.iconName ? (
              <Icon icon={toast.iconName} className="w-6 h-6" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {toast.title}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-100 truncate leading-snug">
              {toast.subtitle}
            </p>
            {toast.price !== undefined && (
              <span className="text-[11px] font-semibold text-slate-300">
                {formatCOP(toast.price)}
              </span>
            )}
          </div>
        </div>

        {/* Acciones directas: Abrir Carrito / Cerrar */}
        <div className="flex items-center gap-2 shrink-0">
          {toast.type === 'cart' && (
            <button
              onClick={handleOpenCart}
              className="py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] rounded-lg flex items-center gap-1 shadow-sm transition-all"
            >
              <span>Ver Carrito</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={() => setToast(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
