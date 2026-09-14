import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { 
  ShoppingBag, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  X, 
  ArrowRight,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { eventBus } from '@/core/bus/eventBus';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { formatCOP } from '@/core/utils/currency';

interface ToastData {
  id: string;
  title: string;
  message: string;
  iconName?: string;
  price?: number;
  type: 'cart' | 'success' | 'info' | 'warning' | 'error';
}

interface ConfirmData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
}

export const ToastNotification: React.FC = () => {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmData | null>(null);
  const setIsOpen = useCartStore(state => state.setIsOpen);

  useEffect(() => {
    // Escucha adición de artículos al carrito
    const unsubCart = eventBus.on('CART:ITEM_ADDED', (item) => {
      setToast({
        id: String(Date.now()),
        title: '¡Añadido al Carrito!',
        message: item.name,
        iconName: item.image,
        price: item.price,
        type: 'cart'
      });
    });

    // Escucha notificaciones genéricas
    const unsubNotif = eventBus.on('NOTIFICATION:SHOW', (data) => {
      let defaultTitle = 'Notificación';
      const toastType = data.type || 'info';

      if (data.title) {
        defaultTitle = data.title;
      } else {
        if (toastType === 'success') defaultTitle = '¡Éxito!';
        if (toastType === 'warning') defaultTitle = 'Atención';
        if (toastType === 'error') defaultTitle = '¡Error!';
        if (toastType === 'info') defaultTitle = 'Información';
      }

      setToast({
        id: String(Date.now()),
        title: defaultTitle,
        message: data.message,
        iconName: data.iconName,
        price: data.price,
        type: toastType
      });
    });

    // Escucha diálogos de confirmación
    const unsubConfirm = eventBus.on('CONFIRMATION:SHOW', (data) => {
      setConfirmDialog({
        title: data.title,
        message: data.message,
        confirmText: data.confirmText || 'Confirmar',
        cancelText: data.cancelText || 'Cancelar',
        variant: data.variant || 'warning',
        onConfirm: data.onConfirm
      });
    });

    return () => {
      unsubCart();
      unsubNotif();
      unsubConfirm();
    };
  }, []);

  // Auto-ocultar notificación tras 4.5 segundos
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleOpenCart = () => {
    setIsOpen(true);
    setToast(null);
  };

  // Configuración de colores e iconos según el tipo de toast
  const getToastStyles = () => {
    if (!toast) return null;
    switch (toast.type) {
      case 'warning':
        return {
          barBg: 'bg-gradient-to-b from-amber-400 to-amber-600',
          badgeText: 'text-amber-400',
          iconBg: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
          IconComponent: AlertTriangle,
          borderColor: 'border-amber-500/40 shadow-amber-950/20'
        };
      case 'error':
        return {
          barBg: 'bg-gradient-to-b from-rose-500 to-red-600',
          badgeText: 'text-rose-400',
          iconBg: 'bg-rose-500/20 border-rose-500/30 text-rose-400',
          IconComponent: XCircle,
          borderColor: 'border-rose-500/40 shadow-rose-950/20'
        };
      case 'success':
        return {
          barBg: 'bg-gradient-to-b from-emerald-400 to-emerald-600',
          badgeText: 'text-emerald-400',
          iconBg: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400',
          IconComponent: CheckCircle2,
          borderColor: 'border-emerald-500/40 shadow-emerald-950/20'
        };
      case 'cart':
        return {
          barBg: 'bg-gradient-to-b from-blue-400 to-indigo-600',
          badgeText: 'text-blue-400',
          iconBg: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
          IconComponent: ShoppingBag,
          borderColor: 'border-blue-500/40 shadow-blue-950/20'
        };
      case 'info':
      default:
        return {
          barBg: 'bg-gradient-to-b from-sky-400 to-blue-600',
          badgeText: 'text-sky-400',
          iconBg: 'bg-sky-500/20 border-sky-500/30 text-sky-400',
          IconComponent: Info,
          borderColor: 'border-sky-500/40 shadow-sky-950/20'
        };
    }
  };

  const toastStyle = getToastStyles();

  return (
    <>
      {/* 1. NOTIFICACIÓN TOAST FLOTANTE */}
      {toast && toastStyle && (
        <div className="fixed top-5 right-4 sm:right-6 z-50 max-w-sm w-full animate-bounce-short">
          <div className={`bg-slate-900/95 backdrop-blur-md text-white border ${toastStyle.borderColor} rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-3 relative overflow-hidden group`}>
            
            {/* Barra lateral de acento de color */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${toastStyle.barBg}`} />

            <div className="flex items-center gap-3 pl-2 min-w-0">
              {/* Icono del servicio o del estado */}
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${toastStyle.iconBg}`}>
                {toast.iconName ? (
                  <Icon icon={toast.iconName} className="w-6 h-6" />
                ) : (
                  <toastStyle.IconComponent className="w-5 h-5" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-black uppercase tracking-wider ${toastStyle.badgeText} flex items-center gap-1`}>
                    <toastStyle.IconComponent className="w-3.5 h-3.5" />
                    {toast.title}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-100 leading-snug break-words">
                  {toast.message}
                </p>
                {toast.price !== undefined && (
                  <span className="text-[11px] font-semibold text-slate-300 block mt-0.5">
                    {formatCOP(toast.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Acciones directas */}
            <div className="flex items-center gap-2 shrink-0">
              {toast.type === 'cart' && (
                <button
                  onClick={handleOpenCart}
                  className="py-1.5 px-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[11px] rounded-lg flex items-center gap-1 shadow-sm transition-all"
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
      )}

      {/* 2. MODAL DE CONFIRMACIÓN ELEGANTE */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-900 relative space-y-4 animate-scaleUp">
            
            {/* Header del Confirm Dialog */}
            <div className="flex items-start space-x-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                confirmDialog.variant === 'danger'
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : confirmDialog.variant === 'warning'
                  ? 'bg-amber-50 text-amber-600 border-amber-200'
                  : 'bg-blue-50 text-blue-600 border-blue-200'
              }`}>
                {confirmDialog.variant === 'danger' ? (
                  <AlertCircle className="w-6 h-6" />
                ) : confirmDialog.variant === 'warning' ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <HelpCircle className="w-6 h-6" />
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                  {confirmDialog.title}
                </h3>
                <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">
                  {confirmDialog.message}
                </p>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                {confirmDialog.cancelText}
              </button>

              <button
                type="button"
                onClick={() => {
                  const cb = confirmDialog.onConfirm;
                  setConfirmDialog(null);
                  cb();
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold text-white transition shadow-md ${
                  confirmDialog.variant === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                    : confirmDialog.variant === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                }`}
              >
                {confirmDialog.confirmText}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
