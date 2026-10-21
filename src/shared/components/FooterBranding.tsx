import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const FooterBranding: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 ring-2 ring-blue-500/20 shadow-md flex items-center justify-center bg-white shrink-0 p-0.5">
        <img src="/perfil.png" alt="Cuentas y plataformas de streaming JP" width="48" height="48" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-full" />
      </div>
      <div>
        <span className="font-black text-sm text-white tracking-wide block leading-tight">
          Cuentas y plataformas <span className="text-blue-400">de streaming JP</span>
        </span>
        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          En línea & Servicio 24/7
        </span>
      </div>
    </div>
    <p className="text-xs leading-relaxed text-slate-400">
      Plataforma colombiana especializada en licencias digitales, perfiles individuales con PIN y cuentas completas con activación rápida en minutos.
    </p>
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
      <span>Garantía de reposición activa</span>
    </div>
  </div>
);
