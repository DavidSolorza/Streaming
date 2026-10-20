import { busService } from '../bus/busService.ts';

export class PlatformChangeReceptor {
  static register(): void {
    busService.subscribe('PLATFORM:MUTATED', (event) => {
      console.log(
        `[PlatformChangeReceptor] Acción: ${event.accion} | ID: ${event.id} | Nombre: ${event.nombre} | Precio: ${event.precio} | Activo: ${event.activo}`
      );
      busService.publish('SECURITY:AUDIT', {
        action: `PLATFORM_${event.accion}`,
        status: 'SUCCESS',
        detail: `Plataforma ${event.id} (${event.nombre}) modificada a $${event.precio}`,
        timestamp: new Date().toISOString()
      });
    });
  }
}
