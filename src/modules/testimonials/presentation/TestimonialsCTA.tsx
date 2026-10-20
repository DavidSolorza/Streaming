import React from 'react';
import { Sparkles, MessageCircle, MessageSquarePlus } from 'lucide-react';

interface Props {
  onOpenNewCommentModal?: () => void;
}

export const TestimonialsCTA: React.FC<Props> = ({ onOpenNewCommentModal }) => (
  <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5">
    <div className="space-y-1 text-center sm:text-left">
      <h3 className="text-lg font-black flex items-center justify-center sm:justify-start gap-2">
        <Sparkles className="w-5 h-5 text-amber-400" />
        ¿Ya eres cliente de Cuentas JP?
      </h3>
      <p className="text-xs text-slate-300 font-medium">
        ¡Tu opinión es muy importante para nosotros! Déjanos tu calificación directamente aquí en la web o escríbenos a soporte.
      </p>
    </div>
    <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
      {onOpenNewCommentModal && (
        <button
          onClick={onOpenNewCommentModal}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
        >
          <MessageSquarePlus className="w-4 h-4 text-amber-300" />
          <span>Escribir mi Reseña</span>
        </button>
      )}
      <a
        href="https://wa.me/573214465418?text=Hola%20JP!%20Quiero%20comprar%20una%20cuenta%20y%20dejar%20mi%20testimonio"
        target="_blank"
        rel="noopener noreferrer"
        className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
      >
        <MessageCircle className="w-4 h-4" />
        <span>WhatsApp Soporte</span>
      </a>
    </div>
  </div>
);
