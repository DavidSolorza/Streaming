import React, { useState, useEffect } from 'react';
import { PlatformIcon } from '@/shared/components/PlatformIcon';
import { Volume2, VolumeX, Star, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { FeaturedMovieItem } from './useHeroShowcase';

interface HeroBackdropVideoProps {
  activeMovie: FeaturedMovieItem;
  hasVideoError: boolean;
  isMuted: boolean;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  fallbackVideoRef: React.RefObject<HTMLVideoElement>;
  onPrev: () => void;
  onNext: () => void;
  onToggleMute: () => void;
  onVideoError: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const HeroBackdropVideo: React.FC<HeroBackdropVideoProps> = ({
  activeMovie, hasVideoError, isMuted, iframeRef,
  onPrev, onNext, onToggleMute, onVideoError, onMouseEnter, onMouseLeave
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
  }, [activeMovie.id]);

  const backdropImage = activeMovie.backdropUrl ||
    (activeMovie.youtubeId ? `https://img.youtube.com/vi/${activeMovie.youtubeId}/hqdefault.jpg` : activeMovie.posterUrl);

  const handleStartTrailer = () => {
    setIsPlaying(true);
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[16/9] sm:aspect-[21/9] min-h-[260px] sm:min-h-[380px] group shadow-inner"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isPlaying && !hasVideoError && activeMovie.youtubeId ? (
        <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden pointer-events-none select-none">
          <iframe
            ref={iframeRef}
            key={activeMovie.id}
            src={`https://www.youtube-nocookie.com/embed/${activeMovie.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&autohide=1&loop=1&playlist=${activeMovie.youtubeId}&playsinline=1&enablejsapi=1`}
            title={activeMovie.movieTitle}
            onError={onVideoError}
            loading="lazy"
            className="w-full h-full object-cover scale-[1.45] -translate-y-1 border-0 pointer-events-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      ) : (
        <div
          onClick={handleStartTrailer}
          className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden cursor-pointer"
        >
          <img
            src={backdropImage}
            alt={activeMovie.movieTitle}
            width="1280"
            height="720"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover opacity-65 group-hover:scale-105 group-hover:opacity-85 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 z-10">
            <button
              onClick={handleStartTrailer}
              aria-label={`Reproducir tráiler de ${activeMovie.movieTitle}`}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl shadow-blue-500/40 group-hover:scale-110 transition-all duration-300 ring-4 ring-white/20"
            >
              <Play className="w-8 h-8 fill-white translate-x-0.5 text-white" />
            </button>
            <span className="text-[11px] sm:text-xs font-black tracking-widest text-white/95 uppercase bg-slate-950/80 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
              Ver Tráiler HD Oficial
            </span>
          </div>
        </div>
      )}

      {/* Botones de navegación y Badges */}
      <button onClick={onPrev} aria-label="Tráiler anterior" className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-950/70 backdrop-blur-md text-white/80 hover:text-white hover:bg-slate-900 transition border border-white/10 opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer" title="Tráiler anterior">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={onNext} aria-label="Siguiente tráiler" className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-950/70 backdrop-blur-md text-white/80 hover:text-white hover:bg-slate-900 transition border border-white/10 opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer" title="Siguiente tráiler">
        <ChevronRight className="w-5 h-5" />
      </button>
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          {activeMovie.brand && (
            <span className="bg-slate-950/80 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 shadow-md">
              {activeMovie.icon && <PlatformIcon icon={activeMovie.icon} name={activeMovie.brand} className="w-4 h-4" />}
              {activeMovie.brand}
            </span>
          )}
          <span className="bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1 shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            {activeMovie.rating}
          </span>
        </div>
        {isPlaying && (
          <button onClick={onToggleMute} aria-label={isMuted ? 'Activar sonido del tráiler' : 'Silenciar tráiler'} className="p-2.5 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-200 hover:text-white transition border border-white/10 shadow-md cursor-pointer" title={isMuted ? 'Activar sonido' : 'Silenciar'}>
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-300" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        )}
      </div>
    </div>
  );
};
