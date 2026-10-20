import type { IOrderRepository, CreateOrderInput, OrderDTO } from '../domain/orderContracts.ts';
import { busService } from '../../../core/bus/busService.ts';

export class OrderHandlers {
  private repo: IOrderRepository;

  constructor(repo: IOrderRepository) {
    this.repo = repo;
    this.registerBusHandlers();
  }

  private registerBusHandlers(): void {
    busService.registerCommandHandler('CREATE_ORDER', async (input: CreateOrderInput) => {
      const order = this.repo.createOrder(input);
      busService.publish('ORDER:CREATED', {
        orderCode: order.order_code,
        customerName: order.customer_name,
        customerContact: order.customer_contact || undefined,
        itemsSummary: order.items_summary,
        totalCop: order.total_cop,
        paymentMethod: order.payment_method
      });
      return order;
    });

    busService.registerCommandHandler('GET_ALL_ORDERS', async (payload: { limit?: number }) => {
      return this.repo.getAllOrders(payload?.limit);
    });

    busService.registerCommandHandler(
      'UPDATE_ORDER_STATUS',
      async (payload: { orderCode: string; status: 'pendiente' | 'confirmado' | 'cancelado' }) => {
        return this.repo.updateOrderStatus(payload.orderCode, payload.status);
      }
    );

    busService.registerCommandHandler('GET_ORDER_STATS', async () => {
      const raw = this.repo.getOrderStats();
      const avg = raw.totalSales > 0 ? Math.round(raw.totalRevenue / raw.totalSales) : 0;
      return {
        ...raw,
        totalRevenueFormatted: `$${raw.totalRevenue.toLocaleString('es-CO')} COP`,
        averageTicket: avg,
        averageTicketFormatted: `$${avg.toLocaleString('es-CO')} COP`
      };
    });
  }

  async createOrder(input: CreateOrderInput): Promise<OrderDTO> {
    return await busService.executeCommand('CREATE_ORDER', input);
  }

  async getAllOrders(limit?: number): Promise<OrderDTO[]> {
    return await busService.executeCommand('GET_ALL_ORDERS', { limit });
  }

  async updateOrderStatus(orderCode: string, status: 'pendiente' | 'confirmado' | 'cancelado'): Promise<boolean> {
    return await busService.executeCommand('UPDATE_ORDER_STATUS', { orderCode, status });
  }

  async getOrderStats(): Promise<any> {
    return await busService.executeCommand('GET_ORDER_STATS', null);
  }
}
