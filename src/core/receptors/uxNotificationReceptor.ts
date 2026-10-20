import { eventBus } from '@/core/bus/eventBus';
import { toast } from '@/core/utils/toast';

export class UxNotificationReceptor {
  private static registered = false;

  static register(): void {
    if (this.registered) return;
    this.registered = true;

    eventBus.on('CART:ITEM_ADDED', (item) => {
      toast.show({
        type: 'cart',
        message: `Agregaste ${item.name} al carrito`,
        title: '¡Servicio Añadido!',
        price: item.price
      });
    });

    eventBus.on('CART:ITEM_REMOVED', (name) => {
      toast.info(`${name} fue retirado de tu pedido.`, 'Carrito Actualizado');
    });
  }
}
