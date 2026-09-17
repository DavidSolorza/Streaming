import { PlataformaAPI, actualizarPlataforma } from './platformApi';
import { ComboAPI, actualizarCombo } from './comboApi';

export type { PlataformaAPI, ComboAPI };
export { actualizarPlataforma, actualizarCombo };

export interface CatalogoRespuesta {
  plataformas: PlataformaAPI[];
  combos: ComboAPI[];
}

const API_BASE = '/api';

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
      if (platData.success && Array.isArray(platData.data)) plataformas = platData.data;
    }

    if (comboRes.ok) {
      const comboData = await comboRes.json();
      if (comboData.success && Array.isArray(comboData.data)) combos = comboData.data;
    }

    return { plataformas, combos };
  } catch (error) {
    console.error('Error al conectar con la API de Cloudflare D1:', error);
    return { plataformas: [], combos: [] };
  }
}
