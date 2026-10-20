import { describe, it, expect, beforeEach } from 'vitest';
import { ReviewRepository } from '../reviewRepository';

const storageMap: Record<string, string> = {};
globalThis.localStorage = {
  getItem: (key: string) => storageMap[key] || null,
  setItem: (key: string, val: string) => { storageMap[key] = val; },
  removeItem: (key: string) => { delete storageMap[key]; },
  clear: () => { Object.keys(storageMap).forEach(k => delete storageMap[k]); },
  key: () => null,
  length: 0
};

describe('ReviewRepository (Native HTTP & Fallback)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads seed reviews when cache is empty', async () => {
    const reviews = await ReviewRepository.getReviews();
    expect(reviews.length).toBeGreaterThanOrEqual(4);
    expect(reviews[0].name).toBeDefined();
    expect(reviews[0].rating).toBe(5);
  });

  it('adds a new review and preserves properties', async () => {
    const created = await ReviewRepository.addReview({
      name: 'Cliente Test',
      city: 'Barranquilla',
      product: 'Netflix 4K',
      comment: 'Servicio impecable y rápido',
      rating: 5,
      avatarBg: 'bg-teal-500',
      initials: 'CT',
      isApproved: true,
      isUserCreated: true
    });
    expect(created.id).toBeDefined();
    expect(created.name).toBe('Cliente Test');

    const all = await ReviewRepository.getReviews();
    expect(all.some(r => r.name === 'Cliente Test')).toBe(true);
  });

  it('toggles review approval state properly', async () => {
    const reviews = await ReviewRepository.getReviews();
    const first = reviews[0];
    const originalState = first.isApproved;

    await ReviewRepository.toggleApproval(first.id, !originalState);
    const updated = await ReviewRepository.getReviews();
    const target = updated.find(r => r.id === first.id);
    expect(target?.isApproved).toBe(!originalState);
  });

  it('deletes review from persistence', async () => {
    const reviews = await ReviewRepository.getReviews();
    const targetId = reviews[0].id;

    await ReviewRepository.deleteReview(targetId);
    const afterDelete = await ReviewRepository.getReviews();
    expect(afterDelete.some(r => r.id === targetId)).toBe(false);
  });
});
