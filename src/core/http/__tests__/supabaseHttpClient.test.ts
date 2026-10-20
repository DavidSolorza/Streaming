import { describe, it, expect } from 'vitest';
import { SupabaseHttpClient } from '../supabaseHttpClient';

describe('SupabaseHttpClient (Zero SDK Architecture)', () => {
  it('returns null gracefully when Supabase is not configured or dummy URL', async () => {
    const result = await SupabaseHttpClient.select('sales_orders');
    expect(result).toBeNull();
  });

  it('handles insert gracefully without throwing when unconfigured', async () => {
    const result = await SupabaseHttpClient.insert('sales_orders', { order_code: 'TEST' });
    expect(result).toBeNull();
  });

  it('handles update gracefully without throwing when unconfigured', async () => {
    const result = await SupabaseHttpClient.update('sales_orders', '1', { status: 'completada' });
    expect(result).toBeNull();
  });

  it('handles delete gracefully returning false when unconfigured', async () => {
    const result = await SupabaseHttpClient.delete('sales_orders', '1');
    expect(result).toBe(false);
  });
});
