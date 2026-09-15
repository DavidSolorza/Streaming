import React, { useState, useEffect, useRef } from 'react';
import { PlatformIcon } from '@/shared/components/PlatformIcon';
import { PosterImage } from '@/modules/catalog/presentation/components/PosterImage';
import { MessageCircle, ShoppingBag, Volume2, VolumeX, Star, ChevronLeft, ChevronRight, Film } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { eventBus } from '@/core/bus/eventBus';
import { formatCOP } from '@/core/utils/currency';
import { ENV } from '@/core/config/env';

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
  backdropUrl?: string;
  whatsappMessage: string;
}

// Lista base inicial verificada para carga instantánea sin congelamientos
const DEFAULT_FEATURED_MOVIES: FeaturedMovieItem[] = [
  {
    id: 'moana-2',
    movieTitle: 'Moana 2',
    brand: 'Disney+',
    icon: '/icons/icons8-disney-plus-windows-11-color/icons8-disney-plus-96.png',
    rating: 7.0,
    tagline: 'Estreno HD • Disney+ Premium',
    description: 'Después de recibir una llamada inesperada de sus antepasados navegantes, Moana viajará a los lejanos mares de Oceanía en Disney+ Premium.',
    price: 16000,
    regularPrice: 26000,
    productId: 3,
    youtubeId: 'ZSlSfhHCc78',
    posterUrl: 'https://image.tmdb.org/t/p/w500/mLAGAFUrRw9pphjnbnhtG1hASSN.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/tE12181Gvy7B139707v7v.jpg',
    whatsappMessage: '¡Hola! Vengo desde la web y quiero contratar *Disney+ Premium* para ver *Moana 2* por *$16.000 COP/mes*. ¿Me das los datos de pago?',
  },
  {
    id: 'house-dragon',
    movieTitle: 'La Casa del Dragón',
    brand: 'Max',
    icon: '/icons/icons8-hbo-max-ios-27-outlined/icons8-hbo-max-100.png',
    rating: 8.4,
    tagline: 'Serie Original 4K • Max',
    description: 'La sangrienta guerra civil de la Casa Targaryen alcanza su clímax por el Trono de Hierro. Disponible en calidad Ultra HD en Max.',
    price: 15000,
    regularPrice: 25000,
    productId: 4,
    youtubeId: '339paLFRKlo',
    posterUrl: 'https://image.tmdb.org/t/p/w500/szyVpg9K3LL5s8VFAGkXzlxgZUk.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/etj8E2o0x2z23708940.jpg',
    whatsappMessage: '¡Hola! Vengo desde la web y quiero contratar *Max (HBO)* para ver *La Casa del Dragón* por *$15.000 COP/mes*. ¿Me indicas cómo pagar?',
  },
  {
    id: 'spiderman-spiderverse',
    movieTitle: 'Spider-Man: A través del Spider-Verso',
    brand: 'Disney+',
    icon: '/icons/icons8-disney-plus-windows-11-color/icons8-disney-plus-96.png',
    rating: 8.3,
    tagline: 'Estreno HD • IMAX Enhanced',
    description: 'Miles Morales es catapultado a través del Multiverso en una aventura espectacular en IMAX Enhanced exclusivamente en Disney+.',
    price: 16000,
    regularPrice: 26000,
    productId: 3,
    youtubeId: 'E4noegsHPvM',
    posterUrl: 'https://image.tmdb.org/t/p/w500/rXhgHQmtjTIQOEDU8E2TbUFMjWM.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/4H2239402.jpg',
    whatsappMessage: '¡Hola! Me interesa la cuenta de *Disney+ Premium* por *$16.000 COP/mes*. ¿Me das los datos de pago?',
  },
  {
    id: 'the-boys',
    movieTitle: 'The Boys',
    brand: 'Prime Video',
    icon: '/icons/icons8-amazon-prime-video-color/icons8-amazon-prime-video-96.png',
    rating: 8.4,
    tagline: 'Amazon Original • Ultra HD',
    description: 'Un grupo de vigilantes decide hacer todo lo posible por frenar a los superhéroes corruptos. Serie original de Amazon Prime Video.',
    price: 14000,
    regularPrice: 24000,
    productId: 5,
    youtubeId: 'eshJeoaDmtY',
    posterUrl: 'https://image.tmdb.org/t/p/w500/lTb6v3ZRanWLWoOpofXrBHNo9s1.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/m9o0349.jpg',
    whatsappMessage: '¡Hola! Deseo adquirir *Prime Video* por *$14.000 COP/mes*. ¿Me envías la información de cuenta?',
  },
  {
    id: 'stranger-things',
    movieTitle: 'Stranger Things',
    brand: 'Netflix',
    icon: '/icons/icons8-netflix-desktop-app-windows-11-color/icons8-netflix-desktop-app-96.png',
    rating: 8.6,
    tagline: 'Netflix Original • 4K UHD',
    description: 'Experimentos secretos, fuerzas sobrenaturales y la batalla final en Hawkins. Serie original de Netflix en Ultra HD 4K.',
    price: 17000,
    regularPrice: 27000,
    productId: 2,
    youtubeId: 'mnd7sFt5c3A',
    posterUrl: 'https://image.tmdb.org/t/p/w500/AsPD90QEQsIAtSxfSjV3fN7XFpt.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/560934.jpg',
    whatsappMessage: '¡Hola! Vengo desde la web y quiero contratar *Netflix Original 4K UHD* por *$17.000 COP/mes*. ¿Tienen entrega inmediata?',
  },
  {
    id: 'demon-slayer',
    movieTitle: 'Demon Slayer: Castillo Infinito',
    brand: 'Crunchyroll',
    icon: '/icons/icons8-crunchyroll-windows-11-color/icons8-crunchyroll-96.png',
    rating: 8.8,
    tagline: 'Simulcast Anime • Crunchyroll',
    description: 'La épica confrontación final contra las Lunas Superiores y Muzan Kibutsuji dentro del Castillo Infinito. Sin anuncios en Crunchyroll.',
    price: 12000,
    regularPrice: 22000,
    productId: 7,
    youtubeId: 'sqgSm8fWe1s',
    posterUrl: 'https://image.tmdb.org/t/p/w500/6N21gcFbhT4ocdTU4MGREAaM5Vz.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/4090234.jpg',
    whatsappMessage: '¡Hola! Quiero contratar *Crunchyroll Mega Fan* por *$12.000 COP/mes*. ¿Me envías los datos?',
  }
];

// Catálogo de plataformas de la tienda para vincular marcas, precios y pedidos
const CATALOG_PLATFORMS = [
  {
    brand: 'Netflix',
    icon: '/icons/icons8-netflix-desktop-app-windows-11-color/icons8-netflix-desktop-app-96.png',
    price: 17000,
    regularPrice: 27000,
    productId: 2,
  },
  {
    brand: 'Disney+',
    icon: '/icons/icons8-disney-plus-windows-11-color/icons8-disney-plus-96.png',
    price: 16000,
    regularPrice: 26000,
    productId: 3,
  },
  {
    brand: 'Max',
    icon: '/icons/icons8-hbo-max-ios-27-outlined/icons8-hbo-max-100.png',
    price: 15000,
    regularPrice: 25000,
    productId: 4,
  },
  {
    brand: 'Prime Video',
    icon: '/icons/icons8-amazon-prime-video-color/icons8-amazon-prime-video-96.png',
    price: 14000,
    regularPrice: 24000,
    productId: 5,
  },
  {
    brand: 'Crunchyroll',
    icon: '/icons/icons8-crunchyroll-windows-11-color/icons8-crunchyroll-96.png',
    price: 12000,
    regularPrice: 22000,
    productId: 7,
  },
];

const assignPlatformForMovie = (title: string, overview: string, index: number) => {
  const text = (title + ' ' + overview).toLowerCase();
  if (text.includes('anime') || text.includes('slayer') || text.includes('dragon ball') || text.includes('naruto') || text.includes('piece')) {
    return CATALOG_PLATFORMS[4]; // Crunchyroll
  }
  if (text.includes('disney') || text.includes('marvel') || text.includes('star wars') || text.includes('pixar') || text.includes('moana') || text.includes('avatar')) {
    return CATALOG_PLATFORMS[1]; // Disney+
  }
  if (text.includes('hbo') || text.includes('dragon') || text.includes('batman') || text.includes('superman') || text.includes('dc ') || text.includes('warner')) {
    return CATALOG_PLATFORMS[2]; // Max
  }
  if (text.includes('amazon') || text.includes('prime') || text.includes('boys') || text.includes('rings')) {
    return CATALOG_PLATFORMS[3]; // Prime Video
  }
  if (text.includes('netflix') || text.includes('stranger')) {
    return CATALOG_PLATFORMS[0]; // Netflix
  }
  return CATALOG_PLATFORMS[index % CATALOG_PLATFORMS.length];
};

const AUTO_SLIDE_DURATION = 30000;

export const HeroCinematicShowcase: React.FC = () => {
  const [movies, setMovies] = useState<FeaturedMovieItem[]>(DEFAULT_FEATURED_MOVIES);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fallbackVideoRef = useRef<HTMLVideoElement>(null);
  const addItemToCart = useCartStore((state) => state.addItem);

  const activeMovie = movies[activeIndex] || movies[0];

  // Resetear estado de error al cambiar de película activa
  useEffect(() => {
    setHasVideoError(false);
  }, [activeIndex]);

  // Sincronizar pausa/reproducción del video MP4 de respaldo al pasar el cursor
  useEffect(() => {
    if (fallbackVideoRef.current) {
      if (isPaused) {
        fallbackVideoRef.current.pause();
      } else {
        fallbackVideoRef.current.play().catch(() => {});
      }
    }
  }, [isPaused]);

  // Función robusta para sincronizar el estado del volumen (mute / unMute + setVolume 100) con YouTube API y el Video MP4
  const applyVolumeState = () => {
    if (fallbackVideoRef.current) {
      fallbackVideoRef.current.muted = isMuted;
      if (!isMuted) {
        fallbackVideoRef.current.volume = 1.0;
      }
    }

    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    try {
      if (isMuted) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'mute', args: [] }),
          '*'
        );
      } else {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'unMute', args: [] }),
          '*'
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }),
          '*'
        );
      }
    } catch (e) {
      // Ignorar si la ventana del iframe aún no está lista
    }
  };

  // Enviar comandos al cambiar de película o estado de volumen con reintentos para dar tiempo a la API de YouTube
  useEffect(() => {
    applyVolumeState();

    const t1 = setTimeout(applyVolumeState, 300);
    const t2 = setTimeout(applyVolumeState, 800);
    const t3 = setTimeout(applyVolumeState, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [activeIndex, isMuted]);

  const handleIframeLoad = () => {
    applyVolumeState();
    setTimeout(applyVolumeState, 400);
    setTimeout(applyVolumeState, 1000);
  };

  // Cargar películas en tendencia y estrenos en vivo desde TMDB API en segundo plano sin congelar la UI
  useEffect(() => {
    let isMounted = true;

    const fetchLiveTmdbTrailers = async () => {
      const tmdbKey = ENV.TMDB_API_KEY;
      const youtubeKey = ENV.YOUTUBE_API_KEY;

      if (!tmdbKey) return;

      try {
        const [trendingRes, nowPlayingRes] = await Promise.allSettled([
          fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdbKey}&language=es-MX`),
          fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${tmdbKey}&language=es-MX`),
        ]);

        let rawResults: any[] = [];

        if (trendingRes.status === 'fulfilled' && trendingRes.value.ok) {
          const data = await trendingRes.value.json();
          if (Array.isArray(data.results)) rawResults.push(...data.results);
        }

        if (nowPlayingRes.status === 'fulfilled' && nowPlayingRes.value.ok) {
          const data = await nowPlayingRes.value.json();
          if (Array.isArray(data.results)) rawResults.push(...data.results);
        }

        // Desduplicar películas por id de TMDB y seleccionar las 10 mejores
        const uniqueTmdbItems = Array.from(
          new Map(rawResults.map((item) => [item.id, item])).values()
        ).slice(0, 10);

        if (uniqueTmdbItems.length > 0) {
          const processedMovies = await Promise.all(
            uniqueTmdbItems.map(async (tmdbResult: any, idx: number) => {
              try {
                const mediaType = tmdbResult.media_type === 'tv' ? 'tv' : 'movie';
                let trailerKey = '';

                // Buscar tráiler oficial traducido a español latino
                try {
                  let videoRes = await fetch(
                    `https://api.themoviedb.org/3/${mediaType}/${tmdbResult.id}/videos?api_key=${tmdbKey}&language=es-MX`
                  );
                  if (videoRes.ok) {
                    let videoData = await videoRes.json();
                    if (!videoData.results || videoData.results.length === 0) {
                      videoRes = await fetch(
                        `https://api.themoviedb.org/3/${mediaType}/${tmdbResult.id}/videos?api_key=${tmdbKey}`
                      );
                      if (videoRes.ok) {
                        videoData = await videoRes.json();
                      }
                    }
                    if (Array.isArray(videoData.results) && videoData.results.length > 0) {
                      const found =
                        videoData.results.find(
                          (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
                        ) || videoData.results[0];
                      if (found && found.key) {
                        trailerKey = found.key;
                      }
                    }
                  }
                } catch (vErr) {}

                const movieTitle = tmdbResult.title || tmdbResult.name || 'Estreno en Tendencia';

                // Respaldo con YouTube Data API v3 si TMDB no entregó la clave del tráiler
                if (!trailerKey && youtubeKey) {
                  try {
                    const query = encodeURIComponent(`${movieTitle} trailer oficial espanol latino`);
                    const ytRes = await fetch(
                      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&videoEmbeddable=true&maxResults=1&key=${youtubeKey}`
                    );
                    if (ytRes.ok) {
                      const ytData = await ytRes.json();
                      if (ytData.items && ytData.items.length > 0 && ytData.items[0].id?.videoId) {
                        trailerKey = ytData.items[0].id.videoId;
                      }
                    }
                  } catch (e) {}
                }

                const platform = assignPlatformForMovie(movieTitle, tmdbResult.overview || '', idx);
                const priceFormatted = formatCOP(platform.price);

                const rawDate = tmdbResult.release_date || tmdbResult.first_air_date;
                const releaseYear = rawDate ? new Date(rawDate).getFullYear() : null;
                const tagline =
                  releaseYear && !isNaN(releaseYear)
                    ? `Estreno HD • TMDB (${releaseYear})`
                    : '🔥 Estreno en Tendencia';

                return {
                  id: `tmdb-live-${tmdbResult.id}`,
                  movieTitle,
                  brand: platform.brand,
                  icon: platform.icon,
                  rating: tmdbResult.vote_average ? Number(tmdbResult.vote_average.toFixed(1)) : 8.5,
                  tagline,
                  description: tmdbResult.overview || 'Sinopsis oficial obtenida en tiempo real desde TMDB API.',
                  price: platform.price,
                  regularPrice: platform.regularPrice,
                  productId: platform.productId,
                  youtubeId: trailerKey,
                  posterUrl: tmdbResult.poster_path
                    ? `https://image.tmdb.org/t/p/w500${tmdbResult.poster_path}`
                    : 'https://image.tmdb.org/t/p/w500/mLAGAFUrRw9pphjnbnhtG1hASSN.jpg',
                  backdropUrl: tmdbResult.backdrop_path
                    ? `https://image.tmdb.org/t/p/w1280${tmdbResult.backdrop_path}`
                    : undefined,
                  whatsappMessage: `¡Hola! Vengo desde la web y quiero solicitar *${platform.brand}* para ver la película *${movieTitle}* por *${priceFormatted}/mes*. ¿Me indicas el medio de pago?`,
                } as FeaturedMovieItem;
              } catch (itemErr) {
                return null;
              }
            })
          );

          const validMovies = processedMovies.filter((m): m is FeaturedMovieItem => m !== null);
          if (isMounted && validMovies.length > 0) {
            setMovies(validMovies);
          }
        }
      } catch (error) {
        console.error('Error cargando TMDB en vivo:', error);
      }
    };

    fetchLiveTmdbTrailers();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-avance de tráileres (30 segundos por película)
  useEffect(() => {
    if (isPaused || movies.length === 0) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % movies.length);
    }, AUTO_SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [isPaused, movies.length]);

  const handleNext = () => {
    if (movies.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % movies.length);
  };

  const handlePrev = () => {
    if (movies.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (iframeRef.current && iframeRef.current.contentWindow) {
      const command = nextMuted ? 'mute' : 'unMute';
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
    }
  };

  const handleBuyWhatsApp = () => {
    if (!activeMovie) return;
    const url = `https://wa.me/573214465418?text=${encodeURIComponent(activeMovie.whatsappMessage)}`;
    window.open(url, '_blank');
  };

  const handleAddToCart = () => {
    if (!activeMovie) return;
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

  if (!activeMovie) return null;

  return (
    <div className="w-full max-w-7xl mx-auto my-3 sm:my-5 px-2 sm:px-4">
      {/* Contenedor Principal Blanco Limpio */}
      <div className="bg-white rounded-3xl border border-slate-900/[0.08] shadow-[0_15px_35px_-5px_rgba(15,23,42,0.08)] overflow-hidden p-2.5 sm:p-4 space-y-3">
        
        {/* 1. REPRODUCTOR DE TRÁILERS 100% LIMPIO (Recorte cinemático y control de fallos con poster HD) */}
        <div 
          className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[16/9] sm:aspect-[21/9] min-h-[260px] sm:min-h-[380px] group shadow-inner"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Fallback Cinemático en Video MP4 cuando el Tráiler no esté disponible o sea bloqueado */}
          {hasVideoError || !activeMovie.youtubeId ? (
            <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden pointer-events-none select-none">
              <video
                ref={fallbackVideoRef}
                key={`fallback-${activeMovie.id}`}
                src="/videos/streaming-intro.mp4"
                autoPlay
                loop
                playsInline
                muted={isMuted}
                className="w-full h-full object-cover scale-[1.02] border-0 pointer-events-none"
              />
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-950/60 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
            </div>
          ) : (
            <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden pointer-events-none select-none">
              <iframe
                ref={iframeRef}
                key={activeMovie.id}
                src={`https://www.youtube.com/embed/${activeMovie.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&autohide=1&loop=1&playlist=${activeMovie.youtubeId}&playsinline=1&enablejsapi=1`}
                title={activeMovie.movieTitle}
                onLoad={handleIframeLoad}
                onError={() => setHasVideoError(true)}
                className="w-full h-full object-cover scale-[1.45] -translate-y-1 border-0 pointer-events-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />

              {/* Sombras suaves en los bordes para un acabado cine pro */}
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-950/60 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
            </div>
          )}

          {/* Escudo transparente protector para garantizar que 0 eventos de ratón/touch lleguen a YouTube */}
          <div className="absolute inset-0 z-10 bg-transparent pointer-events-auto select-none" />

          {/* Flecha Anterior (Hover) */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-950/70 backdrop-blur-md text-white/80 hover:text-white hover:bg-slate-900 transition border border-white/10 opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer"
            title="Tráiler anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Flecha Siguiente (Hover) */}
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-950/70 backdrop-blur-md text-white/80 hover:text-white hover:bg-slate-900 transition border border-white/10 opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer"
            title="Siguiente tráiler"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Controles Superiores Flotantes (Plataforma, Rating y Mute) */}
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

        {/* 2. PANEL BLANCO AMPLIADO CON PORTADA DE PELÍCULA TMDB Y SINOPSIS OFICIAL */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 shadow-xs">
          
          {/* Izquierda: Portada Grande + Título + Plataforma + Descripción */}
          <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
            {/* Portada Destacada */}
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
