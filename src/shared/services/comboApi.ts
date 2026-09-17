export interface ComboAPI {
  id: number;
  nombre: string;
  plataformas_nombres: string;
  precio: number;
  ahorro: number;
  destacado: number;
  entrega_inmediata: number;
}

const API_BASE = '/api';

/**
 * 🗄️ Capa de Acceso a Datos (Repositorio) - Cliente HTTP Combos
 */
export class ComboApiRepository {
  static async updateCombo(
    id: number,
    nuevoPrecio: number,
    entregaInmediata: boolean | number,
    ahorro?: number
  ): Promise<{ success: boolean; message: string; data?: ComboAPI }> {
    try {
      const response = await fetch(`${API_BASE}/combos`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          precio: nuevoPrecio,
          entrega_inmediata: typeof entregaInmediata === 'boolean' ? (entregaInmediata ? 1 : 0) : entregaInmediata,
          ahorro: ahorro ?? 0,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || 'Error al actualizar el combo' };
      }
      return data;
    } catch (error: any) {
      console.error('Error de red al actualizar combo:', error);
      return { success: false, message: error.message || 'Fallo de conexión al servidor' };
    }
  }
}

export const actualizarCombo = ComboApiRepository.updateCombo;
