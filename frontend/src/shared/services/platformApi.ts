export interface PlataformaAPI {
  id: string;
  nombre: string;
  categoria: 'CINE' | 'MUSICA' | 'TRABAJO' | 'IPTV';
  precio: number;
  entrega_inmediata: number;
  subtitulo: string;
  logo_url: string;
  activo: number;
}

const API_BASE = '/api';

/**
 * 🗄️ Capa de Acceso a Datos (Repositorio) - Cliente HTTP Plataformas
 */
export class PlatformApiRepository {
  static async updatePlatform(
    id: string,
    nuevoPrecio: number,
    entregaInmediata: boolean | number
  ): Promise<{ success: boolean; message: string; data?: PlataformaAPI }> {
    try {
      const response = await fetch(`${API_BASE}/plataformas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          precio: nuevoPrecio,
          entrega_inmediata: typeof entregaInmediata === 'boolean' ? (entregaInmediata ? 1 : 0) : entregaInmediata,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || 'Error al actualizar la plataforma' };
      }
      return data;
    } catch (error: any) {
      console.error('Error de red al actualizar plataforma:', error);
      return { success: false, message: error.message || 'Fallo de conexión al servidor' };
    }
  }
}

export const actualizarPlataforma = PlatformApiRepository.updatePlatform;
