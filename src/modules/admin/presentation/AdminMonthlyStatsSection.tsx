import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Award } from 'lucide-react';
import { SalesRepository } from '@/modules/sales/infrastructure/salesRepository';
import { SaleOrder, MonthlySalesMetrics } from '@/modules/sales/domain/entities/SaleOrder';
import { formatCOP } from '@/core/utils/currency';
import { AdminOrdersTable } from './AdminOrdersTable';

export const AdminMonthlyStatsSection: React.FC = () => {
  const [orders, setOrders] = useState<SaleOrder[]>([]);
  const [metrics, setMetrics] = useState<MonthlySalesMetrics | null>(null);

  const loadData = async () => {
    const [ordersData, metricsData] = await Promise.all([
      SalesRepository.getOrders(),
      SalesRepository.getMonthlyMetrics()
    ]);
    setOrders(ordersData);
    setMetrics(metricsData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (orderId: string, current: SaleOrder['status']) => {
    const nextStatus = current === 'completada' ? 'validada' : 'completada';
    await SalesRepository.updateOrderStatus(orderId, nextStatus);
    await loadData();
  };

  if (!metrics) return null;

  return (
    <section className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-base">Resumen Mensual & Estadísticas de Ventas</h3>
            <p className="text-xs text-slate-500 font-medium">Métricas calculadas por el backend y SQLite.</p>
          </div>
        </div>
        <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl">Mes en Curso</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-4 rounded-2xl border border-emerald-200/70">
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Ingresos del Mes</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-emerald-950">{formatCOP(metrics.currentMonthRevenue)} COP</p>
          <span className="text-[10px] text-emerald-700 font-semibold">{metrics.validatedOrdersCount} órdenes validadas</span>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 rounded-2xl border border-blue-200/70">
          <div className="flex items-center justify-between text-blue-700 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Órdenes Totales</span>
            <ShoppingBag className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-blue-950">{metrics.currentMonthOrdersCount}</p>
          <span className="text-[10px] text-blue-700 font-semibold">{metrics.pendingOrdersCount} pendientes</span>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 rounded-2xl border border-amber-200/70">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Ticket Promedio</span>
            <Award className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-amber-950">{formatCOP(metrics.averageTicket)} COP</p>
          <span className="text-[10px] text-amber-700 font-semibold">Gasto medio por cliente</span>
        </div>
      </div>

      <AdminOrdersTable orders={orders} onToggleStatus={handleUpdateStatus} />
    </section>
  );
};
