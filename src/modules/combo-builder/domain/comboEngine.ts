export class ComboEngine {
  static calculateComboDiscount(selectedPlatforms: string[]): { discountPct: number; label: string } {
    const count = selectedPlatforms.length;
    if (count >= 4) {
      return { discountPct: 35, label: 'Descuento Máximo Combo 4+ (35% OFF)' };
    } else if (count === 3) {
      return { discountPct: 25, label: 'Descuento Trío (25% OFF)' };
    } else if (count === 2) {
      return { discountPct: 15, label: 'Descuento Dúo (15% OFF)' };
    }
    return { discountPct: 0, label: 'Selecciona al menos 2 plataformas' };
  }
}
