import React, { useEffect, useState } from 'react';
import { TrendingRepository, TrendingItem } from '../../infrastructure/trendingRepository';
import { TrendingCard } from './TrendingCard';
import { Sparkles, RotateCw } from 'lucide-react';
import { eventBus } from '@/core/bus/eventBus';

interface TrendingEstrenosProps {
  onSelectPlatform?: (platformId: string) => void;
}

export const TrendingEstrenos: React.FC<TrendingEstrenosProps> = ({ onSelectPlatform }) => {
  const [estrenos, setEstrenos] = useState<TrendingItem[]>(() => TrendingRepository.getInitialData());
  const [loading, setLoading] = useState<boolean>(() => estrenos.length === 0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchTrendingData = (force: boolean = false) => {
    if (force) setIsRefreshing(true);
    setLoading(true);
    TrendingRepository.getTrending(force).then((data) => {
      if (data && data.length > 0) setEstrenos(data);
      setLoading(false);
      setIsRefreshing(false);
    });
  };

  useEffect(() => {
    if (estrenos.length === 0) {
      fetchTrendingData(false);
    }
    const unsub = eventBus.on('CATALOG:REFRESH_TRENDING', () => fetchTrendingData(true));
    return () => { unsub(); };
  }, []);

  const handleManualRefresh = () => {
    eventBus.emit('CATALOG:REFRESH_TRENDING', undefined);
    eventBus.emit('NOTIFICATION:SHOW', { message: 'Obteniendo últimos estrenos en vivo...', type: 'info' });
  };

  const handleItemClick = (platform?: string) => {
    if (!platform) return;
    if (onSelectPlatform) onSelectPlatform(platform);
    eventBus.emit('CATALOG:HIGHLIGHT_PLATFORM', platform);
  };

  return (
    <section id="premieres" className="hidden md:block mt-12 mb-10">
      <div className="text-center space-y-1.5 mb-6 relative group/header">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-black uppercase text-blue-700 tracking-wider flex items-center justify-center gap-1.5 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            <Sparkles className="w-4 h-4 text-blue-700" /> Cartelera Destacada
          </span>
          <button
            onClick={handleManualRefresh}
            aria-label="Actualizar cartelera de estrenos"
            className={`p-1.5 rounded-full bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-all ${isRefreshing ? 'animate-spin text-blue-700' : ''}`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <h2 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">Estrenos del Mes</h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto">Cartelera oficial de novedades HD disponibles en tus plataformas favoritas</p>
      </div>
      <div className="flex justify-center items-center gap-4 overflow-x-auto pb-2 pt-1 px-1 no-scrollbar">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="flex-none w-[155px] h-[235px] rounded-2xl bg-slate-200 animate-pulse border border-slate-900/[0.08]" />)
          : estrenos.map((item) => <TrendingCard key={item.id} item={item} onClick={() => handleItemClick(item.platform)} />)}
      </div>
    </section>
  );
};
