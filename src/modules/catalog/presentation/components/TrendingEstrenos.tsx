import React from 'react';
import { Star, Flame, ChevronRight } from 'lucide-react';
import { ENV } from '@/core/config/env';

export interface EstrenoItem {
  id: string;
  title: string;
  platform: 'Netflix' | 'Disney+' | 'Max' | 'Prime Video' | 'Crunchyroll';
  platformId: string;
  platformColor: string;
  rating: number;
  posterPath: string; // TMDb poster path or full image URL
}

const ESTRENOS_DATA: EstrenoItem[] = [
  {
    id: '1',
    title: 'La Casa del Dragón',
    platform: 'Max',
    platformId: 'cine',
    platformColor: 'bg-blue-600',
    rating: 8.7,
    posterPath: 'https://image.tmdb.org/t/p/w500/1XDDXPXGiI8id7MrUxK26ke7Wus.jpg',
  },
  {
    id: '2',
    title: 'Stranger Things 5',
    platform: 'Netflix',
    platformId: 'cine',
    platformColor: 'bg-red-600',
    rating: 8.9,
    posterPath: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
  },
  {
    id: '3',
    title: 'Deadpool & Wolverine',
    platform: 'Disney+',
    platformId: 'cine',
    platformColor: 'bg-sky-600',
    rating: 8.2,
    posterPath: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
  },
  {
    id: '4',
    title: 'The Boys (T4)',
    platform: 'Prime Video',
    platformId: 'cine',
    platformColor: 'bg-cyan-600',
    rating: 8.6,
    posterPath: 'https://image.tmdb.org/t/p/w500/7Ns6tO3aYjppI5LoNOEGvdipAAL.jpg',
  },
  {
    id: '5',
    title: 'Champions League ESPN',
    platform: 'Disney+',
    platformId: 'deportes',
    platformColor: 'bg-sky-600',
    rating: 9.4,
    posterPath: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&q=80',
  },
  {
    id: '6',
    title: 'Dragon Ball DAIMA',
    platform: 'Crunchyroll',
    platformId: 'cine',
    platformColor: 'bg-orange-500',
    rating: 9.1,
    posterPath: 'https://image.tmdb.org/t/p/w500/z6c98qUv64t00M85iH2qXQjXgU3.jpg',
  }
];

interface TrendingEstrenosProps {
  onSelectPlatform?: (platformId: string) => void;
}

export const TrendingEstrenos: React.FC<TrendingEstrenosProps> = ({ onSelectPlatform }) => {
  const handleItemClick = (platformId: string) => {
    if (onSelectPlatform) {
      onSelectPlatform(platformId);
    }
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getFullPosterUrl = (posterPath: string) => {
    if (posterPath.startsWith('http')) return posterPath;
    return `${ENV.TMDB_IMAGE_BASE_URL}${posterPath}`;
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
              Pósteres oficiales e información del catálogo de TMDb API
            </p>
          </div>
        </div>

        <span className="text-xs text-blue-700 font-bold flex items-center gap-0.5 cursor-pointer hover:underline">
          Haz clic para filtrar <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* Carrusel Deslizante de Tarjetas Compactas (Pósteres HD) */}
      <div className="flex gap-3.5 overflow-x-auto pb-4 pt-1 no-scrollbar snap-x scroll-smooth">
        {ESTRENOS_DATA.map((item) => (
          <article
            key={item.id}
            onClick={() => handleItemClick(item.platformId)}
            className="group relative flex-none w-[145px] sm:w-[165px] h-[215px] sm:h-[240px] rounded-2xl overflow-hidden cursor-pointer shadow-luxury hover:shadow-luxury-hover transition-all duration-300 hover:-translate-y-1.5 snap-start border border-slate-900/[0.08] bg-slate-900"
          >
            {/* Imagen del Póster Oficial TMDb */}
            <img
              src={getFullPosterUrl(item.posterPath)}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />

            {/* Gradiente Protector de Legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/10" />

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
