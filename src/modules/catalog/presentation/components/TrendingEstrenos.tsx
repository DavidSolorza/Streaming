import React, { useEffect, useState } from 'react';
import { TrendingRepository, TrendingItem } from '../../infrastructure/trendingRepository';
import { PosterImage } from './PosterImage';
import { Star, Flame, ChevronRight } from 'lucide-react';

interface TrendingEstrenosProps {
  onSelectPlatform?: (platformId: string) => void;
}

export const TrendingEstrenos: React.FC<TrendingEstrenosProps> = ({ onSelectPlatform }) => {
  const [estrenos, setEstrenos] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    TrendingRepository.getTrending().then((data) => {
      if (isMounted) {
        setEstrenos(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleItemClick = (platformId: string) => {
    if (onSelectPlatform) {
      onSelectPlatform(platformId);
    }
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="premieres" className="mt-12 mb-8">
      {/* Cabecera Cinematográfica */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Flame className="w-4 h-4 fill-amber-500" />
          </span>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
              Estrenos del Mes en Tendencia
            </h3>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Pósteres HD en tiempo real con caché inteligente de 24 horas
            </p>
          </div>
        </div>

        <span className="text-xs text-blue-700 font-bold flex items-center gap-0.5 cursor-pointer hover:underline">
          Haz clic para filtrar <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* Carrusel Deslizante de Tarjetas Compactas con Skeletons */}
      <div className="flex gap-3.5 overflow-x-auto pb-4 pt-1 no-scrollbar snap-x scroll-smooth">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex-none w-[145px] sm:w-[165px] h-[215px] sm:h-[240px] rounded-2xl bg-slate-200 animate-pulse border border-slate-900/[0.08]"
              />
            ))
          : estrenos.map((item) => (
              <article
                key={item.id}
                onClick={() => handleItemClick(item.platformId)}
                className="group relative flex-none w-[145px] sm:w-[165px] h-[215px] sm:h-[240px] rounded-2xl overflow-hidden cursor-pointer shadow-luxury hover:shadow-luxury-hover transition-all duration-300 hover:-translate-y-1.5 snap-start border border-slate-900/[0.08] bg-slate-900"
              >
                {/* Imagen protegida contra errores y con tamaño optimizado w185 */}
                <PosterImage
                  src={item.posterUrl}
                  alt={item.title}
                  platformColor={item.platformColor}
                  className="transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradiente Protector de Legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent pointer-events-none" />

                {/* Badges Superiores Flotantes */}
                <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between text-[10px] font-medium z-10">
                  <span className={`px-2 py-0.5 rounded-full text-white font-bold backdrop-blur-md shadow-sm text-[9px] uppercase tracking-wider ${item.platformColor}`}>
                    {item.platform}
                  </span>
                  
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 font-bold text-[10px]">
                    <Star className="w-2.5 h-2.5 fill-amber-300" />
                    {item.rating}
                  </span>
                </div>

                {/* Información Inferior */}
                <div className="absolute bottom-2.5 inset-x-2.5 z-10">
                  <h4 className="font-extrabold text-white text-xs sm:text-sm line-clamp-2 leading-snug drop-shadow-sm mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-300 font-bold flex items-center gap-1 group-hover:text-blue-300 transition-colors">
                    <span>Ver en {item.platform}</span>
                    <span className="text-xs font-black">→</span>
                  </p>
                </div>
              </article>
            ))}
      </div>
    </section>
  );
};
