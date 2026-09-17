/**
 * ⚙️ Capa de Lógica de Negocio (Servicio) - Reglas de Dominio de Combos
 */
export class ComboService {
  constructor(comboRepository) {
    this.repository = comboRepository;
  }

  async getAllCombos() {
    const list = await this.repository.findAll();
    return list.map((c) => ({
      ...c,
      ahorroFormat: `$${Number(c.ahorro).toLocaleString('es-CO')} COP`,
    }));
  }

  async updateCombo(id, precio, ahorro, entregaInmediata) {
    const comboId = Number(id);
    if (!comboId || isNaN(comboId) || comboId <= 0) {
      throw { status: 400, code: 'MISSING_COMBO_ID', message: 'El campo "id" debe ser un número entero válido.' };
    }
    if (precio === undefined || typeof precio !== 'number' || precio <= 0) {
      throw { status: 422, code: 'INVALID_PRICE', message: 'El "precio" debe ser mayor a cero (COP).' };
    }

    const ahorroVal = ahorro !== undefined ? Math.max(0, Number(ahorro)) : 0;
    const entregaVal = entregaInmediata ? 1 : 0;

    const changes = await this.repository.updatePriceAndSavings(comboId, precio, ahorroVal, entregaVal);
    if (changes === 0) {
      throw { status: 404, code: 'COMBO_NOT_FOUND', message: `No existe el combo con id "${comboId}".` };
    }

    return await this.repository.findById(comboId);
  }
}
