import { TradeDirection } from '../types/trading';

export function formatIDR(amount: number, showPlusSign: boolean = false): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absAmount);

  if (isNegative) {
    return `- ${formatted}`;
  }
  if (showPlusSign && amount > 0) {
    return `+ ${formatted}`;
  }
  return formatted;
}

export function formatPercent(value: number, showPlusSign: boolean = false): string {
  const sign = showPlusSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(val: number, decimals: number = 2): string {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

export function calculatePips(pair: string, direction: TradeDirection, entry: number, exit: number): number {
  if (!entry || !exit) return 0;
  
  const diff = direction === 'BUY' ? exit - entry : entry - exit;
  const cleanPair = pair.toUpperCase().replace('/', '');

  // Emas XAU/USD: 1 point = $1 = 10 pips atau 0.10 per pip
  if (cleanPair.includes('XAU') || cleanPair.includes('GOLD')) {
    return parseFloat((diff * 10).toFixed(1));
  }

  // JPY pairs: 1 pip = 0.01 (2nd decimal place)
  if (cleanPair.includes('JPY')) {
    return parseFloat((diff * 100).toFixed(1));
  }

  // Standard forex (EUR/USD, GBP/USD, etc.): 1 pip = 0.0001 (4th decimal place)
  return parseFloat((diff * 10000).toFixed(1));
}

export function estimatePnlIDR(
  pair: string,
  direction: TradeDirection,
  lot: number,
  entry: number,
  exit: number,
  usdToIdrRate: number = 16000
): number {
  if (!lot || !entry || !exit) return 0;
  
  const pips = calculatePips(pair, direction, entry, exit);
  const cleanPair = pair.toUpperCase().replace('/', '');

  let usdPerPip = 10 * lot; // standard 1 pip value on 1 standard lot = $10

  if (cleanPair.includes('XAU') || cleanPair.includes('GOLD')) {
    // 1 standard lot emas (100 oz): pergerakan $1.00 = $100 -> per pip (0.1) = $10
    usdPerPip = 10 * lot;
  }

  const pnlUSD = pips * (usdPerPip / (cleanPair.includes('JPY') ? 1 : 1));
  return Math.round(pnlUSD * usdToIdrRate);
}

export const INDONESIAN_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function formatIndonesianDate(dateString: string): string {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parts[2];
  return `${day} ${INDONESIAN_MONTHS[monthIdx] || parts[1]} ${year}`;
}
