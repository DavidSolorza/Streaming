import React from 'react';
import { Filter, Star, Sparkles, ArrowUpDown, MessageSquarePlus } from 'lucide-react';

interface Props {
  activeFilter: 'all' | 'user' | '5stars';
  setActiveFilter: (f: 'all' | 'user' | '5stars') => void;
  sortBy: 'recent' | 'rating';
  setSortBy: (s: 'recent' | 'rating') => void;
  totalCount: number;
  userCommentsCount: number;
  onOpenModal: () => void;
}

export const TestimonialsFilterBar: React.FC<Props> = ({
  activeFilter, setActiveFilter, sortBy, setSortBy, totalCount, userCommentsCount, onOpenModal
}) => (
  <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
    <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
      <span className="text-xs font-black text-slate-400 uppercase tracking-wider hidden sm:inline flex items-center gap-1">
        <Filter className="w-3.5 h-3.5 text-blue-600" /> Filtrar:
      </span>
      <button
        onClick={() => setActiveFilter('all')}
        className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all shrink-0 ${
          activeFilter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        Todas ({totalCount})
      </button>
      <button
        onClick={() => setActiveFilter('5stars')}
        className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all shrink-0 flex items-center gap-1 ${
          activeFilter === '5stars' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        <Star className="w-3.5 h-3.5 fill-current" /> 5 Estrellas
      </button>
      {userCommentsCount > 0 && (
        <button
          onClick={() => setActiveFilter('user')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all shrink-0 flex items-center gap-1 ${
            activeFilter === 'user' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Mis Opiniones ({userCommentsCount})
        </button>
      )}
    </div>

    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
        <label htmlFor="testimonials-sort" className="text-xs font-extrabold text-slate-600">Ordenar:</label>
        <select
          id="testimonials-sort"
          aria-label="Ordenar testimonios"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800"
        >
          <option value="recent">Más Recientes</option>
          <option value="rating">Mejor Calificados</option>
        </select>
      </div>
      <button
        onClick={onOpenModal}
        aria-label="Dejar una opinión o comentario"
        className="sm:hidden px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-extrabold flex items-center gap-1"
      >
        <MessageSquarePlus className="w-3.5 h-3.5" /> Opinar
      </button>
    </div>
  </div>
);
