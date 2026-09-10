import React, { useRef } from 'react';
import { Icon } from '@iconify/react';
import { TrendingEstrenos } from '@/modules/catalog/presentation/components/TrendingEstrenos';
import videoSource from '../../../../resources/All Streaming Services Originals Intro Effects.mp4';

const MARQUEE_BRANDS = [
  { name: 'DISNEY+', color: 'text-sky-600', icon: 'logos:disney-plus' },
  { name: 'PRIME VIDEO', color: 'text-cyan-600', icon: 'simple-icons:amazonprime' },
  { name: 'CRUNCHYROLL', color: 'text-orange-500', icon: 'simple-icons:crunchyroll' },
  { name: 'SPOTIFY', color: 'text-emerald-600', icon: 'logos:spotify-icon' },
  { name: 'NETFLIX', color: 'text-red-600', icon: 'logos:netflix-icon' },
  { name: 'MAX (HBO)', color: 'text-blue-600', icon: 'simple-icons:max' },
];

export const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
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

        {/* Widescreen Video Frame Limpio con Aislamiento GPU */}
        <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden bg-black border border-slate-900/[0.08] shadow-[0_15px_35px_-5px_rgba(15,23,42,0.12)]">
          <div className="aspect-[21/9] w-full overflow-hidden relative bg-black transform-gpu rounded-3xl">
            <video
              ref={videoRef}
              src={videoSource}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onEnded={handleVideoEnded}
              style={{
                backgroundColor: '#000000',
                willChange: 'transform',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
              }}
              className="w-full h-full object-cover rounded-3xl bg-black transform-gpu translate-z-0"
            />
          </div>
        </div>

        {/* Carrusel "ESTRENOS DEL MES EN TENDENCIA" con Pósteres HD TMDb */}
        <TrendingEstrenos />

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
