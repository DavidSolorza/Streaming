/**
 * ⚙️ Capa de Lógica de Negocio (Servicio) - Reglas de Dominio de Plataformas
 */
export class PlatformService {
  constructor(platformRepository) {
    this.repository = platformRepository;
  }

  async getActivePlatforms() {
    const list = await this.repository.findAllActive();
    return list.map((item) => ({
      ...item,
      precioFormat: `$${Number(item.precio).toLocaleString('es-CO')} COP`,
    }));
  }

  async updatePlatform(id, precio, entregaInmediata) {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw { status: 400, code: 'MISSING_PLATFORM_ID', message: 'El campo "id" es obligatorio.' };
    }
    if (precio === undefined || typeof precio !== 'number' || precio <= 0) {
      throw { status: 422, code: 'INVALID_PRICE', message: 'El "precio" debe ser un número positivo (COP).' };
    }

    const entregaVal = entregaInmediata ? 1 : 0;
    const changes = await this.repository.updatePriceAndStatus(id.trim(), precio, entregaVal);

    if (changes === 0) {
      throw { status: 404, code: 'PLATFORM_NOT_FOUND', message: `No existe la plataforma con id "${id}".` };
    }

    return await this.repository.findById(id.trim());
  }
}
