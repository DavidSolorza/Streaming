import React, { useEffect } from 'react';
import { useCartStore } from '../application/useCartStore';
import { CartItemRow } from './CartItemRow';
import { Button } from '@/shared/components/Button';
import { eventBus } from '@/core/bus/eventBus';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, setIsOpen, total, customerContact, setCustomerContact } = useCartStore();

  useEffect(() => {
    const unsubOpen = eventBus.on('CART:OPEN_DRAWER', () => setIsOpen(true));
    const unsubClose = eventBus.on('CART:CLOSE_DRAWER', () => setIsOpen(false));
    return () => {
      unsubOpen();
      unsubClose();
    };
  }, [setIsOpen]);

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) {
      alert('Agrega al menos un servicio al carrito para continuar.');
      return;
    }

    let message = "Hola 👋 ¡Quiero adquirir los siguientes servicios en Cuentas Stream:\n\n";
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
      alert('Agrega al menos un servicio al carrito para ver medios de pago.');
      return;
    }
    eventBus.emit('PAYMENT:OPEN_MODAL', undefined);
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Backdrop con Blur y Transición de Opacidad */}
      <div
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Lateral Deslizante con Transición translate-x-full a translate-x-0 */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen max-w-md bg-white border-l border-slate-900/[0.08] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-900/[0.08]">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              🛒 Tu Carrito Express
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-900 text-xl font-bold"
            >
              &times;
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <p className="text-slate-500 text-center py-12 text-xs font-semibold">
                Tu carrito está vacío. Agrega servicios desde el catálogo.
              </p>
            ) : (
              items.map(item => (
                <CartItemRow key={item.cartItemId} item={item} />
              ))
            )}
          </div>

          {/* Footer Drawer */}
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
                💬 Pagar por WhatsApp (Instantáneo)
              </Button>
              <Button variant="primary" fullWidth onClick={handleOpenPaymentModal}>
                💳 Pagar con Nequi / Daviplata / PSE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
