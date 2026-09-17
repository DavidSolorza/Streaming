import React from 'react';
import { Copy, Check } from 'lucide-react';

interface PaymentAccountRowProps {
  label: string;
  colorClass: string;
  accountNumber: string;
  holder: string;
  accountKey: string;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}

export const PaymentAccountRow: React.FC<PaymentAccountRowProps> = ({
  label, colorClass, accountNumber, holder, accountKey, copiedKey, onCopy
}) => (
  <div className="bg-white border border-slate-900/[0.08] p-4 rounded-xl shadow-sm flex items-center justify-between gap-3 hover:border-slate-300 transition-all">
    <div>
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`}></span>
        <p className="text-sm font-extrabold text-slate-900">{label}</p>
      </div>
      <p className="text-xs font-bold text-slate-700 mt-1 font-mono">{accountNumber}</p>
      <p className="text-[11px] font-medium text-slate-500">Titular: {holder}</p>
    </div>
    <button
      onClick={() => onCopy(accountNumber, accountKey)}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
        copiedKey === accountKey
          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-900/[0.08]'
      }`}
    >
      {copiedKey === accountKey ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-700" />
          <span>Copiado</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-slate-500" />
          <span>Copiar</span>
        </>
      )}
    </button>
  </div>
);
