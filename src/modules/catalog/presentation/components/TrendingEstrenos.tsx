import React, { useEffect, useState } from 'react';
import { TrendingRepository, TrendingItem } from '../../infrastructure/trendingRepository';
import { PosterImage } from './PosterImage';
import { Star, Sparkles, RotateCw } from 'lucide-react';
import { eventBus } from '@/core/bus/eventBus';

interface TrendingEstrenosProps {
  onSelectPlatform?: (platformId: string) => void;
}

export const TrendingEstrenos: React.FC<TrendingEstrenosProps> = ({ onSelectPlatform }) => {
  const [estrenos, setEstrenos] = useState<TrendingItem[]>(() => TrendingRepository.getInitialData());
  const [loading, setLoading] = useState<boolean>(() => estrenos.length === 0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchTrendingData = (force: boolean = false) => {
    if (force) {
      setIsRefreshing(true);
    }
    setLoading(true);

    TrendingRepository.getTrending(force).then((data) => {
      if (data && data.length > 0) {
        setEstrenos(data);
      }
      setLoading(false);
      setIsRefreshing(false);
    });
  };

  useEffect(() => {
    fetchTrendingData(false);

    // Escuchar servicio EventBus para recargar la cartelera bajo demanda
    const unsubRefresh = eventBus.on('CATALOG:REFRESH_TRENDING', () => {
      fetchTrendingData(true);
    });

    return () => {
      unsubRefresh();
    };
  }, []);

  const handleManualRefresh = () => {
    eventBus.emit('CATALOG:REFRESH_TRENDING', undefined);
    eventBus.emit('NOTIFICATION:SHOW', {
      message: 'Obteniendo últimos estrenos en vivo desde la API...',
      type: 'info',
    });
  };

  const handleItemClick = (platform: string) => {
    if (onSelectPlatform) {
      onSelectPlatform(platform);
    }

    // Emitir evento para activar filtro y resaltar tarjeta en el catálogo
    eventBus.emit('CATALOG:HIGHLIGHT_PLATFORM', platform);
  };

  return (
    /* Oculto en móviles (< md) y completamente centrado y estático en PC (>= md) */
    <section id="premieres" className="hidden md:block mt-12 mb-10">
      {/* Cabecera Centrada sin Flechas con servicio de recarga */}
      <div className="text-center space-y-1.5 mb-6 relative group/header">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-black uppercase text-blue-700 tracking-wider flex items-center justify-center gap-1.5 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            <Sparkles className="w-4 h-4 text-blue-700" />
            Cartelera Destacada
          </span>
          <button
            onClick={handleManualRefresh}
            title="Recargar estrenos en vivo desde la API"
            className={`p-1.5 rounded-full bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-700 transition-all ${
              isRefreshing ? 'animate-spin text-blue-700' : ''
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <h3 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
          Estrenos del Mes
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl mx-auto">
          Cartelera oficial de novedades HD disponibles en tus plataformas favoritas
        </p>
      </div>

      {/* Galería Centrada de Tarjetas Estáticas */}
      <div className="flex justify-center items-center gap-4 overflow-x-auto pb-2 pt-1 px-1 no-scrollbar">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex-none w-[155px] h-[235px] rounded-2xl bg-slate-200 animate-pulse border border-slate-900/[0.08]"
              />
            ))
          : estrenos.map((item) => (
              <article
                key={item.id}
                onClick={() => handleItemClick(item.platform)}
                className="group relative flex-none w-[155px] h-[235px] rounded-2xl overflow-hidden cursor-pointer shadow-luxury hover:shadow-luxury-hover transition-all duration-300 hover:-translate-y-1.5 border border-slate-900/[0.08] bg-slate-900"
              >
                {/* Imagen del Póster HD */}
                <PosterImage
                  src={item.posterUrl}
                  alt={item.title}
                  platformColor={item.platformColor}
                  className="transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradiente Protector de Legibilidad Cinematográfico */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

                {/* Badges Superiores Flotantes */}
                <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between text-[10px] font-medium z-10">
                  <span className={`px-2 py-0.5 rounded-full text-white font-black backdrop-blur-md shadow-md text-[9px] uppercase tracking-wider ${item.platformColor}`}>
                    {item.platform}
                  </span>
                  
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-amber-300 font-extrabold text-[10px] shadow-sm">
                    <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                    {item.rating}
                  </span>
                </div>

                {/* Información Inferior Enriquecida */}
                <div className="absolute bottom-2.5 inset-x-2.5 z-10">
                  <h4 className="font-extrabold text-white text-xs sm:text-sm line-clamp-2 leading-snug drop-shadow-md mb-0.5">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-300 font-bold flex items-center gap-1 group-hover:text-blue-300 transition-colors">
                    <span>Ver en {item.platform}</span>
                    <span className="text-xs font-black transition-transform group-hover:translate-x-1">→</span>
                  </p>
                </div>
              </article>
            ))}
      </div>
    </section>
  );
};
