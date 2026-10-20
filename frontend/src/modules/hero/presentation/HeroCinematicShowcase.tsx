import React from 'react';
import { useHeroShowcase } from './useHeroShowcase';
import { HeroBackdropVideo } from './HeroBackdropVideo';
import { HeroContentOverlay } from './HeroContentOverlay';

export const HeroCinematicShowcase: React.FC = () => {
  const {
    activeMovie, isMuted, setIsPaused, hasVideoError, setHasVideoError,
    iframeRef, fallbackVideoRef, handleNext, handlePrev, toggleMute, handleBuyWhatsApp, handleAddToCart
  } = useHeroShowcase();

  if (!activeMovie) return null;

  return (
    <div className="w-full max-w-7xl mx-auto my-3 sm:my-5 px-2 sm:px-4">
      <div className="bg-white rounded-3xl border border-slate-900/[0.08] shadow-[0_15px_35px_-5px_rgba(15,23,42,0.08)] overflow-hidden p-2.5 sm:p-4 space-y-3">
        <HeroBackdropVideo
          activeMovie={activeMovie}
          hasVideoError={hasVideoError}
          isMuted={isMuted}
          iframeRef={iframeRef}
          fallbackVideoRef={fallbackVideoRef}
          onPrev={handlePrev}
          onNext={handleNext}
          onToggleMute={toggleMute}
          onVideoError={() => setHasVideoError(true)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        />
        <HeroContentOverlay
          activeMovie={activeMovie}
          onBuyWhatsApp={handleBuyWhatsApp}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
};
