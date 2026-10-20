export type DurationKey = '1m' | '3m' | '6m' | '12m';

export class PlanDuration {
  static getLabel(duration: DurationKey): string {
    switch (duration) {
      case '1m': return '1 Mes';
      case '3m': return '3 Meses';
      case '6m': return '6 Meses';
      case '12m': return '12 Meses (Anual)';
    }
  }

  static getDiscountPercentage(duration: DurationKey): number {
    switch (duration) {
      case '1m': return 0;
      case '3m': return 15;
      case '6m': return 25;
      case '12m': return 35;
    }
  }
}
