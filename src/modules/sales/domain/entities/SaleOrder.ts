export interface SaleOrder {
  id: string;
  orderCode: string;
  customerName: string;
  customerContact?: string;
  totalCop: number;
  status: 'pendiente' | 'validada' | 'completada' | 'cancelada';
  paymentMethod: 'nequi' | 'bancolombia' | 'daviplata' | 'transferencia' | 'whatsapp';
  itemsSummary: string;
  createdAt: string;
}

export interface MonthlySalesMetrics {
  currentMonthRevenue: number;
  currentMonthOrdersCount: number;
  averageTicket: number;
  validatedOrdersCount: number;
  pendingOrdersCount: number;
  topServices: { name: string; count: number; revenue: number }[];
}
