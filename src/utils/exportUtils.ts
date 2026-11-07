import * as XLSX from 'xlsx';
import { TradeRecord, AccountConfig, MonthlyStats } from '../types/trading';
import { formatIDR, formatIndonesianDate } from './formatters';

export function exportTradesToExcel(
  trades: TradeRecord[],
  config: AccountConfig,
  stats: MonthlyStats,
  periodName: string
) {
  // Sheet 1: Detail Transaksi Harian
  const tradeRows = trades.map((t, idx) => ({
    'No': idx + 1,
    'Tanggal': t.date,
    'Jam': t.time || '-',
    'Pair': t.pair,
    'Posisi': t.direction,
    'Lot': t.lot,
    'Harga Entry': t.entryPrice,
    'Harga Exit': t.exitPrice,
    'Stop Loss': t.stopLoss || '-',
    'Take Profit': t.takeProfit || '-',
    'Pips': t.pips,
    'Profit / Rugi (IDR)': t.pnlAmount,
    'Persentase (%)': `${t.pnlPercentage.toFixed(2)}%`,
    'Setup Strategi': t.strategy,
    'Rating (1-5)': t.rating,
    'Disiplin Plan': t.rulesFollowed ? 'Ya' : 'Tidak',
    'Faktor / Kesalahan': t.mistakeTag || 'Disiplin',
    'Catatan & Evaluasi': t.notes,
  }));

  const tradesWs = XLSX.utils.json_to_sheet(tradeRows);

  // Set column widths for trade sheet
  tradesWs['!cols'] = [
    { wch: 5 },  // No
    { wch: 12 }, // Tanggal
    { wch: 8 },  // Jam
    { wch: 10 }, // Pair
    { wch: 8 },  // Posisi
    { wch: 8 },  // Lot
    { wch: 12 }, // Entry
    { wch: 12 }, // Exit
    { wch: 12 }, // SL
    { wch: 12 }, // TP
    { wch: 8 },  // Pips
    { wch: 18 }, // PnL IDR
    { wch: 14 }, // %
    { wch: 22 }, // Strategi
    { wch: 12 }, // Rating
    { wch: 12 }, // Disiplin
    { wch: 20 }, // Tag
    { wch: 45 }, // Evaluasi
  ];

  // Sheet 2: Ringkasan Performa & Statistik
  const summaryRows = [
    { 'Parameter Metrik': 'Nama Trader / Akun', 'Nilai': config.traderName },
    { 'Parameter Metrik': 'Nomor Akun Broker', 'Nilai': config.accountNumber || '-' },
    { 'Parameter Metrik': 'Periode Laporan', 'Nilai': periodName },
    { 'Parameter Metrik': 'Modal Awal (IDR)', 'Nilai': formatIDR(config.initialBalance) },
    { 'Parameter Metrik': 'Total Net Profit / Rugi (IDR)', 'Nilai': formatIDR(stats.totalNetPnl, true) },
    { 'Parameter Metrik': 'Persentase Pertumbuhan Modal (%)', 'Nilai': `${stats.netPnlPercentage.toFixed(2)}%` },
    { 'Parameter Metrik': 'Target Bulanan (%)', 'Nilai': `${config.targetMonthlyPct}%` },
    { 'Parameter Metrik': 'Status Target', 'Nilai': stats.netPnlPercentage >= config.targetMonthlyPct ? 'Tercapai (Target Hit)' : 'Dalam Proses' },
    { 'Parameter Metrik': 'Total Transaksi', 'Nilai': stats.totalTrades },
    { 'Parameter Metrik': 'Transaksi Menang (Win)', 'Nilai': `${stats.winTrades} (${stats.winRate.toFixed(1)}%)` },
    { 'Parameter Metrik': 'Transaksi Rugi (Loss)', 'Nilai': `${stats.lossTrades} (${(100 - stats.winRate).toFixed(1)}%)` },
    { 'Parameter Metrik': 'Profit Factor', 'Nilai': stats.profitFactor.toFixed(2) },
    { 'Parameter Metrik': 'Rata-rata Profit (Win Trade)', 'Nilai': formatIDR(stats.avgWin) },
    { 'Parameter Metrik': 'Rata-rata Loss (Loss Trade)', 'Nilai': formatIDR(stats.avgLoss) },
    { 'Parameter Metrik': 'Trade Terbaik (Best Trade)', 'Nilai': formatIDR(stats.bestTrade, true) },
    { 'Parameter Metrik': 'Trade Terburuk (Worst Trade)', 'Nilai': formatIDR(stats.worstTrade) },
  ];

  const summaryWs = XLSX.utils.json_to_sheet(summaryRows);
  summaryWs['!cols'] = [
    { wch: 35 },
    { wch: 30 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, tradesWs, 'Rekap Transaksi');
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Ringkasan Performa');

  const cleanFileName = `TradeVault_Rekap_${periodName.replace(/\s+/g, '_')}.xlsx`;
  XLSX.writeFile(wb, cleanFileName);
}
