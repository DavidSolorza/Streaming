import { Product } from '../domain/entities/Product';
import { eventBus } from '@/core/bus/eventBus';

const PRODUCTS_STORAGE_KEY = 'cuentas_stream_products_v1';

export const initialProductsData: Product[] = [
  { 
    id: 1, 
    name: 'Netflix Ultra HD 4K', 
    brand: 'Netflix',
    category: 'cine', 
    brandGlow: 'brand-glow-netflix',
    iconName: 'logos:netflix-icon',
    logoBg: 'bg-red-500/10 text-red-500 border-red-500/20',
    available: true, 
    bestseller: true,
    badges: ['4K UHD', 'Entrega Inmediata', 'Renovable'],
    searchTags: ['netflix', 'cine', 'series', 'peliculas', '4k', 'stranger things'],
    modes: {
      pantalla: {
        label: '1 Pantalla (Perfil con PIN)',
        devices: '1 Dispositivo simultáneo',
        quality: '4K Ultra HD + HDR',
        access: 'Perfil privado con PIN de 4 dígitos',
        prices: { '1m': 17000, '3m': 45000, '6m': 85000 },
        regularPrices: { '1m': 28000, '3m': 75000, '6m': 140000 }
      },
      cuenta: {
        label: 'Cuenta Completa (Hogar)',
        devices: '4 Dispositivos simultáneos',
        quality: '4K Ultra HD + Dolby Atmos',
        access: 'Correo y clave propia renovable',
        prices: { '1m': 45000, '3m': 120000, '6m': 225000 },
        regularPrices: { '1m': 70000, '3m': 180000, '6m': 330000 }
      }
    },
    includes: [
      'Acceso al catálogo global completo de Netflix sin restricciones',
      'Descargas habilitadas para ver offline en dispositivos móviles',
      'Calidad Ultra HD 4K con soporte HDR10+ y audio espacial',
      'Recomendaciones personalizadas según tus gustos'
    ]
  },
  { 
    id: 2, 
    name: 'Disney+ Premium', 
    brand: 'Disney+',
    category: 'cine', 
    brandGlow: 'brand-glow-disney',
    iconName: 'logos:disney-plus',
    logoBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    available: true, 
    bestseller: true,
    badges: ['Deportes ESPN', '4K UHD', 'Entrega Inmediata'],
    searchTags: ['disney', 'marvel', 'star wars', 'espn', 'futbol', 'deportes', 'pixar'],
    modes: {
      pantalla: {
        label: '1 Pantalla (Perfil con PIN)',
        devices: '1 Dispositivo simultáneo',
        quality: '4K UHD + IMAX Enhanced',
        access: 'Perfil con PIN y deportes ESPN incluidos',
        prices: { '1m': 16000, '3m': 42000, '6m': 80000 },
        regularPrices: { '1m': 26000, '3m': 70000, '6m': 130000 }
      },
      cuenta: {
        label: 'Cuenta Completa (Hogar)',
        devices: '4 Dispositivos simultáneos',
        quality: '4K UHD + Dolby Vision & ESPN Live',
        access: 'Cuenta familiar directa a tu correo',
        prices: { '1m': 42000, '3m': 110000, '6m': 210000 },
        regularPrices: { '1m': 65000, '3m': 160000, '6m': 300000 }
      }
    },
    includes: [
      'Eventos deportivos en vivo de ESPN (Champions League, F1, Tenis, UFC)',
      'Catálogo completo de Marvel Studios, Star Wars, Pixar y National Geographic',
      'Transmisión en directo de canales deportivos y programas exclusivos',
      'Sonido Dolby Atmos e IMAX Enhanced en títulos compatibles'
    ]
  },
  { 
    id: 3, 
    name: 'Max (HBO Max)', 
    brand: 'Max',
    category: 'cine', 
    brandGlow: 'brand-glow-max',
    iconName: 'simple-icons:max',
    logoBg: 'bg-blue-600/10 text-blue-500 border-blue-600/20',
    available: true, 
    bestseller: false,
    badges: ['Peliculas Cine', '4K UHD', 'Entrega Inmediata'],
    searchTags: ['max', 'hbo', 'house of the dragon', 'cine', 'series', 'champions'],
    modes: {
      pantalla: {
        label: '1 Pantalla (Perfil con PIN)',
        devices: '1 Dispositivo simultáneo',
        quality: '4K Ultra HD & Full HD',
        access: 'Perfil personal exclusivo con PIN',
        prices: { '1m': 12000, '3m': 32000, '6m': 60000 },
        regularPrices: { '1m': 20000, '3m': 55000, '6m': 100000 }
      },
      cuenta: {
        label: 'Cuenta Completa (Hogar)',
        devices: '3 Dispositivos simultáneos',
        quality: '4K UHD 60fps + Dolby Atmos',
        access: 'Acceso a la cuenta completa con tu correo',
        prices: { '1m': 28000, '3m': 75000, '6m': 140000 },
        regularPrices: { '1m': 45000, '3m': 110000, '6m': 200000 }
      }
    },
    includes: [
      'Estrenos de cine directo de Warner Bros 45 días después de las salas',
      'Series exclusivas de HBO (La Casa del Dragón, The Last of Us, Succession)',
      'Contenido infantil de Cartoon Network y universo DC Universe',
      'Calidad Ultra HD 4K con Dolby Vision en dispositivos compatibles'
    ]
  },
  { 
    id: 4, 
    name: 'Amazon Prime Video', 
    brand: 'Prime Video',
    category: 'cine', 
    brandGlow: 'brand-glow-prime',
    iconName: 'simple-icons:amazonprime',
    logoBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    available: true, 
    bestseller: false,
    badges: ['Envíos & Cine', '4K UHD', 'Renovable'],
    searchTags: ['prime', 'amazon', 'boys', 'rings of power', 'cine', 'series'],
    modes: {
      pantalla: {
        label: '1 Pantalla (Perfil con PIN)',
        devices: '1 Dispositivo simultáneo',
        quality: '4K Ultra HD + HDR10+',
        access: 'Perfil asignado con PIN de seguridad',
        prices: { '1m': 9000, '3m': 24000, '6m': 45000 },
        regularPrices: { '1m': 15000, '3m': 40000, '6m': 75000 }
      },
      cuenta: {
        label: 'Cuenta Completa (Hogar)',
        devices: '3 Dispositivos simultáneos',
        quality: '4K UHD + HDR10+',
        access: 'Cuenta familiar directa con tu correo',
        prices: { '1m': 22000, '3m': 58000, '6m': 105000 },
        regularPrices: { '1m': 35000, '3m': 90000, '6m': 160000 }
      }
    },
    includes: [
      'Producciones originales de Amazon Originals (The Boys, El Señor de los Anillos)',
      'Alquiler y tienda de películas de estreno reciente',
      'X-Ray interactivo con información de actores y datos curiosos en pantalla',
      'Suscripción Twitch Prime gratis según disponibilidad'
    ]
  },
  { 
    id: 5, 
    name: 'Crunchyroll Mega Fan', 
    brand: 'Crunchyroll',
    category: 'cine', 
    brandGlow: 'brand-glow-crunchyroll',
    iconName: 'simple-icons:crunchyroll',
    logoBg: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    available: true, 
    bestseller: true,
    badges: ['Simulcast Anime', 'Full HD', 'Sin Anuncios'],
    searchTags: ['crunchyroll', 'anime', 'otaku', 'dragon ball', 'naruto', 'one piece', 'simulcast'],
    modes: {
      pantalla: {
        label: '1 Pantalla (Perfil con PIN)',
        devices: '1 Dispositivo simultáneo',
        quality: 'Full HD 1080p sin comerciales',
        access: 'Perfil personal con PIN de seguridad',
        prices: { '1m': 8000, '3m': 21000, '6m': 38000 },
        regularPrices: { '1m': 14000, '3m': 35000, '6m': 65000 }
      },
      cuenta: {
        label: 'Cuenta Completa (Hogar)',
        devices: '4 Dispositivos simultáneos',
        quality: 'Mega Fan Full HD + Offline',
        access: 'Cuenta Mega Fan con tu propio correo',
        prices: { '1m': 18000, '3m': 48000, '6m': 88000 },
        regularPrices: { '1m': 30000, '3m': 78000, '6m': 140000 }
      }
    },
    includes: [
      'Estrenos en Simulcast 1 hora después de su transmisión en Japón',
      'Catálogo masivo de anime subtitulado y doblado al español latino',
      'Descargas sin conexión en dispositivos móviles con plan Mega Fan',
      'Lectura de manga digital según la disponibilidad del catálogo'
    ]
  },
  { 
    id: 6, 
    name: 'Spotify Premium', 
    brand: 'Spotify',
    category: 'musica', 
    brandGlow: 'brand-glow-spotify',
    iconName: 'logos:spotify-icon',
    logoBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    available: true, 
    bestseller: true,
    badges: ['Audio 320kbps', 'Tu Propia Cuenta', 'Sin Anuncios'],
    searchTags: ['spotify', 'musica', 'audio', 'podcast', 'playlists', 'canciones'],
    modes: {
      pantalla: {
        label: 'Cupo Familiar (Tu Correo)',
        devices: '1 Dispositivo personal activo',
        quality: 'Audio Premium 320 kbps HQ',
        access: 'Te unimos a la familia en tu cuenta propia',
        prices: { '1m': 10000, '3m': 27000, '6m': 50000 },
        regularPrices: { '1m': 18000, '3m': 48000, '6m': 90000 }
      },
      cuenta: {
        label: 'Cuenta Familiar Completa',
        devices: '6 Miembros simultáneos',
        quality: 'Audio Extreme 320kbps + Spotify Kids',
        access: 'Plan familiar completo con 6 cupos gestionables',
        prices: { '1m': 30000, '3m': 82000, '6m': 155000 },
        regularPrices: { '1m': 50000, '3m': 130000, '6m': 240000 }
      }
    },
    includes: [
      'Música ilimitada sin interrupciones publicitarias en tu cuenta personal',
      'Descargas de tus canciones y podcasts favoritos para escuchar sin internet',
      'Calidad de sonido superior a 320 kbps con ecualizador personalizado',
      'Compatibilidad total con parlantes inteligentes, Smart TV y CarPlay'
    ]
  }
];

export class ProductRepository {
  private static cachedProducts: Product[] | null = null;

  /**
   * Obtiene la lista actual de productos (con persistencia en localStorage)
   */
  static getProducts(): Product[] {
    if (this.cachedProducts) {
      return this.cachedProducts;
    }

    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.cachedProducts = parsed;
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error al leer productos de localStorage:', e);
    }

    this.cachedProducts = [...initialProductsData];
    this.persist(this.cachedProducts);
    return this.cachedProducts;
  }

  /**
   * Busca un producto por ID
   */
  static getProductById(id: number): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  }

  /**
   * Añade un nuevo producto al catálogo
   */
  static addProduct(newProduct: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const created: Product = { ...newProduct, id: nextId };

    const updatedList = [created, ...products];
    this.cachedProducts = updatedList;
    this.persist(updatedList);
    eventBus.emit('CATALOG:PRODUCTS_CHANGED', updatedList);
    return created;
  }

  /**
   * Edita la información o precios de un producto existente
   */
  static updateProduct(id: number, updatedFields: Partial<Product>): Product | undefined {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    const updatedProduct = { ...products[index], ...updatedFields };
    products[index] = updatedProduct;

    this.cachedProducts = [...products];
    this.persist(this.cachedProducts);
    eventBus.emit('CATALOG:PRODUCTS_CHANGED', this.cachedProducts);
    return updatedProduct;
  }

  /**
   * Elimina un producto del catálogo
   */
  static deleteProduct(id: number): boolean {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;

    this.cachedProducts = filtered;
    this.persist(filtered);
    eventBus.emit('CATALOG:PRODUCTS_CHANGED', filtered);
    return true;
  }

  /**
   * Alterna el estado de disponibilidad ("Entrega Inmediata" vs "Agotado") en 1 clic
   */
  static toggleAvailability(id: number): Product | undefined {
    const product = this.getProductById(id);
    if (!product) return undefined;
    return this.updateProduct(id, { available: !product.available });
  }

  /**
   * Restablece el catálogo a los datos originales por defecto
   */
  static resetToDefaults(): Product[] {
    this.cachedProducts = [...initialProductsData];
    this.persist(this.cachedProducts);
    eventBus.emit('CATALOG:PRODUCTS_CHANGED', this.cachedProducts);
    return this.cachedProducts;
  }

  private static persist(products: Product[]): void {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn('Error al guardar productos en localStorage:', e);
    }
  }
}
