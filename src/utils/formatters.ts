/**
 * Currency and Risk Quant Formatter Utilities
 * Strictly supports Indian Rupee (INR) representation: Crores (Cr), Lakhs (L), and Thousands (K)
 */

export function formatINR(val: number, options: { decimals?: number; currencySymbol?: string } = {}): string {
  const { decimals = 2, currencySymbol = '₹' } = options;
  if (val === undefined || val === null || isNaN(val)) return `${currencySymbol}0`;

  const absVal = Math.abs(val);
  const sign = val < 0 ? '-' : '';

  // 1 Crore = 10,000,000 (100 Lakhs)
  if (absVal >= 10000000) {
    const inCrores = absVal / 10000000;
    return `${sign}${currencySymbol}${inCrores.toFixed(decimals)} Cr`;
  }
  // 1 Lakh = 100,000
  else if (absVal >= 100000) {
    const inLakhs = absVal / 100000;
    return `${sign}${currencySymbol}${inLakhs.toFixed(decimals)} L`;
  }
  // Thousands
  else if (absVal >= 1000) {
    const inK = absVal / 1000;
    return `${sign}${currencySymbol}${inK.toFixed(1)} K`;
  }

  return `${sign}${currencySymbol}${absVal.toLocaleString('en-IN')}`;
}

export function formatPercent(val: number, decimals: number = 1): string {
  if (val === undefined || val === null || isNaN(val)) return '0.0%';
  return `${val.toFixed(decimals)}%`;
}

export function formatProbability(p: number): string {
  if (p === undefined || p === null || isNaN(p)) return '0.0%';
  return `${(p * 100).toFixed(1)}%`;
}

export function formatNumberIndian(val: number): string {
  if (val === undefined || val === null || isNaN(val)) return '0';
  return val.toLocaleString('en-IN');
}

export function formatKnapsackCurrency(val: number): string {
  if (val === undefined || val === null || isNaN(val) || val === 0) return '₹0';
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';

  if (abs >= 10000000) {
    const cr = abs / 10000000;
    return `${sign}₹${cr.toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    const l = abs / 100000;
    const str = l % 1 === 0 ? l.toFixed(0) : l.toFixed(1);
    return `${sign}₹${str} L`;
  }
  return `${sign}₹${abs.toLocaleString('en-IN')}`;
}
