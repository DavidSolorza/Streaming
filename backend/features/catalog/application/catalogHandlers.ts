import type { ICatalogRepository, PlataformaDTO, ComboDTO, PlataformaViewModel, ComboViewModel } from '../domain/catalogContracts.ts';
import type { IAdminRepository } from '../../admin/domain/adminContracts.ts';
import { busService } from '../../../core/bus/busService.ts';

export class CatalogHandlers {
  private repo: ICatalogRepository;
  private adminRepo: IAdminRepository;

  constructor(repo: ICatalogRepository, adminRepo: IAdminRepository) {
    this.repo = repo;
    this.adminRepo = adminRepo;
    this.registerBusHandlers();
  }

  private registerBusHandlers(): void {
    busService.registerCommandHandler('GET_CATALOG', async () => {
      const storeConfig = this.adminRepo.getStoreConfig();
      const phone = (storeConfig.whatsappNumber || '573214465418').replace(/\D/g, '');

      const rawPlatforms = this.repo.getAllPlatforms();
      const plataformas: PlataformaViewModel[] = rawPlatforms.map((p) => {
        const priceFormatted = `$${p.precio.toLocaleString('es-CO')} COP`;
        const text = `👋 ¡Hola! Vengo de la tienda web y quiero pedir una pantalla de *${p.nombre}* (${priceFormatted}/mes). ¿Me confirmas disponibilidad?`;
        const directWhatsAppUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
        return {
          ...p,
          priceFormatted,
          directWhatsAppUrl,
          warrantyBadge: 'Garantía 30 días'
        };
      });

      const rawCombos = this.repo.getAllCombos();
      const combos: ComboViewModel[] = rawCombos.map((c) => {
        const priceFormatted = `$${c.precio.toLocaleString('es-CO')} COP`;
        const ahorroFormatted = `Ahorras $${c.ahorro.toLocaleString('es-CO')} COP`;
        const text = `👋 ¡Hola! Quiero pedir el *${c.nombre}* (${c.plataformas_nombres}) por ${priceFormatted}. ¿Me confirmas disponibilidad para pagar por transferencia?`;
        const directWhatsAppUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
        return {
          ...c,
          priceFormatted,
          ahorroFormatted,
          directWhatsAppUrl
        };
      });

      return { plataformas, combos };
    });

    busService.registerCommandHandler(
      'UPDATE_PLATFORM',
      async (payload: { id: string; precio: number; activo: boolean }) => {
        const updated = this.repo.updatePlatformPriceAndStatus(payload.id, payload.precio, payload.activo);
        if (updated) {
          busService.publish('PLATFORM:MUTATED', {
            id: updated.id,
            nombre: updated.nombre,
            precio: updated.precio,
            activo: updated.activo === 1,
            accion: 'ACTUALIZADA'
          });
        }
        return updated;
      }
    );

    busService.registerCommandHandler(
      'UPDATE_COMBO',
      async (payload: { id: number; precio: number; destacado: boolean }) => {
        return this.repo.updateCombo(payload.id, payload.precio, payload.destacado);
      }
    );
  }

  async getCatalog(): Promise<{ plataformas: PlataformaViewModel[]; combos: ComboViewModel[] }> {
    return await busService.executeCommand('GET_CATALOG', null);
  }

  async updatePlatform(id: string, precio: number, activo: boolean): Promise<PlataformaDTO | null> {
    return await busService.executeCommand('UPDATE_PLATFORM', { id, precio, activo });
  }

  async updateCombo(id: number, precio: number, destacado: boolean): Promise<ComboDTO | null> {
    return await busService.executeCommand('UPDATE_COMBO', { id, precio, destacado });
  }
}
