import React from 'react';
import { useComboBuilder } from '../application/useComboBuilder';
import { Button } from '@/shared/components/Button';

export const ComboBuilderSection: React.FC = () => {
  const { selectedItems, toggleItem, discountInfo, handleCheckoutCombo } = useComboBuilder();

  const platforms = [
    { name: 'Netflix', icon: '🎬' },
    { name: 'Max (HBO)', icon: '🍿' },
    { name: 'Disney+', icon: '⭐' },
    { name: 'Prime Video', icon: '📦' },
  ];

  return (
    <section id="constructor" className="bg-white border-y border-slate-900/[0.08] py-16 relative overflow-hidden shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="text-blue-700 text-xs font-bold uppercase tracking-widest mb-2 block">Constructor Dinámico</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Arma tu Propio Combo a Medida</h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto mb-8">
          Selecciona las plataformas que usas a diario y recibe una cotización con descuento instantáneo.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {platforms.map((plat) => {
            const isSelected = selectedItems.includes(plat.name);
            return (
              <button
                key={plat.name}
                onClick={() => toggleItem(plat.name)}
                className={`p-4 rounded-2xl border transition text-xs font-bold flex flex-col items-center gap-2 group shadow-sm ${isSelected ? 'bg-blue-50 border-blue-700 text-blue-800' : 'bg-slate-50 border-slate-900/[0.08] text-slate-900 hover:border-blue-700'}`}
              >
                <span className="text-2xl group-hover:scale-110 transition">{plat.icon}</span>
                {plat.name}
              </button>
            );
          })}
        </div>

        {selectedItems.length > 0 && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-500/20 text-emerald-800 rounded-xl text-xs font-extrabold inline-block">
            ✨ {discountInfo.label}
          </div>
        )}

        <div>
          <Button variant="mint" size="lg" onClick={handleCheckoutCombo}>
            💬 Solicitar Descuento del Combo por WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
};
