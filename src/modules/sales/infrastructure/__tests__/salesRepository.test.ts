import { describe, it, expect, beforeEach } from 'vitest';
import { SalesRepository } from '../salesRepository';
import { SaleOrder } from '../../domain/entities/SaleOrder';

describe('SalesRepository Monthly Metrics', () => {
  const mockOrders: SaleOrder[] = [
    { id: '1', orderCode: 'ORD-1', customerName: 'Ana', customerContact: '3001', totalCop: 40000, status: 'completada', paymentMethod: 'nequi', itemsSummary: 'Netflix', createdAt: new Date().toISOString() },
    { id: '2', orderCode: 'ORD-2', customerName: 'Beto', customerContact: '3002', totalCop: 20000, status: 'validada', paymentMethod: 'bancolombia', itemsSummary: 'Disney', createdAt: new Date().toISOString() },
    { id: '3', orderCode: 'ORD-3', customerName: 'Ciro', customerContact: '3003', totalCop: 30000, status: 'pendiente', paymentMethod: 'daviplata', itemsSummary: 'Max', createdAt: new Date().toISOString() },
    { id: '4', orderCode: 'ORD-4', customerName: 'Dora', customerContact: '3004', totalCop: 15000, status: 'cancelada', paymentMethod: 'nequi', itemsSummary: 'Spotify', createdAt: new Date().toISOString() }
  ];

  it('calculates total revenue excluding cancelled orders', () => {
    const metrics = SalesRepository.calculateMonthlyMetrics(mockOrders);
    // 40000 + 20000 + 30000 = 90000 (cancelada excluded)
    expect(metrics.currentMonthRevenue).toBe(90000);
  });

  it('counts validated, completed and pending orders correctly', () => {
    const metrics = SalesRepository.calculateMonthlyMetrics(mockOrders);
    expect(metrics.currentMonthOrdersCount).toBe(4);
    expect(metrics.validatedOrdersCount).toBe(2); // 'completada' + 'validada'
    expect(metrics.pendingOrdersCount).toBe(1);
  });

  it('calculates average ticket accurately', () => {
    const metrics = SalesRepository.calculateMonthlyMetrics(mockOrders);
    // 90000 / 4 = 22500
    expect(metrics.averageTicket).toBe(22500);
  });

  it('handles empty orders list safely', () => {
    const metrics = SalesRepository.calculateMonthlyMetrics([]);
    expect(metrics.currentMonthRevenue).toBe(0);
    expect(metrics.currentMonthOrdersCount).toBe(0);
    expect(metrics.averageTicket).toBe(0);
  });
});
