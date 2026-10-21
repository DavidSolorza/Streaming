export interface FeaturedMovieItem {
  id: string;
  movieTitle: string;
  brand?: string;
  icon?: string;
  rating: number;
  tagline: string;
  description: string;
  price?: number;
  regularPrice?: number;
  productId?: number;
  youtubeId: string;
  posterUrl: string;
  backdropUrl?: string;
  whatsappMessage: string;
}

export const DEFAULT_MOVIES: FeaturedMovieItem[] = [
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
    youtubeId: 'Bk1Hf0FtR7k',
    posterUrl: 'https://image.tmdb.org/t/p/w342/mLAGAFUrRw9pphjnbnhtG1hASSN.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w780/hHPIefotew38oJm3YCJPAzpi26c.jpg',
    whatsappMessage: '*SOLICITUD DE STREAMING*\n──────────────────────────\n*Película:* Moana 2\n*Plataforma:* Disney+ Premium\n*Precio:* $16.000 COP / mes\n──────────────────────────\nDeseo contratar este servicio. ¿Me compartes los datos de pago para entrega inmediata?',
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
    posterUrl: 'https://image.tmdb.org/t/p/w342/szyVpg9K3LL5s8VFAGkXzlxgZUk.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w780/etj5CuMuamjhGj1p1c2P5f3F4p6.jpg',
    whatsappMessage: '*SOLICITUD DE STREAMING*\n──────────────────────────\n*Película:* La Casa del Dragón\n*Plataforma:* Max (HBO)\n*Precio:* $15.000 COP / mes\n──────────────────────────\nDeseo contratar este servicio. ¿Me compartes los datos de pago para entrega inmediata?',
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
    posterUrl: 'https://image.tmdb.org/t/p/w342/AsPD90QEQsIAtSxfSjV3fN7XFpt.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w780/56v2ox9huwvJCu9Vz0ywOtYo8q8.jpg',
    whatsappMessage: '*SOLICITUD DE STREAMING*\n──────────────────────────\n*Película:* Stranger Things\n*Plataforma:* Netflix Original 4K\n*Precio:* $17.000 COP / mes\n──────────────────────────\nDeseo contratar este servicio. ¿Me compartes los datos de pago para entrega inmediata?',
  },
];
