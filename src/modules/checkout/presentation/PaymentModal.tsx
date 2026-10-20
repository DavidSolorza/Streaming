import React, { useState, useEffect } from 'react';
import { Building2, MessageCircle, Loader2 } from 'lucide-react';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { AdminRepository } from '@/modules/admin/infrastructure/adminRepository';
import { PaymentConfig } from '@/modules/admin/domain/entities/AdminConfig';
import { eventBus } from '@/core/bus/eventBus';
import { toast } from '@/core/utils/toast';
import { PaymentAccountRow } from './PaymentAccountRow';
import { PaymentInstructions } from './PaymentInstructions';
import { ApiHttpClient } from '@/core/http/apiHttpClient';

export const PaymentModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [config, setConfig] = useState<PaymentConfig>(() => AdminRepository.getPaymentConfig());
  const { items, total, customerName, customerContact } = useCartStore();

  useEffect(() => {
    const unsubOpen = eventBus.on('PAYMENT:OPEN_MODAL', () => setIsOpen(true));
    const unsubConfig = eventBus.on('ADMIN:CONFIG_CHANGED', (c) => setConfig(c));
    return () => { unsubOpen(); unsubConfig(); };
  }, []);

  const copyToClipboard = async (text: string, key: string) => {
    const clean = text.replace(/\s+/g, '');
    try {
      await navigator.clipboard.writeText(clean);
      setCopiedKey(key);
      toast.success(`Número ${clean} copiado.`, '¡Copiado!');
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      toast.info(`Número para transferencia: ${clean}`, 'Copia');
    }
  };

  const handleSendProof = async () => {
    if (!items.length) {
      return toast.warning('Agrega al menos un servicio al pedido.', 'Orden Vacía');
    }

    setIsSending(true);
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
        toast.error('No se pudo generar la orden para comprobante.', 'Error');
      }
    } catch {
      toast.error('Error al conectar con el servidor.', 'Error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={
      <div className="flex items-center gap-2 text-slate-900">
        <Building2 className="w-5 h-5 text-blue-600" />
        <div><h3 className="text-base font-bold">Cuentas Oficiales de Transferencia</h3><span className="text-[11px] text-slate-500 font-medium">Colombia • Nequi, Bancolombia y Daviplata</span></div>
      </div>
    }>
      <div className="space-y-4">
        <div className="bg-slate-50 border p-4 rounded-2xl flex justify-between items-center shadow-sm">
          <div><span className="text-[11px] font-bold text-slate-500 uppercase">Monto a Transferir</span><p className="text-2xl font-black text-blue-700">${total.toLocaleString('es-CO')} COP</p></div>
          <span className="text-xs font-black bg-blue-100 text-blue-800 px-3 py-1 rounded-xl">{items.length} servicio(s)</span>
        </div>
        <div className="space-y-2">
          <PaymentAccountRow label="Nequi" colorClass="bg-purple-600" accountNumber={config.nequiNumber} holder={config.nequiHolder} accountKey="nequi" copiedKey={copiedKey} onCopy={copyToClipboard} />
          <PaymentAccountRow label="Bancolombia" colorClass="bg-amber-500" accountNumber={config.bancolombiaAccount} holder={config.bancolombiaHolder} accountKey="bancolombia" copiedKey={copiedKey} onCopy={copyToClipboard} />
          <PaymentAccountRow label="Daviplata" colorClass="bg-red-600" accountNumber={config.daviplataNumber} holder={config.daviplataHolder} accountKey="daviplata" copiedKey={copiedKey} onCopy={copyToClipboard} />
        </div>
        <PaymentInstructions total={total} />
        <Button variant="mint" fullWidth onClick={handleSendProof} disabled={isSending}>
          <span className="flex items-center justify-center gap-2">
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4 text-emerald-700" />}
            <span>{isSending ? 'Generando Comprobante...' : 'Enviar Comprobante por WhatsApp'}</span>
          </span>
        </Button>
      </div>
    </Modal>
  );
};
