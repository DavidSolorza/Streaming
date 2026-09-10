import React, { useState, useEffect } from 'react';
import { CreditCard, Copy, Check, Zap, MessageCircle } from 'lucide-react';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { AdminRepository } from '@/modules/admin/infrastructure/adminRepository';
import { PaymentConfig } from '@/modules/admin/domain/entities/AdminConfig';
import { eventBus } from '@/core/bus/eventBus';

export const PaymentModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [config, setConfig] = useState<PaymentConfig>(() => AdminRepository.getPaymentConfig());
  const { items, total, customerContact } = useCartStore();

  useEffect(() => {
    const unsubOpen = eventBus.on('PAYMENT:OPEN_MODAL', () => setIsOpen(true));
    const unsubConfig = eventBus.on('ADMIN:CONFIG_CHANGED', (newConfig) => setConfig(newConfig));
    return () => {
      unsubOpen();
      unsubConfig();
    };
  }, []);

  const copyToClipboard = async (text: string, key: string) => {
    let success = false;
    const cleanText = text.replace(/\s+/g, '');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(cleanText);
        success = true;
      } catch (err) {
        console.warn('navigator.clipboard falló, ejecutando fallback document.execCommand:', err);
      }
    }

    if (!success) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = cleanText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (err) {
        console.error('Error al copiar con execCommand:', err);
      }
    }

    if (success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } else {
      alert(`Copia manualmente este número: ${cleanText}`);
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
    const cleanPhone = config.whatsappNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  const modalTitle = (
    <div className="flex items-center gap-2 text-slate-900">
      <CreditCard className="w-5 h-5 text-blue-700" />
      <span>Medios de Pago Directos (Transferencia)</span>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={modalTitle}>
      <div className="space-y-6">
        <div className="bg-slate-50 border border-slate-900/[0.08] p-4 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Resumen del Pedido</span>
            <span className="text-xs font-black text-slate-900">{items.length} ítem(s)</span>
          </div>
          <p className="text-2xl font-black text-blue-700 mt-1">${total.toLocaleString('es-CO')} COP</p>
        </div>

        {/* Opciones de Pago Dinámicas */}
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
              <p className="text-xs font-bold text-slate-700 mt-1 font-mono">{config.nequiNumber}</p>
              <p className="text-[11px] font-medium text-slate-500">Titular: {config.nequiHolder}</p>
            </div>
            <button
              onClick={() => copyToClipboard(config.nequiNumber, 'nequi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                copiedKey === 'nequi'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-900/[0.08]'
              }`}
            >
              {copiedKey === 'nequi' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copiar Nequi</span>
                </>
              )}
            </button>
          </div>

          {/* Bancolombia */}
          <div className="bg-white border border-slate-900/[0.08] p-4 rounded-xl shadow-sm flex items-center justify-between gap-3 hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <p className="text-sm font-extrabold text-slate-900">Bancolombia</p>
              </div>
              <p className="text-xs font-bold text-slate-700 mt-1 font-mono">{config.bancolombiaAccount}</p>
              <p className="text-[11px] font-medium text-slate-500">Titular: {config.bancolombiaHolder}</p>
            </div>
            <button
              onClick={() => copyToClipboard(config.bancolombiaAccount, 'bancolombia')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                copiedKey === 'bancolombia'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-900/[0.08]'
              }`}
            >
              {copiedKey === 'bancolombia' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copiar Cuenta</span>
                </>
              )}
            </button>
          </div>

          {/* Daviplata */}
          <div className="bg-white border border-slate-900/[0.08] p-4 rounded-xl shadow-sm flex items-center justify-between gap-3 hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                <p className="text-sm font-extrabold text-slate-900">Daviplata</p>
              </div>
              <p className="text-xs font-bold text-slate-700 mt-1 font-mono">{config.daviplataNumber}</p>
              <p className="text-[11px] font-medium text-slate-500">Titular: {config.daviplataHolder}</p>
            </div>
            <button
              onClick={() => copyToClipboard(config.daviplataNumber, 'daviplata')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                copiedKey === 'daviplata'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-900/[0.08]'
              }`}
            >
              {copiedKey === 'daviplata' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copiar Daviplata</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Instrucción paso a paso */}
        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl space-y-2">
          <p className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-blue-700" />
            Pasos para recibir tus credenciales:
          </p>
          <ol className="text-xs text-slate-600 space-y-1 list-decimal pl-4 font-medium">
            <li>Copia el número de tu plataforma de preferencia.</li>
            <li>Realiza la transferencia por los <b>${total.toLocaleString('es-CO')} COP</b>.</li>
            <li>Toma captura de pantalla al comprobante.</li>
            <li>Haz clic en el botón verde para enviar el comprobante por WhatsApp.</li>
          </ol>
        </div>

        <Button variant="mint" fullWidth onClick={handleSendProofWhatsApp}>
          <span className="flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-700" />
            Enviar Comprobante por WhatsApp
          </span>
        </Button>
      </div>
    </Modal>
  );
};
