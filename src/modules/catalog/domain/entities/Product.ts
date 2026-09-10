import { DurationKey } from '../value-objects/PlanDuration';

export type ProductMode = 'pantalla' | 'cuenta';

export interface ModeDetails {
  label: string;
  devices: string;
  quality: string;
  access: string;
  prices: Record<DurationKey, number>;
  regularPrices: Record<DurationKey, number>;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: 'cine' | 'musica' | 'deportes' | 'combo';
  brandGlow: string;
  iconName: string; // Nombre del icono oficial en Iconify (ej: "logos:netflix-icon")
  logoText?: string;
  logoBg: string;
  available: boolean;
  bestseller: boolean;
  badges: string[];
  searchTags: string[];
  modes: Record<ProductMode, ModeDetails>;
  includes: string[];
}
