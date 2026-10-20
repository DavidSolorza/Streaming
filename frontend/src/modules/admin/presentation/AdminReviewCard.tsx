import React from 'react';
import { EyeOff, CheckCircle2, Trash2 } from 'lucide-react';
import { Review } from '@/modules/testimonials/domain/entities/Review';

interface Props {
  review: Review;
  onToggle: (review: Review) => void;
  onDelete: (id: string) => void;
}

export const AdminReviewCard: React.FC<Props> = ({ review: r, onToggle, onDelete }) => (
  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-3">
    <div>
      <div className="flex items-center justify-between">
        <span className="font-extrabold text-xs text-slate-900">{r.name} <span className="text-[10px] text-slate-500 font-normal">({r.city})</span></span>
        <span className="text-[11px] font-bold text-amber-500 flex items-center">{'★'.repeat(r.rating)}</span>
      </div>
      <p className="text-[11px] font-semibold text-blue-600 mt-0.5">{r.product}</p>
      <p className="text-xs text-slate-600 mt-1 italic">"{r.comment}"</p>
    </div>
    <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 text-[11px]">
      <span className={`px-2 py-0.5 rounded-full font-bold ${r.isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
        {r.isApproved ? 'Visible en Tienda' : 'Oculta'}
      </span>
      <div className="flex gap-2">
        <button onClick={() => onToggle(r)} className="text-slate-600 hover:text-blue-600 font-bold flex items-center gap-1">
          {r.isApproved ? <EyeOff className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />} {r.isApproved ? 'Ocultar' : 'Aprobar'}
        </button>
        <button onClick={() => onDelete(r.id)} className="text-rose-600 hover:text-rose-800"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  </div>
);
