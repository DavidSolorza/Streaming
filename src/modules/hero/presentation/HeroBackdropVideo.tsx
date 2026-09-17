import React from 'react';
import { PlatformIcon } from '@/shared/components/PlatformIcon';
import { Volume2, VolumeX, Star, ChevronLeft, ChevronRight } from 'lucide-react';
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
  activeMovie, hasVideoError, isMuted, iframeRef, fallbackVideoRef,
  onPrev, onNext, onToggleMute, onVideoError, onMouseEnter, onMouseLeave
}) => (
  <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[16/9] sm:aspect-[21/9] min-h-[260px] sm:min-h-[380px] group shadow-inner" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    {hasVideoError || !activeMovie.youtubeId ? (
      <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden pointer-events-none select-none">
        <video ref={fallbackVideoRef} key={`fallback-${activeMovie.id}`} src="/videos/streaming-intro.mp4" autoPlay loop playsInline muted={isMuted} className="w-full h-full object-cover scale-[1.02] border-0 pointer-events-none" />
      </div>
    ) : (
      <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden pointer-events-none select-none">
        <iframe ref={iframeRef} key={activeMovie.id} src={`https://www.youtube.com/embed/${activeMovie.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&autohide=1&loop=1&playlist=${activeMovie.youtubeId}&playsinline=1&enablejsapi=1`} title={activeMovie.movieTitle} onError={onVideoError} className="w-full h-full object-cover scale-[1.45] -translate-y-1 border-0 pointer-events-none" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
      </div>
    )}
    <div className="absolute inset-0 z-10 bg-transparent pointer-events-auto select-none" />
    <button onClick={onPrev} className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-950/70 backdrop-blur-md text-white/80 hover:text-white hover:bg-slate-900 transition border border-white/10 opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer" title="Tráiler anterior">
      <ChevronLeft className="w-5 h-5" />
    </button>
    <button onClick={onNext} className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-950/70 backdrop-blur-md text-white/80 hover:text-white hover:bg-slate-900 transition border border-white/10 opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer" title="Siguiente tráiler">
      <ChevronRight className="w-5 h-5" />
    </button>
    <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
      <div className="flex items-center gap-2">
        <span className="bg-slate-950/80 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 shadow-md">
          <PlatformIcon icon={activeMovie.icon} name={activeMovie.brand} className="w-4 h-4" />
          {activeMovie.brand}
        </span>
        <span className="bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1 shadow-md">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          {activeMovie.rating}
        </span>
      </div>
      <button onClick={onToggleMute} className="p-2.5 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-200 hover:text-white transition border border-white/10 shadow-md cursor-pointer" title={isMuted ? 'Activar sonido' : 'Silenciar'}>
        {isMuted ? <VolumeX className="w-4 h-4 text-slate-300" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
      </button>
    </div>
  </div>
);
