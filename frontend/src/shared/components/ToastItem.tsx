import React from 'react';
import { PlatformIcon } from '@/shared/components/PlatformIcon';
import { ShoppingBag, CheckCircle2, AlertTriangle, XCircle, Info, X, ArrowRight } from 'lucide-react';
import { formatCOP } from '@/core/utils/currency';

export interface ToastData {
  id: string;
  title: string;
  message: string;
  iconName?: string;
  price?: number;
  type: 'cart' | 'success' | 'info' | 'warning' | 'error';
}

interface ToastItemProps {
  toast: ToastData;
  onClose: () => void;
  onOpenCart: () => void;
}

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose, onOpenCart }) => {
  const getStyles = () => {
    switch (toast.type) {
      case 'warning': return { barBg: 'bg-gradient-to-b from-amber-400 to-amber-600', badgeText: 'text-amber-400', iconBg: 'bg-amber-500/20 border-amber-500/30 text-amber-400', IconComponent: AlertTriangle, borderColor: 'border-amber-500/40 shadow-amber-950/20' };
      case 'error': return { barBg: 'bg-gradient-to-b from-rose-500 to-red-600', badgeText: 'text-rose-400', iconBg: 'bg-rose-500/20 border-rose-500/30 text-rose-400', IconComponent: XCircle, borderColor: 'border-rose-500/40 shadow-rose-950/20' };
      case 'success': return { barBg: 'bg-gradient-to-b from-emerald-400 to-emerald-600', badgeText: 'text-emerald-400', iconBg: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400', IconComponent: CheckCircle2, borderColor: 'border-emerald-500/40 shadow-emerald-950/20' };
      case 'cart': return { barBg: 'bg-gradient-to-b from-blue-400 to-indigo-600', badgeText: 'text-blue-400', iconBg: 'bg-blue-500/20 border-blue-500/30 text-blue-400', IconComponent: ShoppingBag, borderColor: 'border-blue-500/40 shadow-blue-950/20' };
      default: return { barBg: 'bg-gradient-to-b from-sky-400 to-blue-600', badgeText: 'text-sky-400', iconBg: 'bg-sky-500/20 border-sky-500/30 text-sky-400', IconComponent: Info, borderColor: 'border-sky-500/40 shadow-sky-950/20' };
    }
  };

  const style = getStyles();

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[calc(100%-2rem)] sm:w-auto min-w-[300px] sm:min-w-[400px] animate-bounce-short">
      <div className={`bg-slate-900/95 backdrop-blur-md text-white border ${style.borderColor} rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-3 relative overflow-hidden group`}>
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.barBg}`} />
        <div className="flex items-center gap-3 pl-2 min-w-0">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${style.iconBg}`}>
            {toast.iconName ? <PlatformIcon icon={toast.iconName} className="w-6 h-6" /> : <style.IconComponent className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <span className={`text-[11px] font-black uppercase tracking-wider ${style.badgeText} flex items-center gap-1`}>
              <style.IconComponent className="w-3.5 h-3.5" />
              {toast.title}
            </span>
            <p className="text-xs font-bold text-slate-100 leading-snug break-words">{toast.message}</p>
            {toast.price !== undefined && <span className="text-[11px] font-semibold text-slate-300 block mt-0.5">{formatCOP(toast.price)}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {toast.type === 'cart' && (
            <button onClick={onOpenCart} className="py-1.5 px-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[11px] rounded-lg flex items-center gap-1 shadow-sm transition-all">
              <span>Ver Carrito</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition" aria-label="Cerrar notificación">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
