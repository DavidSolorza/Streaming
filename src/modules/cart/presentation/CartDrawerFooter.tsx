import React from 'react';
import { MessageCircle, CreditCard } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { useCartStore } from '../application/useCartStore';
import { eventBus } from '@/core/bus/eventBus';
import { toast } from '@/core/utils/toast';

export const CartDrawerFooter: React.FC = () => {
  const { items, total, customerContact, setCustomerContact } = useCartStore();

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) {
      toast.warning('Agrega al menos un servicio al carrito para continuar.', 'Carrito Vacío');
      return;
    }
    let message = "¡Hola! Quiero adquirir los siguientes servicios en Cuentas y plataformas de streaming JP:\n\n";
    items.forEach(item => {
      message += `• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString('es-CO')} COP\n`;
    });
    message += `\n*Total a pagar:* $${total.toLocaleString('es-CO')} COP\n`;
    if (customerContact.trim()) {
      message += `*Datos de Contacto:* ${customerContact.trim()}\n`;
    }
    message += `\nQuedo atento a los datos para realizar la transferencia. ¡Muchas gracias!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/573214465418?text=${encoded}`, '_blank');
  };

  const handleOpenPaymentModal = () => {
    if (items.length === 0) {
      toast.warning('Agrega al menos un servicio al carrito para ver medios de pago.', 'Carrito Vacío');
      return;
    }
    eventBus.emit('PAYMENT:OPEN_MODAL', undefined);
  };

  return (
    <div className="p-6 border-t border-slate-900/[0.08] bg-slate-50 space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-slate-600 text-sm font-semibold">Total a Pagar:</span>
        <span className="text-xl font-black text-slate-900">${total.toLocaleString('es-CO')} COP</span>
      </div>
      <div>
        <label className="block text-[11px] font-extrabold text-slate-500 uppercase mb-1.5">
          Tu WhatsApp o Correo (Para entrega de datos):
        </label>
        <input
          type="text"
          value={customerContact}
          onChange={(e) => setCustomerContact(e.target.value)}
          placeholder="Ej: +57 300 123 4567 o usuario@gmail.com"
          className="w-full bg-white border border-slate-900/[0.08] text-xs font-semibold text-slate-900 rounded-xl px-3.5 py-3 focus:outline-none focus:border-blue-700"
        />
      </div>
      <div className="space-y-2 pt-1">
        <Button variant="mint" fullWidth onClick={handleCheckoutWhatsApp}>
          <span className="flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-700" />
            Pagar por WhatsApp (Instantáneo)
          </span>
        </Button>
        <Button variant="primary" fullWidth onClick={handleOpenPaymentModal}>
          <span className="flex items-center justify-center gap-2">
            <CreditCard className="w-4 h-4" />
            Pagar con Nequi / Daviplata / PSE
          </span>
        </Button>
      </div>
    </div>
  );
};
