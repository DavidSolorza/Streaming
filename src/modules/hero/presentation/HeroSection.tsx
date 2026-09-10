import React from 'react';
import { Icon } from '@iconify/react';
import { Flame, Zap, Layers } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import videoSource from '../../../../resources/All Streaming Services Originals Intro Effects.mp4';

interface PremiereItem {
  id: string;
  title: string;
  platform: string;
  icon: string;
  searchTag: string;
}

const PREMIERES: PremiereItem[] = [
  { id: '1', title: 'La Casa del Dragón', platform: 'Disponible en Max', icon: 'simple-icons:max', searchTag: 'max' },
  { id: '2', title: 'Stranger Things 5', platform: 'Disponible en Netflix', icon: 'logos:netflix-icon', searchTag: 'netflix' },
  { id: '3', title: 'Deadpool & Wolverine', platform: 'Disponible en Disney+', icon: 'logos:disney-plus', searchTag: 'disney' },
  { id: '4', title: 'The Boys T4', platform: 'Disponible en Prime Video', icon: 'simple-icons:amazonprime', searchTag: 'prime' },
  { id: '5', title: 'Champions League ESPN', platform: 'Disponible en Disney+', icon: 'logos:disney-plus', searchTag: 'espn' },
  { id: '6', title: 'Dragon Ball DAIMA', platform: 'Disponible en Crunchyroll', icon: 'simple-icons:crunchyroll', searchTag: 'crunchyroll' },
];

const MARQUEE_BRANDS = [
  { name: 'DISNEY+', color: 'text-sky-600', icon: 'logos:disney-plus' },
  { name: 'PRIME VIDEO', color: 'text-cyan-600', icon: 'simple-icons:amazonprime' },
  { name: 'CRUNCHYROLL', color: 'text-orange-500', icon: 'simple-icons:crunchyroll' },
  { name: 'SPOTIFY', color: 'text-emerald-600', icon: 'logos:spotify-icon' },
  { name: 'NETFLIX', color: 'text-red-600', icon: 'logos:netflix-icon' },
  { name: 'MAX (HBO)', color: 'text-blue-600', icon: 'simple-icons:max' },
];

export const HeroSection: React.FC = () => {
  const scrollToCatalog = () => {
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCombos = () => {
    const combosEl = document.getElementById('combos');
    if (combosEl) {
      combosEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePremiereClick = (tag: string) => {
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-8 pb-0 overflow-hidden bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Título Principal Idéntico al Mockup */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Tus plataformas favoritas al{' '}
            <span className="text-blue-600 block sm:inline">
              mejor precio de Colombia
            </span>
          </h1>
        </div>

        {/* Widescreen Video Frame Limpio */}
        <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden bg-slate-900 border border-slate-900/[0.08] shadow-[0_15px_35px_-5px_rgba(15,23,42,0.12)]">
          <div className="aspect-[21/9] w-full overflow-hidden relative">
            <video
              src={videoSource}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        </div>

        {/* Botones de Acción Debajo del Video */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" size="lg" onClick={scrollToCatalog}>
            <span className="flex items-center gap-2 font-black">
              <Zap className="w-4 h-4 text-white fill-white" />
              Ver Planes y Precios
            </span>
          </Button>
          <Button variant="secondary" size="lg" onClick={scrollToCombos}>
            <span className="flex items-center gap-2 font-black">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
              Arma tu Paquete
            </span>
          </Button>
        </div>

        {/* Carrusel "ESTRENOS DEL MES EN TENDENCIA" */}
        <div id="premieres" className="mt-12 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Estrenos del Mes en Tendencia</span>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Haz clic para filtrar</span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
            {PREMIERES.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePremiereClick(item.searchTag)}
                className="bg-white border border-slate-900/[0.08] rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-blue-500 transition-all flex items-center gap-3 shrink-0 min-w-[210px] text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-900/[0.06] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Icon icon={item.icon} className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-black text-slate-900 truncate group-hover:text-blue-700 transition">
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-semibold text-slate-400 block truncate">
                    {item.platform}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Ticker Infinito de Marcas (Full Width al Fondo del Hero) */}
      <div className="w-full bg-white border-y border-slate-900/[0.08] py-4 overflow-hidden shadow-xs mt-6">
        <div className="animate-marquee flex items-center gap-8 text-xs font-black uppercase tracking-widest whitespace-nowrap">
          {[...MARQUEE_BRANDS, ...MARQUEE_BRANDS, ...MARQUEE_BRANDS, ...MARQUEE_BRANDS].map((brand, i) => (
            <div key={i} className="flex items-center gap-8 shrink-0">
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-2">
                <Icon icon={brand.icon} className="w-4 h-4" />
                <span className={brand.color}>{brand.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
