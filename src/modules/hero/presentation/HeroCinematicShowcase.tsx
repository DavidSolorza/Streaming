import React, { useState, useEffect } from 'react';
import { PlatformIcon } from '@/shared/components/PlatformIcon';
import { MessageCircle, ShoppingBag, Volume2, VolumeX, Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { eventBus } from '@/core/bus/eventBus';
import { formatCOP } from '@/core/utils/currency';

export interface FeaturedMovieItem {
  id: string;
  movieTitle: string;
  brand: string;
  icon: string;
  rating: number;
  tagline: string;
  price: number;
  regularPrice: number;
  productId: number;
  youtubeId: string;
  whatsappMessage: string;
}

const FEATURED_MOVIES: FeaturedMovieItem[] = [
  {
    id: 'moana-2',
    movieTitle: 'Moana 2',
    brand: 'Disney+',
    icon: '/icons/icons8-disney-plus-windows-11-color/icons8-disney-plus-96.png',
    rating: 7.2,
    tagline: 'Una nueva aventura épica en los océanos',
    price: 16000,
    regularPrice: 26000,
    productId: 3,
    youtubeId: 'hDZ7y8RP5HE',
    whatsappMessage: '¡Hola! Vengo desde el Hero de la web y quiero solicitar *Disney+ Premium* para ver *Moana 2* por *$16.000 COP/mes*. ¿Me das los medios de pago?',
  },
  {
    id: 'house-dragon',
    movieTitle: 'La Casa del Dragón',
    brand: 'Max',
    icon: '/icons/icons8-hbo-max-ios-27-outlined/icons8-hbo-max-100.png',
    rating: 8.5,
    tagline: 'Fuego y Sangre en máxima calidad 4K',
    price: 15000,
    regularPrice: 25000,
    productId: 4,
    youtubeId: 'DotnJ7tTA34',
    whatsappMessage: '¡Hola! Vengo desde el Hero de la web y quiero adquirir *Max (HBO)* para ver *La Casa del Dragón* por *$15.000 COP/mes*. ¿Me indicas cómo pagar?',
  },
  {
    id: 'spiderman-spiderverse',
    movieTitle: 'Spider-Man: Un Nuevo Día',
    brand: 'Disney+',
    icon: '/icons/icons8-disney-plus-windows-11-color/icons8-disney-plus-96.png',
    rating: 7.9,
    tagline: 'El multiverso completo en Ultra HD',
    price: 16000,
    regularPrice: 26000,
    productId: 3,
    youtubeId: 'cqGjhVJWtEg',
    whatsappMessage: '¡Hola! Me interesa la cuenta de *Disney+ Premium* por *$16.000 COP/mes*. ¿Me das los datos de pago?',
  },
  {
    id: 'the-boys',
    movieTitle: 'The Boys / Carrera contra el tiempo',
    brand: 'Prime Video',
    icon: '/icons/icons8-amazon-prime-video-color/icons8-amazon-prime-video-96.png',
    rating: 8.7,
    tagline: 'Acción sin censura y Amazon Originals',
    price: 14000,
    regularPrice: 24000,
    productId: 5,
    youtubeId: '06c1a_p-vO0',
    whatsappMessage: '¡Hola! Deseo adquirir *Prime Video* por *$14.000 COP/mes*. ¿Me envías la información de cuenta?',
  },
  {
    id: 'stranger-things',
    movieTitle: 'Stranger Things 5',
    brand: 'Netflix',
    icon: '/icons/icons8-netflix-desktop-app-windows-11-color/icons8-netflix-desktop-app-96.png',
    rating: 8.7,
    tagline: 'La temporada final en Ultra HD 4K',
    price: 17000,
    regularPrice: 27000,
    productId: 2,
    youtubeId: 'b9EkMc79ZSU',
    whatsappMessage: '¡Hola! Vengo desde el Hero de la web y quiero contratar *Netflix Original 4K UHD* por *$17.000 COP/mes*. ¿Tienen entrega inmediata?',
  },
  {
    id: 'demon-slayer',
    movieTitle: 'Demon Slayer: Castillo Infinito',
    brand: 'Crunchyroll',
    icon: '/icons/icons8-crunchyroll-windows-11-color/icons8-crunchyroll-96.png',
    rating: 8.9,
    tagline: 'Simulcast Anime directo de Japón',
    price: 12000,
    regularPrice: 22000,
    productId: 7,
    youtubeId: 'WY682855T20',
    whatsappMessage: '¡Hola! Quiero contratar *Crunchyroll Mega Fan* por *$12.000 COP/mes*. ¿Me envías los datos?',
  }
];

const AUTO_SLIDE_DURATION = 8000; // 8 segundos por película

export const HeroCinematicShowcase: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const addItemToCart = useCartStore((state) => state.addItem);

  const activeMovie = FEATURED_MOVIES[activeIndex];

  // Auto-avance de tráileres
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % FEATURED_MOVIES.length);
    }, AUTO_SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [isPaused, activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % FEATURED_MOVIES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + FEATURED_MOVIES.length) % FEATURED_MOVIES.length);
  };

  const handleBuyWhatsApp = () => {
    const url = `https://wa.me/573214465418?text=${encodeURIComponent(activeMovie.whatsappMessage)}`;
    window.open(url, '_blank');
  };

  const handleAddToCart = () => {
    addItemToCart({
      cartItemId: `${activeMovie.productId}-${Date.now()}`,
      id: activeMovie.productId,
      name: `${activeMovie.brand} (${activeMovie.movieTitle})`,
      price: activeMovie.price,
      image: activeMovie.icon,
      quantity: 1,
    });

    eventBus.emit('NOTIFICATION:SHOW', {
      message: `¡${activeMovie.brand} (${activeMovie.movieTitle}) se añadió a tu carrito!`,
      type: 'cart',
      title: '¡Añadido al Carrito!',
      price: activeMovie.price,
      iconName: activeMovie.icon,
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-4 sm:my-6 px-2 sm:px-4">
      {/* Marco Cinemático Grande Widescreen de 100% Ancho sin Paneles Laterales */}
      <div 
        className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-900/[0.08] shadow-[0_20px_50px_-10px_rgba(15,23,42,0.18)] aspect-[16/9] sm:aspect-[21/9] min-h-[340px] sm:min-h-[460px] group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        
        {/* Reproductor de Tráiler YouTube de 100% Ancho */}
        <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden pointer-events-none">
          <iframe
            key={activeMovie.id}
            src={`https://www.youtube.com/embed/${activeMovie.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${activeMovie.youtubeId}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`}
            title={activeMovie.movieTitle}
            className="w-full h-full object-cover scale-135 border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />

          {/* Sombra cinemática suave para máxima nitidez del contenido */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/60" />
        </div>

        {/* Flecha Anterior (Aparece al hacer Hover) */}
        <button
          onClick={handlePrev}
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-slate-950/60 backdrop-blur-md text-white/80 hover:text-white hover:bg-slate-900 transition border border-white/10 opacity-0 group-hover:opacity-100 shadow-lg"
          title="Tráiler anterior"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Flecha Siguiente (Aparece al hacer Hover) */}
        <button
          onClick={handleNext}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-slate-950/60 backdrop-blur-md text-white/80 hover:text-white hover:bg-slate-900 transition border border-white/10 opacity-0 group-hover:opacity-100 shadow-lg"
          title="Siguiente tráiler"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Encabezado Superior Limpio: Marca de la Plataforma & Mute Audio */}
        <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-slate-950/80 backdrop-blur-md text-white text-xs font-black px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
              <PlatformIcon icon={activeMovie.icon} name={activeMovie.brand} className="w-4 h-4" />
              {activeMovie.brand}
            </span>
            <span className="bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1 shadow-lg">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {activeMovie.rating}
            </span>
          </div>

          {/* Botón Mute / Unmute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-200 hover:text-white hover:bg-slate-900 transition border border-white/10 shadow-lg"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />}
          </button>
        </div>

        {/* Pie Inferior Cinemático Limpio: Título, Precio & Botón de WhatsApp Directo */}
        <div className="relative z-10 p-4 sm:p-7 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-lg">
              {activeMovie.movieTitle}
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm font-semibold drop-shadow-md">
              {activeMovie.tagline}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-lg">
              <span className="text-lg sm:text-2xl font-black text-emerald-400 block leading-none">
                {formatCOP(activeMovie.price)}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-extrabold block text-right">/ mes</span>
            </div>

            <Button variant="mint" size="md" onClick={handleBuyWhatsApp} className="shadow-xl">
              <span className="flex items-center justify-center gap-2 font-black text-xs sm:text-sm whitespace-nowrap">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
                Pedir por WhatsApp
              </span>
            </Button>

            <Button variant="secondary" size="md" onClick={handleAddToCart} className="bg-slate-900/90 hover:bg-slate-800 text-white border-white/20 px-3 shadow-xl">
              <ShoppingBag className="w-4 h-4 text-blue-400" />
            </Button>
          </div>
        </div>

        {/* Indicadores Limpios de Plataformas en la Parte Inferior Central */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {FEATURED_MOVIES.map((movie, idx) => (
            <button
              key={movie.id}
              onClick={() => setActiveIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex ? 'w-6 bg-blue-500' : 'bg-white/40 hover:bg-white/70'
              }`}
              title={movie.movieTitle}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
