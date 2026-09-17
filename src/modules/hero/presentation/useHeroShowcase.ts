import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/modules/cart/application/useCartStore';
import { eventBus } from '@/core/bus/eventBus';

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

const DEFAULT_MOVIES: FeaturedMovieItem[] = [
  { id: 'moana-2', movieTitle: 'Moana 2', brand: 'Disney+', icon: '/icons/icons8-disney-plus-windows-11-color/icons8-disney-plus-96.png', rating: 7.0, tagline: 'Estreno HD • Disney+ Premium', description: 'Después de recibir una llamada inesperada de sus antepasados navegantes, Moana viajará a los lejanos mares de Oceanía en Disney+ Premium.', price: 16000, regularPrice: 26000, productId: 3, youtubeId: 'Bk1Hf0FtR7k', posterUrl: 'https://image.tmdb.org/t/p/w500/mLAGAFUrRw9pphjnbnhtG1hASSN.jpg', whatsappMessage: '¡Hola! Quiero contratar Disney+ Premium para Moana 2 por $16.000 COP/mes.' },
  { id: 'house-dragon', movieTitle: 'La Casa del Dragón', brand: 'Max', icon: '/icons/icons8-hbo-max-ios-27-outlined/icons8-hbo-max-100.png', rating: 8.4, tagline: 'Serie Original 4K • Max', description: 'La sangrienta guerra civil de la Casa Targaryen alcanza su clímax por el Trono de Hierro. Disponible en calidad Ultra HD en Max.', price: 15000, regularPrice: 25000, productId: 4, youtubeId: '339paLFRKlo', posterUrl: 'https://image.tmdb.org/t/p/w500/szyVpg9K3LL5s8VFAGkXzlxgZUk.jpg', whatsappMessage: '¡Hola! Quiero contratar Max (HBO) para ver La Casa del Dragón por $15.000 COP/mes.' },
  { id: 'stranger-things', movieTitle: 'Stranger Things', brand: 'Netflix', icon: '/icons/icons8-netflix-desktop-app-windows-11-color/icons8-netflix-desktop-app-96.png', rating: 8.6, tagline: 'Netflix Original • 4K UHD', description: 'Experimentos secretos, fuerzas sobrenaturales y la batalla final en Hawkins. Serie original de Netflix en Ultra HD 4K.', price: 17000, regularPrice: 27000, productId: 2, youtubeId: 'mnd7sFt5c3A', posterUrl: 'https://image.tmdb.org/t/p/w500/AsPD90QEQsIAtSxfSjV3fN7XFpt.jpg', whatsappMessage: '¡Hola! Quiero contratar Netflix Original 4K por $17.000 COP/mes.' }
];

export function useHeroShowcase() {
  const [movies] = useState<FeaturedMovieItem[]>(DEFAULT_MOVIES);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fallbackVideoRef = useRef<HTMLVideoElement>(null);
  const addItemToCart = useCartStore((state) => state.addItem);

  const activeMovie = movies[activeIndex] || movies[0];

  useEffect(() => { setHasVideoError(false); }, [activeIndex]);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % movies.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + movies.length) % movies.length);
  const toggleMute = () => setIsMuted((prev) => !prev);

  const handleBuyWhatsApp = () => {
    if (!activeMovie) return;
    window.open(`https://wa.me/573214465418?text=${encodeURIComponent(activeMovie.whatsappMessage)}`, '_blank');
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

  return {
    activeMovie, activeIndex, isMuted, isPaused, setIsPaused, hasVideoError, setHasVideoError,
    iframeRef, fallbackVideoRef, handleNext, handlePrev, toggleMute, handleBuyWhatsApp, handleAddToCart
  };
}
