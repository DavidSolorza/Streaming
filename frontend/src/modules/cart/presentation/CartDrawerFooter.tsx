import React, { useState } from 'react';
import { MessageCircle, Building2, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { useCartStore } from '../application/useCartStore';
import { eventBus } from '@/core/bus/eventBus';
import { toast } from '@/core/utils/toast';
import { ApiHttpClient } from '@/core/http/apiHttpClient';

export const CartDrawerFooter: React.FC = () => {
  const {
    items, total, customerName, setCustomerName,
    customerContact, setCustomerContact,
    rememberCustomer, setRememberCustomer
  } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckoutWhatsApp = async () => {
    if (items.length === 0) {
      toast.warning('Agrega al menos un servicio al carrito para continuar.', 'Carrito Vacío');
      return;
    }

    setIsProcessing(true);
    try {
      const payload = {
        customerName: customerName?.trim() || 'Cliente VIP',
        customerContact: customerContact?.trim() || undefined,
        items: items.map(i => ({ name: i.name, price: i.price, quantity: i.quantity }))
      };

      const res = await ApiHttpClient.post<{ whatsAppUrl: string }>('/orders/checkout', payload);
      if (res.success && res.data?.whatsAppUrl) {
        window.open(res.data.whatsAppUrl, '_blank');
      } else {
        toast.error('No se pudo generar la orden en el servidor.', 'Error');
      }
    } catch {
      toast.error('Error al conectar con el backend de compras.', 'Error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenPaymentModal = () => {
    if (items.length === 0) {
      toast.warning('Agrega al menos un servicio al carrito para ver medios de pago.', 'Carrito Vacío');
      return;
    }
    eventBus.emit('PAYMENT:OPEN_MODAL', undefined);
  };

  return (
    <div className="p-5 border-t border-slate-900/[0.08] bg-slate-50 space-y-3.5">
      <div className="flex justify-between items-center">
        <span className="text-slate-600 text-sm font-semibold">Total a Pagar:</span>
        <span className="text-xl font-black text-slate-900">${total.toLocaleString('es-CO')} COP</span>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Tu Nombre (Opcional, ej: Carlos Gómez)"
          className="w-full bg-white border border-slate-900/[0.08] text-xs font-bold text-slate-900 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-700"
        />
        <input
          type="text"
          value={customerContact}
          onChange={(e) => setCustomerContact(e.target.value)}
          placeholder="Tu WhatsApp o Correo (Opcional)"
          className="w-full bg-white border border-slate-900/[0.08] text-xs font-semibold text-slate-900 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-700"
        />
        <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] font-bold text-slate-600 pt-0.5">
          <input
            type="checkbox"
            checked={rememberCustomer}
            onChange={(e) => setRememberCustomer(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
          />
          <span>Recordar mis datos para compras instantáneas en 1 clic</span>
        </label>
      </div>

      <div className="space-y-2 pt-1">
        <Button variant="mint" fullWidth onClick={handleCheckoutWhatsApp} disabled={isProcessing}>
          <span className="flex items-center justify-center gap-2">
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4 text-emerald-700" />}
            <span>{isProcessing ? 'Preparando WhatsApp...' : 'Pagar por WhatsApp (1 Clic Instantáneo)'}</span>
          </span>
        </Button>
        <Button variant="primary" fullWidth onClick={handleOpenPaymentModal}>
          <span className="flex items-center justify-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>Ver Cuentas de Transferencia Bancaria</span>
          </span>
        </Button>
      </div>
    </div>
  );
};
