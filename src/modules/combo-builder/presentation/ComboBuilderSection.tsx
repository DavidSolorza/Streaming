import React from 'react';
import { Icon } from '@iconify/react';
import { Sparkles, MessageCircle, Layers, Check } from 'lucide-react';
import { useComboBuilder } from '../application/useComboBuilder';
import { Button } from '@/shared/components/Button';

export const ComboBuilderSection: React.FC = () => {
  const { selectedItems, toggleItem, discountInfo, handleCheckoutCombo } = useComboBuilder();

  const platforms = [
    { name: 'Netflix', icon: 'logos:netflix-icon' },
    { name: 'Max (HBO)', icon: 'simple-icons:max' },
    { name: 'Disney+', icon: 'logos:disney-plus' },
    { name: 'Prime Video', icon: 'simple-icons:amazonprime' },
  ];

  return (
    <section id="combos" className="bg-white border-y border-slate-900/[0.08] py-16 relative overflow-hidden shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="text-blue-700 text-xs font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
          <Layers className="w-4 h-4 text-blue-700" />
          Constructor Dinámico
        </span>
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
                className={`p-4 rounded-2xl border transition text-xs font-bold flex flex-col items-center gap-2.5 group shadow-sm relative ${isSelected ? 'bg-blue-50/80 border-blue-700 text-blue-900' : 'bg-slate-50 border-slate-900/[0.08] text-slate-900 hover:border-blue-700'}`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-blue-700 text-white rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition">
                  <Icon icon={plat.icon} className="w-8 h-8" />
                </div>
                <span>{plat.name}</span>
              </button>
            );
          })}
        </div>

        {selectedItems.length > 0 && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-500/20 text-emerald-800 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>{discountInfo.label}</span>
          </div>
        )}

        <div>
          <Button variant="mint" size="lg" onClick={handleCheckoutCombo}>
            <span className="flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-700" />
              Solicitar Descuento del Combo por WhatsApp
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};
