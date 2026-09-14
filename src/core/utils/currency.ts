/**
 * Formateador estándar de moneda para Colombia (COP)
 * Formatea valores numéricos en cadenas de texto legible con el símbolo de peso y separador de miles.
 * Ejemplo: 32000 -> "$ 32.000"
 */
export const formatCOP = (valor: number): string => {
  if (isNaN(valor) || valor === null || valor === undefined) {
    return '$ 0 COP';
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor);
};
