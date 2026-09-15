/**
 * 🌐 Servicio de Conexión de API Frontend para Cloudflare Pages Functions & D1 (SQLite)
 */

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

export interface ComboAPI {
  id: number;
  nombre: string;
  plataformas_nombres: string;
  precio: number;
  ahorro: number;
  destacado: number;
  entrega_inmediata: number;
}

export interface CatalogoRespuesta {
  plataformas: PlataformaAPI[];
  combos: ComboAPI[];
}

const API_BASE = '/api';

/**
 * 1. Obtiene el catálogo completo (Plataformas y Combos) desde los endpoints de Cloudflare D1
 */
export async function obtenerCatalogo(): Promise<CatalogoRespuesta> {
  try {
    const [platRes, comboRes] = await Promise.all([
      fetch(`${API_BASE}/plataformas`),
      fetch(`${API_BASE}/combos`),
    ]);

    let plataformas: PlataformaAPI[] = [];
    let combos: ComboAPI[] = [];

    if (platRes.ok) {
      const platData = await platRes.json();
      if (platData.success && Array.isArray(platData.data)) {
        plataformas = platData.data;
      }
    }

    if (comboRes.ok) {
      const comboData = await comboRes.json();
      if (comboData.success && Array.isArray(comboData.data)) {
        combos = comboData.data;
      }
    }

    return { plataformas, combos };
  } catch (error) {
    console.error('Error al conectar con la API de Cloudflare D1:', error);
    return { plataformas: [], combos: [] };
  }
}

/**
 * 2. Actualiza el precio y estado de entrega inmediata de una plataforma en D1 (Administración)
 */
export async function actualizarPlataforma(
  id: string,
  nuevoPrecio: number,
  entregaInmediata: boolean | number
): Promise<{ success: boolean; message: string; data?: PlataformaAPI }> {
  try {
    const response = await fetch(`${API_BASE}/plataformas`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        precio: nuevoPrecio,
        entrega_inmediata: typeof entregaInmediata === 'boolean' ? (entregaInmediata ? 1 : 0) : entregaInmediata,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Error al actualizar la plataforma',
      };
    }

    return data;
  } catch (error: any) {
    console.error('Error de red al actualizar plataforma:', error);
    return {
      success: false,
      message: error.message || 'Fallo de conexión al servidor',
    };
  }
}

/**
 * 3. Actualiza el precio y estado de entrega inmediata de un combo en D1 (Administración)
 */
export async function actualizarCombo(
  id: number,
  nuevoPrecio: number,
  entregaInmediata: boolean | number,
  ahorro?: number
): Promise<{ success: boolean; message: string; data?: ComboAPI }> {
  try {
    const response = await fetch(`${API_BASE}/combos`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        precio: nuevoPrecio,
        entrega_inmediata: typeof entregaInmediata === 'boolean' ? (entregaInmediata ? 1 : 0) : entregaInmediata,
        ahorro: ahorro ?? 0,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Error al actualizar el combo',
      };
    }

    return data;
  } catch (error: any) {
    console.error('Error de red al actualizar combo:', error);
    return {
      success: false,
      message: error.message || 'Fallo de conexión al servidor',
    };
  }
}
