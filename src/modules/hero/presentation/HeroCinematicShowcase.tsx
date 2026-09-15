import React, { useState, useEffect, useRef } from 'react';
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
  description: string;
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
    description: 'Moana y Maui se reúnen para una nueva travesía junto a una tripulación de marineros insólitos a través de las aguas de Oceanía en Disney+ Premium.',
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
    description: 'La sangrienta guerra civil entre los Verdes y los Negros por el Trono de Hierro alcanza su punto máximo. Disponible en calidad 4K en Max.',
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
    description: 'El multiverso arácnido completo, acción sin límites y animación espectacular en IMAX Enhanced exclusivamente en Disney+.',
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
    description: 'Suspenso, héroes fuera de control y las mejores producciones de acción y drama original en Amazon Prime Video.',
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
    description: 'Hawkins enfrenta la batalla final contra el Upside Down en la temporada más esperada de Netflix Original con audio espacial 4K.',
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
    description: 'La épica confrontación final contra las Lunas Superiores y Muzan Kibutsuji sin interrupciones ni anuncios en Crunchyroll.',
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
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

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    // Mandar mensaje postMessage a YouTube JS API para silenciar/activar sonido SIN reiniciar el video
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const command = nextMuted ? 'mute' : 'unMute';
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
    }
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
      <div className="bg-white rounded-3xl border border-slate-900/[0.08] shadow-[0_15px_35px_-5px_rgba(15,23,42,0.08)] overflow-hidden p-2.5 sm:p-4 space-y-3">
        
        {/* 1. REPRODUCTOR DE TRÁILERS 100% LIMPIO (Con recorte cinemático y sin controles ni títulos de YouTube) */}
        <div 
          className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[16/9] sm:aspect-[21/9] min-h-[260px] sm:min-h-[380px] group shadow-inner"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Tráiler Embed YouTube */}
          <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden pointer-events-none select-none">
            <iframe
              ref={iframeRef}
              key={activeMovie.id}
              src={`https://www.youtube.com/embed/${activeMovie.youtubeId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&autohide=1&loop=1&playlist=${activeMovie.youtubeId}&playsinline=1&enablejsapi=1`}
              title={activeMovie.movieTitle}
              className="w-full h-full object-cover scale-[1.45] -translate-y-1 border-0 pointer-events-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />

            {/* Sombras suaves en los bordes para un acabado cine pro */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-950/60 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
          </div>

          {/* Flecha Anterior (Hover) */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-950/70 backdrop-blur-md text-white/80 hover:text-white hover:bg-slate-900 transition border border-white/10 opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer"
            title="Tráiler anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Flecha Siguiente (Hover) */}
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-950/70 backdrop-blur-md text-white/80 hover:text-white hover:bg-slate-900 transition border border-white/10 opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer"
            title="Siguiente tráiler"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Controles Superiores Flotantes (Plataforma, Rating y Mute) */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-auto">
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

            {/* Botón Silenciar / Sonido SIN reiniciar el video */}
            <button
              onClick={toggleMute}
              className="p-2.5 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-200 hover:text-white transition border border-white/10 shadow-md cursor-pointer"
              title={isMuted ? 'Activar sonido del tráiler' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-300" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* 2. PANEL BLANCO AMPLIADO CON PORTADA DE PELÍCULA GRANDE Y SINOPSIS COMPLETA */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 shadow-xs">
          
          {/* Izquierda: Portada Grande + Título + Plataforma + Descripción */}
          <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
            {/* Portada Destacada de Mayor Tamaño */}
            <div className="w-20 h-28 sm:w-24 sm:h-36 rounded-2xl overflow-hidden border border-slate-200/90 shadow-md shrink-0 relative bg-slate-100 group transition-transform hover:scale-105 duration-300">
              <PosterImage
                src={activeMovie.posterUrl}
                alt={activeMovie.movieTitle}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="min-w-0 space-y-1.5 flex-1 pr-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  {activeMovie.movieTitle}
                </h3>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100/80 shrink-0">
                  <PlatformIcon icon={activeMovie.icon} name={activeMovie.brand} className="w-4 h-4" />
                  {activeMovie.brand}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  {activeMovie.rating}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-extrabold text-blue-600/90">
                {activeMovie.tagline}
              </p>

              <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2 sm:line-clamp-3">
                {activeMovie.description}
              </p>
            </div>
          </div>

          {/* Derecha: Precios e Invocación WhatsApp */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            
            {/* Precio */}
            <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/90 text-left lg:text-right">
              <span className="text-xl sm:text-2xl font-black text-emerald-600 block leading-none">
                {formatCOP(activeMovie.price)}
              </span>
              <span className="text-[10px] text-slate-400 font-extrabold block uppercase mt-0.5">/ mes</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Botón WhatsApp */}
              <Button variant="mint" size="md" onClick={handleBuyWhatsApp} className="shadow-xs">
                <span className="flex items-center justify-center gap-2 font-black text-xs sm:text-sm whitespace-nowrap px-1">
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
    </div>
  );
};
