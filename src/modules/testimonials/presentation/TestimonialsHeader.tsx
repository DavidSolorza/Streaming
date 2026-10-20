import React from 'react';
import { Star, UserCheck, MessageSquarePlus } from 'lucide-react';

interface TestimonialsHeaderProps {
  onOpenNewCommentModal?: () => void;
  totalCommentsCount?: number;
}

export const TestimonialsHeader: React.FC<TestimonialsHeaderProps> = ({
  onOpenNewCommentModal,
  totalCommentsCount = 6
}) => (
  <>
    <div className="text-center space-y-3">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider">
        <UserCheck className="w-4 h-4 text-blue-600" />
        <span>Opiniones & Experiencias de Clientes</span>
      </div>
      <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
        Lo que dicen nuestros Clientes en Colombia
      </h2>
      <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-2xl mx-auto leading-relaxed">
        Más de <b>1,500 clientes</b> confían en <b>Cuentas y plataformas de streaming JP</b> para disfrutar de su contenido favorito con garantía total de servicio.
      </p>

      {/* Botón Destacado de Agregar Comentario */}
      {onOpenNewCommentModal && (
        <div className="pt-2 flex justify-center">
          <button
            onClick={onOpenNewCommentModal}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2.5 shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <MessageSquarePlus className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            <span>¡Déjanos tu Comentario o Reseña!</span>
          </button>
        </div>
      )}
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm text-center">
      <div className="p-3">
        <span className="text-2xl font-black text-slate-900 block flex items-center justify-center gap-1">
          <span>4.9</span>
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
        </span>
        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">
          Promedio ({totalCommentsCount} opiniones)
        </span>
      </div>
      <div className="p-3 border-l border-slate-100">
        <span className="text-2xl font-black text-emerald-600 block">+1,500</span>
        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Clientes Activos</span>
      </div>
      <div className="p-3 border-l border-slate-100">
        <span className="text-2xl font-black text-blue-700 block">&lt; 5 Min</span>
        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Tiempo de Entrega</span>
      </div>
      <div className="p-3 border-l border-slate-100">
        <span className="text-2xl font-black text-purple-700 block">100%</span>
        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Garantía de Reposición</span>
      </div>
    </div>
  </>
);
