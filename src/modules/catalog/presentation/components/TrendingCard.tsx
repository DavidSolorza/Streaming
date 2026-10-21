import React from 'react';
import { Star } from 'lucide-react';
import { PosterImage } from './PosterImage';
import { TrendingItem } from '../../infrastructure/trendingRepository';

interface TrendingCardProps {
  item: TrendingItem;
  onClick: () => void;
}

export const TrendingCard: React.FC<TrendingCardProps> = ({ item, onClick }) => (
  <article
    onClick={onClick}
    className="group relative flex-none w-[155px] h-[235px] rounded-2xl overflow-hidden cursor-pointer shadow-luxury hover:shadow-luxury-hover transition-all duration-300 hover:-translate-y-1.5 border border-slate-900/[0.08] bg-slate-900"
  >
    <PosterImage src={item.posterUrl} alt={item.title} platformColor={item.platformColor} className="transition-transform duration-500 group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
    <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between text-[10px] font-medium z-10">
      {item.platform ? (
        <span className={`px-2 py-0.5 rounded-full text-white font-black backdrop-blur-md shadow-md text-[9px] uppercase tracking-wider ${item.platformColor || 'bg-blue-600'}`}>
          {item.platform}
        </span>
      ) : <span />}
      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-amber-300 font-extrabold text-[10px] shadow-sm">
        <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
        {item.rating}
      </span>
    </div>
    <div className="absolute bottom-2.5 inset-x-2.5 z-10">
      <h3 className="font-extrabold text-white text-xs sm:text-sm line-clamp-2 leading-snug drop-shadow-md mb-0.5">{item.title}</h3>
      {item.platform ? (
        <p className="text-[10px] text-slate-300 font-bold flex items-center gap-1 group-hover:text-blue-300 transition-colors">
          <span>Ver en {item.platform}</span>
          <span className="text-xs font-black transition-transform group-hover:translate-x-1">→</span>
        </p>
      ) : (
        <p className="text-[10px] text-slate-400 font-semibold">
          <span>Estreno en Cartelera</span>
        </p>
      )}
    </div>
  </article>
);
