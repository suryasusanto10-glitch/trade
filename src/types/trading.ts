export type TradeDirection = 'BUY' | 'SELL';

export type TradeResult = 'WIN' | 'LOSS' | 'BEP';

export interface TradeRecord {
  id: string;
  date: string;          // YYYY-MM-DD
  time: string;          // HH:mm
  pair: string;          // e.g. "XAU/USD", "EUR/USD", "GBP/USD", "USD/JPY", "GBP/JPY"
  direction: TradeDirection;
  lot: number;           // e.g. 0.10
  entryPrice: number;
  exitPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  pnlAmount: number;     // IDR (Rupiah), positive for win, negative for loss
  pnlPercentage: number; // % terhadap saldo akun saat transaksi
  pips: number;
  strategy: string;      // e.g. "Breakout SnR", "SMC Order Block", "Pullback EMA", "Scalping News"
  rating: number;        // 1 to 5 stars
  rulesFollowed: boolean;// Apakah disiplin mengikuti trading plan
  notes: string;         // Evaluasi strategi, kondisi market, dll.
  mistakeTag?: string;   // e.g. "Disiplin Penuh", "FOMO", "Geser Stop Loss", "Overlot", "Terlalu Cepat Close", "Revenge Trade"
}

export interface AccountConfig {
  initialBalance: number;  // Modal awal dalam IDR (e.g. 50000000)
  targetMonthlyPct: number;// Target profit bulanan % (e.g. 10%)
  usdToIdrRate: number;    // Kurs konversi (e.g. 16000)
  traderName: string;      // Nama trader untuk laporan
  accountNumber?: string;  // No akun broker (opsional)
}

export interface MonthlyStats {
  monthKey: string;        // "YYYY-MM"
  monthName: string;       // "November 2026"
  totalTrades: number;
  winTrades: number;
  lossTrades: number;
  bepTrades: number;
  winRate: number;         // percentage (0 - 100)
  totalNetPnl: number;     // IDR
  netPnlPercentage: number;// % from initial balance
  grossProfit: number;     // IDR sum of wins
  grossLoss: number;       // IDR sum of losses (positive number)
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  maxDrawdownPct: number;
  bestTrade: number;
  worstTrade: number;
  avgHoldingTradesPerDay: number;
}
