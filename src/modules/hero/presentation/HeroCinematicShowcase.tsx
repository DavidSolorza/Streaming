import React, { useState, useEffect, useRef } from 'react';
import { PlatformIcon } from '@/shared/components/PlatformIcon';
import { MessageCircle, ShoppingBag, Sparkles, Volume2, VolumeX, Flame, ChevronRight, Play, Check } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { eventBus } from '@/core/bus/eventBus';
import { formatCOP } from '@/core/utils/currency';
import videoSource from '../../../../resources/All Streaming Services Originals Intro Effects.mp4';

export interface ShowcaseItem {
  id: string;
  name: string;
  brand: string;
  icon: string;
  tagline: string;
  description: string;
  badge: string;
  badgeColor: string;
  price: number;
  regularPrice: number;
  productId: number;
  startTime: number;
  endTime: number;
  backdropUrl: string;
  whatsappMessage: string;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'netflix',
    name: 'Netflix Original 4K UHD',
    brand: 'Netflix',
    icon: '/icons/icons8-netflix-desktop-app-windows-11-color/icons8-netflix-desktop-app-96.png',
    tagline: 'Películas, Series Top & Estrenos Exclusivos',
    description: 'Perfil privado con PIN personal, garantía total 30 días y transmisión Ultra HD 4K.',
    badge: 'Más Vendido',
    badgeColor: 'bg-red-600 text-white shadow-red-600/30',
    price: 17000,
    regularPrice: 27000,
    productId: 2,
    startTime: 0,
    endTime: 10,
    backdropUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1200&auto=format&fit=crop',
    whatsappMessage: '¡Hola! Vengo desde la web y quiero solicitar la cuenta de *Netflix Original 4K UHD* por *$17.000 COP/mes*. ¿Me indicas los medios de pago?',
  },
  {
    id: 'disney',
    name: 'Disney+ Premium IMAX',
    brand: 'Disney+',
    icon: '/icons/icons8-disney-plus-windows-11-color/icons8-disney-plus-96.png',
    tagline: 'Marvel, Star Wars, Pixar & ESPN Deportes',
    description: 'Calidad IMAX Enhanced, deportes en vivo de ESPN y estrenos cine simultáneos.',
    badge: '4K Ultra HD',
    badgeColor: 'bg-sky-500 text-white shadow-sky-500/30',
    price: 16000,
    regularPrice: 26000,
    productId: 3,
    startTime: 10,
    endTime: 20,
    backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop',
    whatsappMessage: '¡Hola! Vengo desde la web y quiero comprar *Disney+ Premium* por *$16.000 COP/mes*. ¿Me das la información de pago?',
  },
  {
    id: 'max',
    name: 'Max (HBO) Plan Pro',
    brand: 'Max',
    icon: '/icons/icons8-hbo-max-ios-27-outlined/icons8-hbo-max-100.png',
    tagline: 'House of the Dragon & Cine de Taquilla',
    description: 'Las series icónicas de HBO, producciones de Warner Bros y eventos deportivos.',
    badge: 'Estrenos HBO',
    badgeColor: 'bg-blue-600 text-white shadow-blue-600/30',
    price: 15000,
    regularPrice: 25000,
    productId: 4,
    startTime: 20,
    endTime: 30,
    backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
    whatsappMessage: '¡Hola! Vengo desde la web y me interesa adquirir *Max (HBO)* por *$15.000 COP/mes*. ¿Tienen disponibilidad inmediata?',
  },
  {
    id: 'prime',
    name: 'Prime Video Original',
    brand: 'Prime Video',
    icon: '/icons/icons8-amazon-prime-video-color/icons8-amazon-prime-video-96.png',
    tagline: 'Amazon Originals & Cine Exclusivo',
    description: 'The Boys, El Señor de los Anillos y el catálogo de cine y series de Amazon.',
    badge: 'Entrega Instantánea',
    badgeColor: 'bg-cyan-500 text-white shadow-cyan-500/30',
    price: 14000,
    regularPrice: 24000,
    productId: 5,
    startTime: 30,
    endTime: 40,
    backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop',
    whatsappMessage: '¡Hola! Deseo adquirir la cuenta de *Prime Video* por *$14.000 COP/mes*. ¿Cómo puedo realizar el pago?',
  },
  {
    id: 'crunchyroll',
    name: 'Crunchyroll Mega Fan',
    brand: 'Crunchyroll',
    icon: '/icons/icons8-crunchyroll-windows-11-color/icons8-crunchyroll-96.png',
    tagline: 'Simulcast Anime 1 hora después de Japón',
    description: 'El catálogo más extenso de anime en HD, sin publicidad y con opción de descargas.',
    badge: 'Sin Anuncios',
    badgeColor: 'bg-orange-500 text-white shadow-orange-500/30',
    price: 12000,
    regularPrice: 22000,
    productId: 7,
    startTime: 40,
    endTime: 50,
    backdropUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop',
    whatsappMessage: '¡Hola! Vengo desde la web y quiero contratar *Crunchyroll Mega Fan* por *$12.000 COP/mes*. ¿Me envías los datos?',
  },
];

const AUTO_SLIDE_DURATION = 7000; // 7 segundos por ítem

export const HeroCinematicShowcase: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const addItemToCart = useCartStore((state) => state.addItem);

  const activeItem = SHOWCASE_ITEMS[activeIndex];

  // Controlar reproductor de video para saltar al tiempo adecuado
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = activeItem.startTime;
      videoRef.current.play().catch(() => {
        // Silencioso ante autoplays bloqueados por el navegador
      });
    }
  }, [activeIndex]);

  // Manejar loop de tiempo del video para no salirse del segmento del ítem
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      if (videoRef.current.currentTime >= activeItem.endTime) {
        videoRef.current.currentTime = activeItem.startTime;
      }
    }
  };

  // Timer para la barra de progreso tipo Stories (0 a 100%)
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50; // Ticks cada 50ms
    const step = (intervalTime / AUTO_SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((current) => (current + 1) % SHOWCASE_ITEMS.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, activeIndex]);

  const handleSelectTab = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
  };

  const handleBuyWhatsApp = () => {
    const url = `https://wa.me/573214465418?text=${encodeURIComponent(activeItem.whatsappMessage)}`;
    window.open(url, '_blank');
  };

  const handleAddToCart = () => {
    addItemToCart({
      cartItemId: `${activeItem.productId}-${Date.now()}`,
      id: activeItem.productId,
      name: activeItem.name,
      price: activeItem.price,
      image: activeItem.icon,
      quantity: 1,
    });

    eventBus.emit('NOTIFICATION:SHOW', {
      message: `¡${activeItem.name} se añadió a tu carrito!`,
      type: 'cart',
      title: '¡Añadido al Carrito!',
      price: activeItem.price,
      iconName: activeItem.icon,
    });
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-6 sm:my-8 px-2 sm:px-4">
      {/* Contenedor Principal Cinemático Oscuro (Steam / Epic Games / Apple TV+ Style) */}
      <div 
        className="relative bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] text-white grid grid-cols-1 lg:grid-cols-12 min-h-[460px] sm:min-h-[520px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        
        {/* PANEL IZQUIERDO: REPRODUCTOR DE VIDEO CINE & CAPAS GRADIENTES (70% en PC / Columna 1-8) */}
        <div className="lg:col-span-8 relative bg-black flex flex-col justify-between overflow-hidden group min-h-[300px] sm:min-h-[420px]">
          
          {/* Video de Fondo con Transición Suave */}
          <div className="absolute inset-0 w-full h-full bg-black">
            <video
              ref={videoRef}
              src={videoSource}
              autoPlay
              muted={isMuted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-cover opacity-90 transition-opacity duration-700"
            />
            {/* Degradados cinemáticos para legibilidad y fusión fluida */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent hidden sm:block" />
          </div>

          {/* Header Superior del Video: Badges y Mute Button */}
          <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5 ${activeItem.badgeColor}`}>
                <Flame className="w-3.5 h-3.5 fill-current" />
                {activeItem.badge}
              </span>
              <span className="bg-slate-900/80 backdrop-blur-md text-slate-300 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full border border-slate-700/60 hidden sm:inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Entrega 100% Inmediata
              </span>
            </div>

            {/* Botón Mute / Unmute */}
            <button
              onClick={toggleMute}
              className="p-2.5 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-white hover:bg-slate-800 transition border border-slate-700/60 shadow-md"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />}
            </button>
          </div>

          {/* Footer Inferior del Video: Metadata & CTA Contextual Directo */}
          <div className="relative z-10 p-4 sm:p-8 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-900/90 border border-slate-700/80 p-2 flex items-center justify-center shadow-xl backdrop-blur-md shrink-0">
                <PlatformIcon icon={activeItem.icon} name={activeItem.brand} className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block">{activeItem.brand}</span>
                <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                  {activeItem.name}
                </h2>
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm font-medium line-clamp-2 max-w-xl text-shadow-sm">
              {activeItem.description}
            </p>

            {/* Barra de Precios & CTA WhatsApp Contextual */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-baseline gap-2 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/60">
                <span className="text-xl sm:text-2xl font-black text-emerald-400">
                  {formatCOP(activeItem.price)}
                </span>
                <span className="text-xs text-slate-400 line-through font-semibold">
                  {formatCOP(activeItem.regularPrice)}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-extrabold ml-1">/ mes</span>
              </div>

              <div className="flex items-center gap-2 grow sm:grow-0">
                <Button variant="mint" size="md" onClick={handleBuyWhatsApp} className="shadow-emerald-950/50 grow sm:grow-0">
                  <span className="flex items-center justify-center gap-2 font-black text-xs sm:text-sm">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
                    Pedir por WhatsApp
                  </span>
                </Button>

                <Button variant="secondary" size="md" onClick={handleAddToCart} className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700 px-3">
                  <ShoppingBag className="w-4 h-4 text-blue-400" />
                </Button>
              </div>
            </div>
          </div>

        </div>

        {/* PANEL DERECHO: LISTA LATERAL ESTILO STEAM / EPIC GAMES (30% en PC / Columna 9-12) */}
        <div className="lg:col-span-4 bg-slate-950/90 border-t lg:border-t-0 lg:border-l border-slate-800/80 p-3 sm:p-4 flex flex-col justify-between overflow-hidden">
          
          <div className="space-y-1 mb-2 hidden lg:block px-2 pt-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Destacados del Mes
            </span>
          </div>

          {/* Tira Vertical en Desktop / Tira Horizontal Deslizable en Móvil */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
            {SHOWCASE_ITEMS.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectTab(index)}
                  onMouseEnter={() => handleSelectTab(index)}
                  className={`relative p-3 rounded-2xl transition-all duration-300 cursor-pointer text-left border shrink-0 w-[240px] sm:w-[280px] lg:w-full group overflow-hidden ${
                    isActive
                      ? 'bg-slate-900 border-blue-500/80 shadow-lg shadow-blue-500/10'
                      : 'bg-slate-950/50 border-slate-800/60 hover:bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  {/* Barra de Progreso Tipo "Stories" para el ítem activo */}
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-75 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center p-1.5 border shrink-0 transition-transform ${
                        isActive ? 'bg-blue-600/20 border-blue-500/40 scale-105' : 'bg-slate-900 border-slate-800'
                      }`}>
                        <PlatformIcon icon={item.icon} name={item.brand} className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <h4 className={`text-xs sm:text-sm font-extrabold truncate ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                          {item.brand}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate font-medium">
                          {item.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-black block ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {formatCOP(item.price)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Informativo del Panel Derecho */}
          <div className="mt-3 pt-3 border-t border-slate-900 hidden lg:flex items-center justify-between text-[11px] text-slate-400 font-medium px-2">
            <span>Pasa el mouse para explorar</span>
            <span className="flex items-center gap-1 text-blue-400 font-bold">
              Garantía Total 30 días <Check className="w-3.5 h-3.5" />
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
