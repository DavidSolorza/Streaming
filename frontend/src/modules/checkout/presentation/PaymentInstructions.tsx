import React from 'react';
import { Zap } from 'lucide-react';

interface PaymentInstructionsProps {
  total: number;
}

export const PaymentInstructions: React.FC<PaymentInstructionsProps> = ({ total }) => (
  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl space-y-2">
    <p className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
      <Zap className="w-4 h-4 text-blue-700" /> Pasos para recibir tus credenciales:
    </p>
    <ol className="text-xs text-slate-600 space-y-1 list-decimal pl-4 font-medium">
      <li>Copia el número de tu plataforma de preferencia.</li>
      <li>Realiza la transferencia por los <b>${total.toLocaleString('es-CO')} COP</b>.</li>
      <li>Toma captura de pantalla al comprobante.</li>
      <li>Haz clic en el botón verde para enviar el comprobante por WhatsApp.</li>
    </ol>
  </div>
);
