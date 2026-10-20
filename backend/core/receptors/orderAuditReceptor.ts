import { busService } from '../bus/busService.ts';
import { SQLiteClient } from '../db/sqliteClient.ts';

export class OrderAuditReceptor {
  static register(): void {
    busService.subscribe('ORDER:CREATED', async (orderData) => {
      try {
        const db = SQLiteClient.getInstance();
        const stmt = db.prepare(`
          INSERT INTO sales_orders (order_code, customer_name, customer_contact, items_summary, total_cop, payment_method, status)
          VALUES (?, ?, ?, ?, ?, ?, 'pendiente')
          ON CONFLICT(order_code) DO NOTHING
        `);
        stmt.run(
          orderData.orderCode,
          orderData.customerName,
          orderData.customerContact || null,
          orderData.itemsSummary,
          orderData.totalCop,
          orderData.paymentMethod
        );
        console.log(`[OrderAuditReceptor] Orden auditada exitosamente: ${orderData.orderCode}`);
      } catch (err) {
        console.error(`[OrderAuditReceptor] Error al auditar orden:`, err);
      }
    });
  }
}
