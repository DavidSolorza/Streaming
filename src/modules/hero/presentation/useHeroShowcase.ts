import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { eventBus } from '@/core/bus/eventBus';
import { HeroMovieRepository } from '../infrastructure/heroMovieRepository';
import { useCustomerProfile } from '@/modules/customer/application/useCustomerProfile';
import { FeaturedMovieItem, DEFAULT_MOVIES } from '../domain/entities/FeaturedMovieItem';

export type { FeaturedMovieItem };

export function useHeroShowcase() {
  const [movies, setMovies] = useState<FeaturedMovieItem[]>(() => HeroMovieRepository.getCachedMovies() || DEFAULT_MOVIES);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fallbackVideoRef = useRef<HTMLVideoElement>(null);
  const addItemToCart = useCartStore((state) => state.addItem);

  const activeMovie = movies[activeIndex] || movies[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      HeroMovieRepository.fetchLiveMovies().then((live) => {
        if (live && live.length > 0) setMovies(live);
      });
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => { setHasVideoError(false); }, [activeIndex]);

  useEffect(() => {
    if (isPaused || movies.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % movies.length);
    }, 60000);
    return () => clearInterval(timer);
  }, [isPaused, movies.length]);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % movies.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + movies.length) % movies.length);
  const toggleMute = () => setIsMuted((prev) => !prev);

  const handleBuyWhatsApp = () => {
    if (!activeMovie) return;
    useCustomerProfile.getState().requireName(
      (customerName) => {
        let prefix = '';
        if (customerName && customerName.trim()) {
          prefix = `¡Hola equipo JP! Mi nombre es *${customerName.trim()}*, un gusto saludarlos.\n\n`;
        }
        const fullMessage = prefix + activeMovie.whatsappMessage;
        window.open(`https://wa.me/573214465418?text=${encodeURIComponent(fullMessage)}`, '_blank');
      },
      '¿Cómo te llamas?',
      `Queremos saludarte por tu nombre al consultar por ${activeMovie.movieTitle}.`
    );
  };

  const handleAddToCart = () => {
    if (!activeMovie || !activeMovie.productId || !activeMovie.price) return;
    addItemToCart({
      cartItemId: `${activeMovie.productId}-${Date.now()}`,
      id: activeMovie.productId,
      name: `${activeMovie.brand || 'Streaming'} (${activeMovie.movieTitle})`,
      price: activeMovie.price,
      image: activeMovie.icon || '/icons/icons8-tv-color/icons8-tv-96.png',
      quantity: 1,
    });
    eventBus.emit('NOTIFICATION:SHOW', {
      message: `¡${activeMovie.brand || 'Servicio'} (${activeMovie.movieTitle}) se añadió a tu carrito!`,
      type: 'cart',
      title: '¡Añadido al Carrito!',
      price: activeMovie.price,
      iconName: activeMovie.icon || '',
    });
  };

  return {
    activeMovie, activeIndex, isMuted, isPaused, setIsPaused, hasVideoError, setHasVideoError,
    iframeRef, fallbackVideoRef, handleNext, handlePrev, toggleMute, handleBuyWhatsApp, handleAddToCart
  };
}
