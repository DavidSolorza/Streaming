import React from 'react';
import { PlatformIcon } from '@/shared/components/PlatformIcon';
import { PosterImage } from '@/modules/catalog/presentation/components/PosterImage';
import { MessageCircle, ShoppingBag, Star } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { formatCOP } from '@/core/utils/currency';
import { FeaturedMovieItem } from './useHeroShowcase';

interface HeroContentOverlayProps {
  activeMovie: FeaturedMovieItem;
  onBuyWhatsApp: () => void;
  onAddToCart: () => void;
}

export const HeroContentOverlay: React.FC<HeroContentOverlayProps> = ({
  activeMovie, onBuyWhatsApp, onAddToCart
}) => (
  <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 shadow-xs">
    <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
      <div className="w-20 h-28 sm:w-24 sm:h-36 rounded-2xl overflow-hidden border border-slate-200/90 shadow-md shrink-0 relative bg-slate-100 group transition-transform hover:scale-105 duration-300">
        <PosterImage src={activeMovie.posterUrl} alt={activeMovie.movieTitle} className="w-full h-full object-cover" />
      </div>
      <div className="min-w-0 space-y-1.5 flex-1 pr-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">{activeMovie.movieTitle}</h3>
          {activeMovie.brand && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100/80 shrink-0">
              {activeMovie.icon && <PlatformIcon icon={activeMovie.icon} name={activeMovie.brand} className="w-4 h-4" />}
              {activeMovie.brand}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            {activeMovie.rating}
          </span>
        </div>
        <p className="text-xs sm:text-sm font-extrabold text-blue-600/90">{activeMovie.tagline}</p>
        <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2 sm:line-clamp-3">{activeMovie.description}</p>
      </div>
    </div>
    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
      {activeMovie.price ? (
        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/90 text-left lg:text-right">
          <span className="text-xl sm:text-2xl font-black text-emerald-600 block leading-none">{formatCOP(activeMovie.price)}</span>
          <span className="text-[10px] text-slate-400 font-extrabold block uppercase mt-0.5">/ mes</span>
        </div>
      ) : (
        <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/90 text-left lg:text-right">
          <span className="text-xs font-black text-slate-700 block">Estreno Cartelera</span>
          <span className="text-[10px] text-slate-400 font-extrabold block uppercase">HD Oficial</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button variant="mint" size="md" onClick={onBuyWhatsApp} className="shadow-xs">
          <span className="flex items-center justify-center gap-2 font-black text-xs sm:text-sm whitespace-nowrap px-1">
            <MessageCircle className="w-4 h-4 text-emerald-700" />
            {activeMovie.brand ? 'Pedir por WhatsApp' : 'Consultar en WhatsApp'}
          </span>
        </Button>
        {activeMovie.productId && (
          <Button variant="secondary" size="md" onClick={onAddToCart} className="bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 px-3">
            <ShoppingBag className="w-4 h-4 text-slate-700" />
          </Button>
        )}
      </div>
    </div>
  </div>
);
