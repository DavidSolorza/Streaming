import { describe, it, expect } from 'vitest';
import { CartValidator } from '../cartValidator';
import { CartItem } from '../../entities/CartItem';

describe('CartValidator', () => {
  it('identifies demo and test accounts correctly', () => {
    expect(CartValidator.isTestItem({ id: 1, name: 'Prueba Stripe 1000 COP' })).toBe(true);
    expect(CartValidator.isTestItem({ id: 99, name: 'Netflix Demo Test' })).toBe(true);
    expect(CartValidator.isTestItem({ id: 5, name: 'Disney+ Premium' })).toBe(false);
  });

  it('enforces maximum 1 unit for test services', () => {
    expect(CartValidator.getMaxQuantity({ id: 1, name: 'Prueba' })).toBe(1);
    expect(CartValidator.getMaxQuantity({ id: 5, name: 'Netflix' })).toBe(10);
  });

  it('rejects cart with more than 1 test item', () => {
    const items: CartItem[] = [
      { cartItemId: 'c1', id: 1, name: 'Prueba Stripe', price: 1000, quantity: 2, image: '' }
    ];
    const result = CartValidator.validateCart(items);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('máximo 1 unidad');
  });

  it('rejects cart with zero or negative quantity', () => {
    const items: CartItem[] = [
      { cartItemId: 'c2', id: 2, name: 'Netflix', price: 17000, quantity: 0, image: '' }
    ];
    const result = CartValidator.validateCart(items);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('mayor a 0');
  });

  it('accepts valid cart with regular quantities', () => {
    const items: CartItem[] = [
      { cartItemId: 'c3', id: 2, name: 'Netflix', price: 17000, quantity: 2, image: '' },
      { cartItemId: 'c4', id: 3, name: 'Disney+', price: 16000, quantity: 1, image: '' }
    ];
    const result = CartValidator.validateCart(items);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});
