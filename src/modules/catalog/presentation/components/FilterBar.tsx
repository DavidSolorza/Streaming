import React from 'react';
import { Search, X, Film, Music, Trophy, Flame, Sparkles, Briefcase } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onClearSearch = () => onSearchChange(''),
}) => {
  const categories = [
    { id: 'all', label: 'Todas', icon: Sparkles },
    { id: 'cine', label: 'Películas & Series', icon: Film },
    { id: 'musica', label: 'Música', icon: Music },
    { id: 'trabajo', label: 'Trabajo & Edición', icon: Briefcase },
    { id: 'deportes', label: 'Deportes', icon: Trophy },
    { id: 'combo', label: 'Combos', icon: Flame },
  ];

  return (
    <div className="sticky top-16 sm:top-20 z-30 bg-white/95 border border-slate-900/[0.08] p-3 sm:p-4 rounded-2xl sm:rounded-3xl mb-6 sm:mb-10 shadow-luxury backdrop-blur-xl">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Buscador Predictivo en Tiempo Real */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar servicio (ej. Netflix, Max)..."
            className="w-full bg-slate-50 border border-slate-900/[0.08] rounded-xl sm:rounded-2xl pl-10 pr-9 py-2.5 sm:py-3 text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition"
          />
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-900 text-xs font-bold gap-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Chips Horizontales Rápidos en 1 Sola Línea Deslizable en Móviles */}
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap pb-0.5 sm:pb-0 scrollbar-none scroll-smooth shrink-0">
          {categories.map((cat) => {
            const IconComp = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100/90 border border-slate-900/[0.06]'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
