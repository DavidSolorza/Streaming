import React from 'react';
import { Clock, Zap, MessageCircle, ShieldCheck } from 'lucide-react';

export const FooterSupport: React.FC = () => (
  <>
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Atención al Cliente</h4>
      <a
        href="https://wa.me/573214465418?text=Hola%20Quiero%20mas%20informacion"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-white font-medium text-xs group"
      >
        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
          <MessageCircle className="w-4 h-4" />
        </div>
        <div>
          <span className="block text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            En línea ahora
          </span>
          <span>+57 321 446 5418</span>
        </div>
      </a>
      <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
        <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>Lun a Dom: 8:00 AM – 10:00 PM</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>Entrega estimada: 5 a 15 minutos</span>
      </div>
    </div>
    <div>
      <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Respaldo & Compromiso</h4>
      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
        <div className="flex items-center gap-2 text-white font-medium text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Cuentas 100% Verificadas</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Todas las suscripciones cuentan con soporte técnico y garantía de reemplazo inmediato durante la vigencia del plan contratado.
        </p>
      </div>
    </div>
  </>
);
