export interface PlataformaDTO {
  id: string;
  nombre: string;
  categoria: 'CINE' | 'MUSICA' | 'TRABAJO' | 'IPTV';
  precio: number;
  entrega_inmediata: number;
  subtitulo?: string | null;
  logo_url?: string | null;
  activo: number;
}

export interface PlataformaViewModel extends PlataformaDTO {
  priceFormatted: string;
  directWhatsAppUrl: string;
  warrantyBadge: string;
}

export interface ComboDTO {
  id: number;
  nombre: string;
  plataformas_nombres: string;
  precio: number;
  ahorro: number;
  destacado: number;
  entrega_inmediata: number;
}

export interface ComboViewModel extends ComboDTO {
  priceFormatted: string;
  ahorroFormatted: string;
  directWhatsAppUrl: string;
}

export interface ICatalogRepository {
  getAllPlatforms(): PlataformaDTO[];
  getPlatformById(id: string): PlataformaDTO | null;
  updatePlatformPriceAndStatus(id: string, precio: number, activo: boolean): PlataformaDTO | null;
  getAllCombos(): ComboDTO[];
  updateCombo(id: number, precio: number, destacado: boolean): ComboDTO | null;
}
