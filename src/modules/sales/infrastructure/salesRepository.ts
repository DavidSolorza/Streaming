import { SaleOrder, MonthlySalesMetrics } from '../domain/entities/SaleOrder';
import { ApiHttpClient } from '@/core/http/apiHttpClient';

const LOCAL_STORAGE_KEY = 'cuentas_jp_sales_orders_v1';

export class SalesRepository {
  static async getOrders(): Promise<SaleOrder[]> {
    const res = await ApiHttpClient.get<any[]>('/orders');
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      const mapped = res.data.map(this.mapFromDb);
      try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mapped)); } catch {}
      return mapped;
    }
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  }

  static async recordOrder(data: Omit<SaleOrder, 'id' | 'createdAt'>): Promise<SaleOrder> {
    const newOrder: SaleOrder = {
      ...data,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    await ApiHttpClient.post('/orders', {
      orderCode: newOrder.orderCode,
      customerName: newOrder.customerName,
      customerContact: newOrder.customerContact,
      totalCop: newOrder.totalCop,
      paymentMethod: newOrder.paymentMethod,
      itemsSummary: newOrder.itemsSummary,
    });

    try {
      const current = await this.getOrders();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([newOrder, ...current]));
    } catch {}

    return newOrder;
  }

  static async updateOrderStatus(orderId: string, status: SaleOrder['status']): Promise<boolean> {
    const current = await this.getOrders();
    const updated = current.map(o => o.id === orderId ? { ...o, status } : o);
    try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated)); } catch {}
    return true;
  }

  static async getMonthlyMetrics(): Promise<MonthlySalesMetrics> {
    const res = await ApiHttpClient.get<any>('/stats');
    if (res.success && res.data) {
      return {
        currentMonthRevenue: Number(res.data.totalRevenue) || 0,
        currentMonthOrdersCount: Number(res.data.totalSales) || 0,
        averageTicket: Number(res.data.averageTicket) || 0,
        validatedOrdersCount: Math.max(0, (Number(res.data.totalSales) || 0) - (Number(res.data.pendingCount) || 0)),
        pendingOrdersCount: Number(res.data.pendingCount) || 0,
        topServices: [
          { name: 'Netflix Original 4K', count: 18, revenue: 306000 },
          { name: 'Disney+ Premium', count: 14, revenue: 224000 },
          { name: 'Canva Pro 12M', count: 11, revenue: 385000 },
          { name: 'IPTV Pro Ultra HD', count: 8, revenue: 144000 },
        ],
      };
    }
    return this.calculateMonthlyMetrics([]);
  }

  static calculateMonthlyMetrics(orders: SaleOrder[]): MonthlySalesMetrics {
    const revenue = orders.filter(o => o.status !== 'cancelada').reduce((s, o) => s + o.totalCop, 0);
    const valid = orders.filter(o => o.status === 'completada' || o.status === 'validada').length;
    const pending = orders.filter(o => o.status === 'pendiente').length;

    return {
      currentMonthRevenue: revenue,
      currentMonthOrdersCount: orders.length,
      averageTicket: orders.length > 0 ? Math.round(revenue / orders.length) : 0,
      validatedOrdersCount: valid,
      pendingOrdersCount: pending,
      topServices: [],
    };
  }

  private static mapFromDb(db: any): SaleOrder {
    return {
      id: String(db.id),
      orderCode: db.order_code,
      customerName: db.customer_name,
      customerContact: db.customer_contact,
      totalCop: Number(db.total_cop),
      status: db.status,
      paymentMethod: db.payment_method,
      itemsSummary: db.items_summary,
      createdAt: db.created_at,
    };
  }
}
