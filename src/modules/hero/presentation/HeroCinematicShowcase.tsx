import React, { useState, useEffect } from 'react';
import { PlatformIcon } from '@/shared/components/PlatformIcon';
import { PosterImage } from '@/modules/catalog/presentation/components/PosterImage';
import { MessageCircle, ShoppingBag, Volume2, VolumeX, Star, ChevronLeft, ChevronRight } from 'lucide-react';
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
  posterUrl: string;
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
    posterUrl: 'https://image.tmdb.org/t/p/w500/a2av1WqRi5PFiV21yY3bWy2F7v7.jpg',
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
    posterUrl: 'https://image.tmdb.org/t/p/w500/7E24viD235vC6Eshv2uC4h3p56.jpg',
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
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
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
    posterUrl: 'https://image.tmdb.org/t/p/w500/775D48khP0d4qV1vD54593p6y.jpg',
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
    posterUrl: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn88qbuYh9C.jpg',
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
    posterUrl: 'https://image.tmdb.org/t/p/w500/xUfVCoCn2y9jI2q6mG4bN6.jpg',
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
    <div className="w-full max-w-5xl mx-auto my-3 sm:my-5 px-2 sm:px-4">
      {/* Contenedor Principal Blanco Limpio */}
      <div className="bg-white rounded-3xl border border-slate-900/[0.08] shadow-[0_15px_35px_-5px_rgba(15,23,42,0.08)] overflow-hidden p-2 sm:p-3 space-y-3">
        
        {/* 1. REPRODUCTOR DE TRÁILERS 100% LIMPIO (Sin textos ni botones obstruyendo el video) */}
        <div 
          className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[16/9] sm:aspect-[21/9] min-h-[260px] sm:min-h-[380px] group shadow-inner"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Tráiler Embed YouTube */}
          <iframe
            key={activeMovie.id}
            src={`https://www.youtube.com/embed/${activeMovie.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${activeMovie.youtubeId}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`}
            title={activeMovie.movieTitle}
            className="w-full h-full object-cover scale-135 border-0 pointer-events-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />

          {/* Sombra sutil superior para botones flotantes */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-950/60 to-transparent pointer-events-none" />

          {/* Flecha Anterior (Hover) */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-950/70 backdrop-blur-md text-white/80 hover:text-white hover:bg-slate-900 transition border border-white/10 opacity-0 group-hover:opacity-100 shadow-lg"
            title="Tráiler anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Flecha Siguiente (Hover) */}
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-950/70 backdrop-blur-md text-white/80 hover:text-white hover:bg-slate-900 transition border border-white/10 opacity-0 group-hover:opacity-100 shadow-lg"
            title="Siguiente tráiler"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Controles Superiores Flotantes (Plataforma, Rating y Mute) */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
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

            {/* Botón Silenciar / Sonido */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-200 hover:text-white transition border border-white/10 shadow-md"
              title={isMuted ? 'Activar sonido del tráiler' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-300" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* 2. PANEL BLANCO DE INFORMACIÓN CON PORTADA DE LA PELÍCULA */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 shadow-xs">
          
          {/* Portada de la película + Título + Plataforma */}
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Poster de la Película en lugar del icono cuadrado de la plataforma */}
            <div className="w-14 h-20 sm:w-16 sm:h-22 rounded-xl overflow-hidden border border-slate-200 shadow-md shrink-0 relative bg-slate-100">
              <PosterImage
                src={activeMovie.posterUrl}
                alt={activeMovie.movieTitle}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight truncate">
                  {activeMovie.movieTitle}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
                  <PlatformIcon icon={activeMovie.icon} name={activeMovie.brand} className="w-3.5 h-3.5" />
                  {activeMovie.brand}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium line-clamp-1">
                {activeMovie.tagline}
              </p>
            </div>
          </div>

          {/* Precios e Invocación WhatsApp (Sin puntitos de selección) */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            
            {/* Precio */}
            <div className="bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/90 text-right">
              <span className="text-base sm:text-xl font-black text-emerald-600 block leading-none">
                {formatCOP(activeMovie.price)}
              </span>
              <span className="text-[9px] text-slate-400 font-bold block uppercase">/ mes</span>
            </div>

            {/* Botón WhatsApp */}
            <Button variant="mint" size="md" onClick={handleBuyWhatsApp} className="shadow-xs">
              <span className="flex items-center justify-center gap-2 font-black text-xs sm:text-sm whitespace-nowrap">
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                Pedir por WhatsApp
              </span>
            </Button>

            {/* Carrito */}
            <Button variant="secondary" size="md" onClick={handleAddToCart} className="bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 px-3">
              <ShoppingBag className="w-4 h-4 text-slate-700" />
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
};
