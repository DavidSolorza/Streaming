export interface DiscountTier {
  minCount: number;
  pct: number;
  label: string;
}

const DISCOUNT_TIERS: DiscountTier[] = [
  { minCount: 4, pct: 35, label: 'Descuento Máximo Combo 4+ (35% OFF)' },
  { minCount: 3, pct: 25, label: 'Descuento Trío (25% OFF)' },
  { minCount: 2, pct: 15, label: 'Descuento Dúo (15% OFF)' },
];

/**
 * 🔄 Algoritmo Recursivo para evaluar niveles de descuento de combos
 */
export function calculateRecursiveTierDiscount(
  count: number,
  tiers: DiscountTier[] = DISCOUNT_TIERS,
  index: number = 0
): { discountPct: number; label: string } {
  if (index >= tiers.length) {
    return { discountPct: 0, label: 'Selecciona al menos 2 plataformas' };
  }
  const currentTier = tiers[index];
  if (count >= currentTier.minCount) {
    return { discountPct: currentTier.pct, label: currentTier.label };
  }
  // Paso recursivo
  return calculateRecursiveTierDiscount(count, tiers, index + 1);
}
