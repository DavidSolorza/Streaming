import React, { useState, useEffect } from 'react';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { eventBus } from '@/core/bus/eventBus';

export const PaymentModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { items, total, customerContact } = useCartStore();

  useEffect(() => {
    const unsub = eventBus.on('PAYMENT:OPEN_MODAL', () => setIsOpen(true));
    return () => unsub();
  }, []);

  const copyToClipboard = async (text: string, key: string) => {
    let success = false;
    // Intentar primero con la API moderna navigator.clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch (err) {
        console.warn('navigator.clipboard falló, ejecutando fallback document.execCommand:', err);
      }
    }

    // Fallback robusto con document.execCommand('copy') para navegadores internos (Instagram, TikTok, Facebook)
    if (!success) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (err) {
        console.error('Error catastrófico al copiar con execCommand:', err);
      }
    }

    if (success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } else {
      alert(`No se pudo copiar automáticamente. Por favor copia manualmente este número: ${text}`);
    }
  };

  const handleSendProofWhatsApp = () => {
    let message = "Hola 👋 Ya realicé mi pago para las siguientes cuentas:\n\n";
    items.forEach(item => {
      message += `• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString('es-CO')} COP\n`;
    });
    message += `\n*Total Pagado:* $${total.toLocaleString('es-CO')} COP\n`;
    if (customerContact.trim()) {
      message += `*Contacto Registrado:* ${customerContact.trim()}\n`;
    }
    message += `\nAdjunto comprobante de pago para la entrega inmediata.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/573214465418?text=${encoded}`, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="💳 Medios de Pago Directos (Transferencia)">
      <div className="space-y-6">
        <div className="bg-slate-50 border border-slate-900/[0.08] p-4 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Resumen del Pedido</span>
            <span className="text-xs font-black text-slate-900">{items.length} ítem(s)</span>
          </div>
          <p className="text-2xl font-black text-blue-700 mt-1">${total.toLocaleString('es-CO')} COP</p>
        </div>

        {/* Opciones de Pago */}
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Cuentas Oficiales para Transferir:
          </h4>

          {/* Nequi */}
          <div className="bg-white border border-slate-900/[0.08] p-4 rounded-xl shadow-sm flex items-center justify-between gap-3 hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                <p className="text-sm font-extrabold text-slate-900">Nequi</p>
              </div>
              <p className="text-xs font-bold text-slate-700 mt-1 font-mono">321 446 5418</p>
              <p className="text-[11px] font-medium text-slate-500">Titular: Cuentas Stream Oficial</p>
            </div>
            <button
              onClick={() => copyToClipboard('3214465418', 'nequi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                copiedKey === 'nequi'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-900/[0.08]'
              }`}
            >
              {copiedKey === 'nequi' ? '✓ Copiado' : 'Copiar Nequi'}
            </button>
          </div>

          {/* Bancolombia / A la mano */}
          <div className="bg-white border border-slate-900/[0.08] p-4 rounded-xl shadow-sm flex items-center justify-between gap-3 hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <p className="text-sm font-extrabold text-slate-900">Bancolombia (A la mano)</p>
              </div>
              <p className="text-xs font-bold text-slate-700 mt-1 font-mono">03214465418</p>
              <p className="text-[11px] font-medium text-slate-500">Ahorros / A la Mano</p>
            </div>
            <button
              onClick={() => copyToClipboard('03214465418', 'bancolombia')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                copiedKey === 'bancolombia'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-900/[0.08]'
              }`}
            >
              {copiedKey === 'bancolombia' ? '✓ Copiado' : 'Copiar Número'}
            </button>
          </div>

          {/* Daviplata */}
          <div className="bg-white border border-slate-900/[0.08] p-4 rounded-xl shadow-sm flex items-center justify-between gap-3 hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                <p className="text-sm font-extrabold text-slate-900">Daviplata</p>
              </div>
              <p className="text-xs font-bold text-slate-700 mt-1 font-mono">321 446 5418</p>
              <p className="text-[11px] font-medium text-slate-500">Titular: Cuentas Stream Oficial</p>
            </div>
            <button
              onClick={() => copyToClipboard('3214465418', 'daviplata')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                copiedKey === 'daviplata'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-900/[0.08]'
              }`}
            >
              {copiedKey === 'daviplata' ? '✓ Copiado' : 'Copiar Daviplata'}
            </button>
          </div>
        </div>

        {/* Instrucción paso a paso */}
        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl space-y-2">
          <p className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
            ⚡ Pasos para recibir tus credenciales:
          </p>
          <ol className="text-xs text-slate-600 space-y-1 list-decimal pl-4 font-medium">
            <li>Copia el número de tu plataforma de preferencia.</li>
            <li>Realiza la transferencia por los <b>${total.toLocaleString('es-CO')} COP</b>.</li>
            <li>Toma captura de pantalla al comprobante.</li>
            <li>Haz clic en el botón verde para enviar el comprobante por WhatsApp y recibir acceso.</li>
          </ol>
        </div>

        <Button variant="mint" fullWidth onClick={handleSendProofWhatsApp}>
          📲 Enviar Comprobante por WhatsApp
        </Button>
      </div>
    </Modal>
  );
};
