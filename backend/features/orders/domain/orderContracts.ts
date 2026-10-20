export interface OrderDTO {
  id: number;
  order_code: string;
  customer_name: string;
  customer_contact?: string | null;
  items_summary: string;
  total_cop: number;
  payment_method: string;
  status: 'pendiente' | 'confirmado' | 'cancelado';
  created_at: string;
}

export interface CreateOrderInput {
  orderCode: string;
  customerName: string;
  customerContact?: string;
  itemsSummary: string;
  totalCop: number;
  paymentMethod?: string;
}

export interface IOrderRepository {
  createOrder(input: CreateOrderInput): OrderDTO;
  getAllOrders(limit?: number): OrderDTO[];
  getOrderByCode(code: string): OrderDTO | null;
  updateOrderStatus(orderCode: string, status: 'pendiente' | 'confirmado' | 'cancelado'): boolean;
  getOrderStats(): { totalSales: number; totalRevenue: number; pendingCount: number };
}
