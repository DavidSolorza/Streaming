import React, { useState, useEffect } from 'react';
import { CreditCard, MessageCircle } from 'lucide-react';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { AdminRepository } from '@/modules/admin/infrastructure/adminRepository';
import { PaymentConfig } from '@/modules/admin/domain/entities/AdminConfig';
import { eventBus } from '@/core/bus/eventBus';
import { toast } from '@/core/utils/toast';
import { PaymentAccountRow } from './PaymentAccountRow';
import { PaymentInstructions } from './PaymentInstructions';

export const PaymentModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [config, setConfig] = useState<PaymentConfig>(() => AdminRepository.getPaymentConfig());
  const { items, total, customerContact } = useCartStore();

  useEffect(() => {
    const unsubOpen = eventBus.on('PAYMENT:OPEN_MODAL', () => setIsOpen(true));
    const unsubConfig = eventBus.on('ADMIN:CONFIG_CHANGED', (newConfig) => setConfig(newConfig));
    return () => { unsubOpen(); unsubConfig(); };
  }, []);

  const copyToClipboard = async (text: string, key: string) => {
    const cleanText = text.replace(/\s+/g, '');
    try {
      await navigator.clipboard.writeText(cleanText);
      setCopiedKey(key);
      toast.success(`Número ${cleanText} copiado.`, '¡Copiado!');
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      toast.info(`Número para transferencia: ${cleanText}`, 'Copia Manual');
    }
  };

  const handleSendProofWhatsApp = () => {
    let message = "¡Hola! Ya realicé mi pago para las siguientes cuentas:\n\n";
    items.forEach((item) => { message += `• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString('es-CO')} COP\n`; });
    message += `\n*Total Pagado:* $${total.toLocaleString('es-CO')} COP\n`;
    if (customerContact.trim()) message += `*Contacto Registrado:* ${customerContact.trim()}\n`;
    message += `\nAdjunto comprobante de pago para la entrega inmediata.`;
    const cleanPhone = config.whatsappNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={<div className="flex items-center gap-2 text-slate-900"><CreditCard className="w-5 h-5 text-blue-700" /><span>Medios de Pago Directos</span></div>}>
      <div className="space-y-6">
        <div className="bg-slate-50 border border-slate-900/[0.08] p-4 rounded-xl flex justify-between items-center">
          <div><span className="text-xs font-bold text-slate-500 uppercase">Resumen del Pedido</span><p className="text-2xl font-black text-blue-700 mt-1">${total.toLocaleString('es-CO')} COP</p></div>
          <span className="text-xs font-black text-slate-900">{items.length} ítem(s)</span>
        </div>
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Cuentas Oficiales para Transferir:</h4>
          <PaymentAccountRow label="Nequi" colorClass="bg-purple-600" accountNumber={config.nequiNumber} holder={config.nequiHolder} accountKey="nequi" copiedKey={copiedKey} onCopy={copyToClipboard} />
          <PaymentAccountRow label="Bancolombia" colorClass="bg-amber-500" accountNumber={config.bancolombiaAccount} holder={config.bancolombiaHolder} accountKey="bancolombia" copiedKey={copiedKey} onCopy={copyToClipboard} />
          <PaymentAccountRow label="Daviplata" colorClass="bg-red-600" accountNumber={config.daviplataNumber} holder={config.daviplataHolder} accountKey="daviplata" copiedKey={copiedKey} onCopy={copyToClipboard} />
        </div>
        <PaymentInstructions total={total} />
        <Button variant="mint" fullWidth onClick={handleSendProofWhatsApp}>
          <span className="flex items-center justify-center gap-2"><MessageCircle className="w-5 h-5 text-emerald-700" />Enviar Comprobante por WhatsApp</span>
        </Button>
      </div>
    </Modal>
  );
};
