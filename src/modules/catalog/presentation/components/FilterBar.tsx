import React from 'react';

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
    { id: 'all', label: 'Todas' },
    { id: 'cine', label: '🎬 Películas & Series' },
    { id: 'musica', label: '🎵 Música' },
    { id: 'deportes', label: '⚽ Deportes' },
    { id: 'combo', label: '🔥 Combos' },
  ];

  return (
    <div className="sticky top-20 z-30 bg-white/95 border border-slate-900/[0.08] p-4 rounded-3xl mb-10 shadow-luxury backdrop-blur-xl">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Buscador Predictivo en Tiempo Real */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 text-base">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por servicio (ej. Netflix, Max) o contenido (ej. Fútbol, Anime)..."
            className="w-full bg-slate-50 border border-slate-900/[0.08] rounded-2xl pl-11 pr-10 py-3 text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition"
          />
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-900 text-xs font-bold"
            >
              Limpiar ✕
            </button>
          )}
        </div>

        {/* Chips Horizontales Rápidos */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`chip-btn px-4 py-2.5 rounded-xl text-xs font-bold transition ${selectedCategory === cat.id ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-900/[0.08]'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
