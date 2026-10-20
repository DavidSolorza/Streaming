import { calculateRecursiveTierDiscount } from './recursiveComboEngine';

export class ComboEngine {
  static calculateComboDiscount(selectedPlatforms: string[]): { discountPct: number; label: string } {
    return calculateRecursiveTierDiscount(selectedPlatforms.length);
  }
}
