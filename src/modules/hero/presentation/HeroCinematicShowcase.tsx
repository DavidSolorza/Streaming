import React, { useState, useEffect } from 'react';
import { PlatformIcon } from '@/shared/components/PlatformIcon';
import { MessageCircle, ShoppingBag, Sparkles, Volume2, VolumeX, Star, Flame, Play, Check } from 'lucide-react';
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
  category: string;
  tagline: string;
  description: string;
  price: number;
  regularPrice: number;
  productId: number;
  youtubeId: string;
  backdropUrl: string;
  whatsappMessage: string;
}

const FEATURED_MOVIES: FeaturedMovieItem[] = [
  {
    id: 'moana-2',
    movieTitle: 'Moana 2',
    brand: 'Disney+',
    icon: '/icons/icons8-disney-plus-windows-11-color/icons8-disney-plus-96.png',
    rating: 7.2,
    category: 'Disney+ Premium',
    tagline: 'Una nueva aventura épica en los océanos',
    description: 'Moana y Maui se reúnen para una nueva travesía junto a una tripulación de marineros insólitos en Disney+ Premium.',
    price: 16000,
    regularPrice: 26000,
    productId: 3,
    youtubeId: 'hDZ7y8RP5HE',
    backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop',
    whatsappMessage: '¡Hola! Vengo desde el Hero de la web y quiero solicitar *Disney+ Premium* para ver *Moana 2* por *$16.000 COP/mes*. ¿Me das los medios de pago?',
  },
  {
    id: 'house-dragon',
    movieTitle: 'La Casa del Dragón',
    brand: 'Max',
    icon: '/icons/icons8-hbo-max-ios-27-outlined/icons8-hbo-max-100.png',
    rating: 8.5,
    category: 'Max (HBO) Pro',
    tagline: 'Fuego y Sangre en máxima calidad 4K',
    description: 'La guerra civil de los Targaryen alcanza su clímax. Disfruta de la serie más aclamada de HBO en Max.',
    price: 15000,
    regularPrice: 25000,
    productId: 4,
    youtubeId: 'DotnJ7tTA34',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    whatsappMessage: '¡Hola! Vengo desde el Hero de la web y quiero adquirir *Max (HBO)* para ver *La Casa del Dragón* por *$15.000 COP/mes*. ¿Me indicas cómo pagar?',
  },
  {
    id: 'spiderman-spiderverse',
    movieTitle: 'Spider-Man: Un Nuevo Día',
    brand: 'Disney+',
    icon: '/icons/icons8-disney-plus-windows-11-color/icons8-disney-plus-96.png',
    rating: 7.9,
    category: 'Disney+ Marvel',
    tagline: 'El multiverso completo en Ultra HD',
    description: 'Toda la colección de Marvel Studios, películas animadas y acción en IMAX Enhanced exclusivamente en Disney+.',
    price: 16000,
    regularPrice: 26000,
    productId: 3,
    youtubeId: 'cqGjhVJWtEg',
    backdropUrl: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?q=80&w=1200&auto=format&fit=crop',
    whatsappMessage: '¡Hola! Me interesa la cuenta de *Disney+ Premium* por *$16.000 COP/mes*. ¿Me das los datos de pago?',
  },
  {
    id: 'the-boys',
    movieTitle: 'The Boys / Carrera contra el tiempo',
    brand: 'Prime Video',
    icon: '/icons/icons8-amazon-prime-video-color/icons8-amazon-prime-video-96.png',
    rating: 8.7,
    category: 'Prime Video Original',
    tagline: 'Acción sin censura y Amazon Originals',
    description: 'Suspenso, acción extrema y las mejores producciones galardonadas de Amazon Prime Video.',
    price: 14000,
    regularPrice: 24000,
    productId: 5,
    youtubeId: '06c1a_p-vO0',
    backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop',
    whatsappMessage: '¡Hola! Deseo adquirir *Prime Video* por *$14.000 COP/mes*. ¿Me envías la información de cuenta?',
  },
  {
    id: 'stranger-things',
    movieTitle: 'Stranger Things 5',
    brand: 'Netflix',
    icon: '/icons/icons8-netflix-desktop-app-windows-11-color/icons8-netflix-desktop-app-96.png',
    rating: 8.7,
    category: 'Netflix Original 4K',
    tagline: 'La temporada final en Ultra HD 4K',
    description: 'Hawkins se enfrenta al capítulo definitivo. Disfruta de Netflix Original con perfil privado y PIN personal.',
    price: 17000,
    regularPrice: 27000,
    productId: 2,
    youtubeId: 'b9EkMc79ZSU',
    backdropUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1200&auto=format&fit=crop',
    whatsappMessage: '¡Hola! Vengo desde el Hero de la web y quiero contratar *Netflix Original 4K UHD* por *$17.000 COP/mes*. ¿Tienen entrega inmediata?',
  },
  {
    id: 'demon-slayer',
    movieTitle: 'Demon Slayer: Castillo Infinito',
    brand: 'Crunchyroll',
    icon: '/icons/icons8-crunchyroll-windows-11-color/icons8-crunchyroll-96.png',
    rating: 8.9,
    category: 'Crunchyroll Mega Fan',
    tagline: 'Simulcast Anime directo de Japón',
    description: 'La batalla final contra Muzan Kibutsuji sin anuncios, en calidad HD y con opción de descarga offline.',
    price: 12000,
    regularPrice: 22000,
    productId: 7,
    youtubeId: 'WY682855T20',
    backdropUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop',
    whatsappMessage: '¡Hola! Quiero contratar *Crunchyroll Mega Fan* por *$12.000 COP/mes*. ¿Me envías los datos?',
  }
];

const AUTO_SLIDE_DURATION = 7000; // 7 segundos por película

export const HeroCinematicShowcase: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const addItemToCart = useCartStore((state) => state.addItem);

  const activeMovie = FEATURED_MOVIES[activeIndex];

  // Timer para la barra de progreso tipo Stories (0 a 100%)
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50;
    const step = (intervalTime / AUTO_SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((current) => (current + 1) % FEATURED_MOVIES.length);
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
    <div className="w-full max-w-6xl mx-auto my-4 sm:my-6">
      {/* Contenedor Principal Blanco de Lujo (Blanco con Bordes Limpios & Sombras Suaves) */}
      <div 
        className="relative bg-white rounded-3xl overflow-hidden border border-slate-900/[0.08] shadow-[0_15px_35px_-5px_rgba(15,23,42,0.08)] p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        
        {/* PANEL IZQUIERDO: REPRODUCTOR DE TRÁILERS Y OVERLAY DE COMPRA (8 cols / 70% en PC) */}
        <div className="lg:col-span-8 relative bg-slate-900 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between aspect-[16/9] lg:aspect-auto min-h-[320px] sm:min-h-[460px]">
          
          {/* Tráiler de YouTube Embed de la Película Destacada */}
          <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden pointer-events-none">
            <iframe
              key={activeMovie.id}
              src={`https://www.youtube.com/embed/${activeMovie.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${activeMovie.youtubeId}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`}
              title={activeMovie.movieTitle}
              className="w-full h-full object-cover scale-135 border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />

            {/* Degradado para legibilidad del texto cinemático */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent hidden sm:block" />
          </div>

          {/* Top Bar Overlay: Badges y Mute Audio */}
          <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider bg-blue-600 text-white shadow-md flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-current text-amber-300" />
                Estreno Destacado
              </span>
              <span className="bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1 shadow-md">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {activeMovie.rating}
              </span>
            </div>

            {/* Botón Mute / Unmute */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-200 hover:text-white hover:bg-slate-800 transition border border-slate-700/60 shadow-md"
              title={isMuted ? 'Activar sonido del tráiler' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />}
            </button>
          </div>

          {/* Bottom Bar Overlay: Información de la Película y Botón de WhatsApp */}
          <div className="relative z-10 p-4 sm:p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-900/90 border border-slate-700/80 p-2 flex items-center justify-center shadow-xl backdrop-blur-md shrink-0">
                <PlatformIcon icon={activeMovie.icon} name={activeMovie.brand} className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block">{activeMovie.brand} • {activeMovie.category}</span>
                <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                  {activeMovie.movieTitle}
                </h2>
              </div>
            </div>

            <p className="text-slate-200 text-xs sm:text-sm font-medium line-clamp-2 max-w-xl text-shadow-sm">
              {activeMovie.description}
            </p>

            {/* Barra de Precios & CTA WhatsApp Contextual */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-baseline gap-2 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/60 shadow-md">
                <span className="text-xl sm:text-2xl font-black text-emerald-400">
                  {formatCOP(activeMovie.price)}
                </span>
                <span className="text-xs text-slate-400 line-through font-semibold">
                  {formatCOP(activeMovie.regularPrice)}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-extrabold ml-1">/ mes</span>
              </div>

              <div className="flex items-center gap-2 grow sm:grow-0">
                <Button variant="mint" size="md" onClick={handleBuyWhatsApp} className="shadow-emerald-950/50 grow sm:grow-0">
                  <span className="flex items-center justify-center gap-2 font-black text-xs sm:text-sm">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
                    Solicitar esta Cuenta por WhatsApp
                  </span>
                </Button>

                <Button variant="secondary" size="md" onClick={handleAddToCart} className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700 px-3">
                  <ShoppingBag className="w-4 h-4 text-blue-400" />
                </Button>
              </div>
            </div>
          </div>

        </div>

        {/* PANEL DERECHO: LISTA LIMPIA Y BLANCA DE PELÍCULAS DESTACADAS (4 cols / 30% en PC) */}
        <div className="lg:col-span-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 p-3 sm:p-4 flex flex-col justify-between overflow-hidden">
          
          <div className="space-y-1 mb-2 hidden lg:block px-1">
            <span className="text-xs font-black uppercase tracking-widest text-blue-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Tráilers de Películas Destacadas
            </span>
          </div>

          {/* Tira de Películas: Vertical en PC / Horizontal Deslizable en Celulares */}
          <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
            {FEATURED_MOVIES.map((movie, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={movie.id}
                  onClick={() => handleSelectTab(index)}
                  onMouseEnter={() => handleSelectTab(index)}
                  className={`relative p-3 rounded-xl transition-all duration-300 cursor-pointer text-left border shrink-0 w-[240px] sm:w-[280px] lg:w-full group overflow-hidden ${
                    isActive
                      ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white/60 border-slate-200/80 text-slate-700 hover:bg-white hover:border-slate-300 shadow-xs'
                  }`}
                >
                  {/* Barra de Progreso Tipo "Stories" para la película activa */}
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-75 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center p-1.5 border shrink-0 transition-transform ${
                        isActive ? 'bg-blue-50 border-blue-300 scale-105' : 'bg-slate-100 border-slate-200'
                      }`}>
                        <PlatformIcon icon={movie.icon} name={movie.brand} className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <h4 className={`text-xs sm:text-sm font-extrabold truncate ${isActive ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
                          {movie.movieTitle}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-semibold block truncate">
                          {movie.brand} • ★ {movie.rating}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-black block ${isActive ? 'text-blue-700' : 'text-slate-600'}`}>
                        {formatCOP(movie.price)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Informativo del Panel Derecho */}
          <div className="mt-3 pt-3 border-t border-slate-200/80 hidden lg:flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
            <span>Pasa el mouse para reproducir tráiler</span>
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              Garantía Total <Check className="w-3.5 h-3.5" />
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
