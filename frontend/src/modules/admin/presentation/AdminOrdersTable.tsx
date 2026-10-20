import React from 'react';
import { SaleOrder } from '@/modules/sales/domain/entities/SaleOrder';
import { formatCOP } from '@/core/utils/currency';

interface Props {
  orders: SaleOrder[];
  onToggleStatus: (orderId: string, currentStatus: SaleOrder['status']) => void;
}

export const AdminOrdersTable: React.FC<Props> = ({ orders, onToggleStatus }) => (
  <div className="space-y-3">
    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Órdenes Recientes Conciliadas</h4>
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
          <tr>
            <th className="p-3">Código</th>
            <th className="p-3">Cliente</th>
            <th className="p-3">Detalle</th>
            <th className="p-3">Total</th>
            <th className="p-3">Pago</th>
            <th className="p-3 text-right">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {orders.slice(0, 6).map((o) => (
            <tr key={o.id} className="hover:bg-slate-50/80 transition">
              <td className="p-3 font-mono font-bold text-blue-700">{o.orderCode}</td>
              <td className="p-3 font-bold text-slate-900">{o.customerName}</td>
              <td className="p-3 text-slate-600 max-w-[200px] truncate">{o.itemsSummary}</td>
              <td className="p-3 font-bold text-slate-900">{formatCOP(o.totalCop)}</td>
              <td className="p-3 uppercase text-[10px] font-extrabold text-slate-500">{o.paymentMethod}</td>
              <td className="p-3 text-right">
                <button
                  onClick={() => onToggleStatus(o.id, o.status)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition ${
                    o.status === 'completada' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {o.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
