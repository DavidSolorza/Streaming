import { DatabaseSync } from 'node:sqlite';
import type { IOrderRepository, OrderDTO, CreateOrderInput } from '../domain/orderContracts.ts';
import { SQLiteClient } from '../../../core/db/sqliteClient.ts';

export class SQLiteOrderRepository implements IOrderRepository {
  private get db(): DatabaseSync {
    return SQLiteClient.getInstance();
  }

  createOrder(input: CreateOrderInput): OrderDTO {
    const stmt = this.db.prepare(`
      INSERT INTO sales_orders (order_code, customer_name, customer_contact, items_summary, total_cop, payment_method, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pendiente')
    `);
    stmt.run(
      input.orderCode,
      input.customerName,
      input.customerContact || null,
      input.itemsSummary,
      input.totalCop,
      input.paymentMethod || 'transferencia'
    );

    const created = this.getOrderByCode(input.orderCode);
    if (!created) throw new Error('Error al recuperar orden recién insertada.');
    return created;
  }

  getAllOrders(limit = 100): OrderDTO[] {
    const stmt = this.db.prepare(`
      SELECT * FROM sales_orders 
      ORDER BY id DESC 
      LIMIT ?
    `);
    return stmt.all(limit) as unknown as OrderDTO[];
  }

  getOrderByCode(code: string): OrderDTO | null {
    const stmt = this.db.prepare('SELECT * FROM sales_orders WHERE order_code = ?');
    return (stmt.get(code) as unknown as OrderDTO) || null;
  }

  updateOrderStatus(orderCode: string, status: 'pendiente' | 'confirmado' | 'cancelado'): boolean {
    const stmt = this.db.prepare('UPDATE sales_orders SET status = ? WHERE order_code = ?');
    const result = stmt.run(status, orderCode);
    return Number(result.changes) > 0;
  }

  getOrderStats(): { totalSales: number; totalRevenue: number; pendingCount: number } {
    const stats = this.db.prepare(`
      SELECT 
        COUNT(*) as totalSales,
        COALESCE(SUM(total_cop), 0) as totalRevenue,
        COALESCE(SUM(CASE WHEN status = 'pendiente' THEN 1 ELSE 0 END), 0) as pendingCount
      FROM sales_orders
    `).get() as { totalSales: number; totalRevenue: number; pendingCount: number };

    return stats;
  }
}
