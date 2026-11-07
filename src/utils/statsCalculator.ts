import { TradeRecord, MonthlyStats, AccountConfig } from '../types/trading';

export function calculateStats(
  trades: TradeRecord[],
  initialBalance: number,
  monthKey: string = 'all',
  monthName: string = 'Semua Periode'
): MonthlyStats {
  const filtered = monthKey === 'all'
    ? trades
    : trades.filter((t) => t.date.startsWith(monthKey));

  const totalTrades = filtered.length;
  if (totalTrades === 0) {
    return {
      monthKey,
      monthName,
      totalTrades: 0,
      winTrades: 0,
      lossTrades: 0,
      bepTrades: 0,
      winRate: 0,
      totalNetPnl: 0,
      netPnlPercentage: 0,
      grossProfit: 0,
      grossLoss: 0,
      profitFactor: 0,
      avgWin: 0,
      avgLoss: 0,
      maxDrawdownPct: 0,
      bestTrade: 0,
      worstTrade: 0,
      avgHoldingTradesPerDay: 0,
    };
  }

  let winTrades = 0;
  let lossTrades = 0;
  let bepTrades = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  let totalNetPnl = 0;
  let bestTrade = -Infinity;
  let worstTrade = Infinity;

  filtered.forEach((t) => {
    totalNetPnl += t.pnlAmount;
    if (t.pnlAmount > 0) {
      winTrades++;
      grossProfit += t.pnlAmount;
      if (t.pnlAmount > bestTrade) bestTrade = t.pnlAmount;
    } else if (t.pnlAmount < 0) {
      lossTrades++;
      grossLoss += Math.abs(t.pnlAmount);
      if (t.pnlAmount < worstTrade) worstTrade = t.pnlAmount;
    } else {
      bepTrades++;
    }
  });

  const winRate = totalTrades > 0 ? (winTrades / totalTrades) * 100 : 0;
  const netPnlPercentage = initialBalance > 0 ? (totalNetPnl / initialBalance) * 100 : 0;
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 99.9 : 0;
  const avgWin = winTrades > 0 ? grossProfit / winTrades : 0;
  const avgLoss = lossTrades > 0 ? grossLoss / lossTrades : 0;

  // Calculate maximum drawdown from equity curve
  let peak = initialBalance;
  let maxDrawdown = 0;
  let runningBal = initialBalance;

  // Sort chronologically
  const sorted = [...filtered].sort((a, b) => {
    const dComp = a.date.localeCompare(b.date);
    if (dComp !== 0) return dComp;
    return (a.time || '').localeCompare(b.time || '');
  });

  sorted.forEach((t) => {
    runningBal += t.pnlAmount;
    if (runningBal > peak) {
      peak = runningBal;
    }
    const dd = peak > 0 ? ((peak - runningBal) / peak) * 100 : 0;
    if (dd > maxDrawdown) {
      maxDrawdown = dd;
    }
  });

  return {
    monthKey,
    monthName,
    totalTrades,
    winTrades,
    lossTrades,
    bepTrades,
    winRate,
    totalNetPnl,
    netPnlPercentage,
    grossProfit,
    grossLoss,
    profitFactor,
    avgWin,
    avgLoss,
    maxDrawdownPct: maxDrawdown,
    bestTrade: bestTrade === -Infinity ? 0 : bestTrade,
    worstTrade: worstTrade === Infinity ? 0 : worstTrade,
    avgHoldingTradesPerDay: 1,
  };
}

export interface DailySummary {
  date: string;
  totalPnl: number;
  tradeCount: number;
  wins: number;
  losses: number;
  isProfit: boolean;
}

export function getDailySummaries(trades: TradeRecord[], monthKey?: string): Record<string, DailySummary> {
  const filtered = monthKey && monthKey !== 'all'
    ? trades.filter((t) => t.date.startsWith(monthKey))
    : trades;

  const result: Record<string, DailySummary> = {};

  filtered.forEach((t) => {
    if (!result[t.date]) {
      result[t.date] = {
        date: t.date,
        totalPnl: 0,
        tradeCount: 0,
        wins: 0,
        losses: 0,
        isProfit: false,
      };
    }
    result[t.date].totalPnl += t.pnlAmount;
    result[t.date].tradeCount += 1;
    if (t.pnlAmount > 0) result[t.date].wins += 1;
    if (t.pnlAmount < 0) result[t.date].losses += 1;
    result[t.date].isProfit = result[t.date].totalPnl >= 0;
  });

  return result;
}

export interface EquityPoint {
  index: number;
  date: string;
  pnl: number;
  balance: number;
  tradePair?: string;
  tradeDesc?: string;
}

export function getEquityCurve(trades: TradeRecord[], initialBalance: number, monthKey?: string): EquityPoint[] {
  const filtered = monthKey && monthKey !== 'all'
    ? trades.filter((t) => t.date.startsWith(monthKey))
    : trades;

  const sorted = [...filtered].sort((a, b) => {
    const dComp = a.date.localeCompare(b.date);
    if (dComp !== 0) return dComp;
    return (a.time || '').localeCompare(b.time || '');
  });

  let runningBalance = initialBalance;
  const points: EquityPoint[] = [
    {
      index: 0,
      date: sorted[0]?.date ? `Mulai` : 'Start',
      pnl: 0,
      balance: initialBalance,
    },
  ];

  sorted.forEach((t, i) => {
    runningBalance += t.pnlAmount;
    points.push({
      index: i + 1,
      date: t.date,
      pnl: t.pnlAmount,
      balance: runningBalance,
      tradePair: t.pair,
      tradeDesc: `${t.direction} ${t.pair} (${t.lot} Lot)`,
    });
  });

  return points;
}
