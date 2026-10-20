import { eventBus } from '@/core/bus/eventBus';
import { Product } from '@/modules/catalog/domain/entities/Product';

export class CatalogSyncReceptor {
  private static isInitialized = false;

  static initialize(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    eventBus.on('CATALOG:PRODUCTS_CHANGED', (products: Product[]) => {
      try {
        localStorage.setItem('cuentas_stream_products_v12', JSON.stringify(products));
      } catch (err) {
        console.warn('[CatalogSyncReceptor] No se pudo guardar en almacenamiento local:', err);
      }
    });
  }
}
