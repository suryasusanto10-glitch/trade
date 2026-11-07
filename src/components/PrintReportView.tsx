import React from 'react';
import { TradeRecord, AccountConfig, MonthlyStats } from '../types/trading';
import { formatIDR, formatPercent, formatIndonesianDate } from '../utils/formatters';
import { Printer, ArrowLeft } from 'lucide-react';

interface PrintReportViewProps {
  trades: TradeRecord[];
  config: AccountConfig;
  stats: MonthlyStats;
  periodName: string;
  onBack: () => void;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  trades,
  config,
  stats,
  periodName,
  onBack,
}) => {
  const currentBalance = config.initialBalance + stats.totalNetPnl;
  const isNetProfit = stats.totalNetPnl >= 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      {/* Top Floating Action Bar (Hidden on print) */}
      <div className="no-print max-w-5xl mx-auto mb-6 flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-[#111827] shadow-lg">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Jurnal</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            Gunakan opsi "Save as PDF" pada jendela cetak browser
          </span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet (A4 Container) */}
      <div className="max-w-5xl mx-auto bg-white text-slate-900 rounded-xl p-8 sm:p-12 shadow-2xl print:shadow-none print:p-0 print:m-0 print:max-w-none">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-slate-900 gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
              TradeVault Performance Journal
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Laporan Rekapitulasi Hasil Trading Harian & Evaluasi Strategi (Forex & XAU/USD)
            </p>
          </div>
          <div className="text-left sm:text-right text-xs text-slate-600">
            <div><strong>Periode:</strong> {periodName}</div>
            <div><strong>Tanggal Cetak:</strong> {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</div>
          </div>
        </div>

        {/* Trader & Account Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block">Nama Trader</span>
            <span className="font-bold text-slate-900">{config.traderName}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Nomor Akun MT5/Broker</span>
            <span className="font-mono font-bold text-slate-900">{config.accountNumber || '-'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Modal Awal</span>
            <span className="font-mono font-bold text-slate-900">{formatIDR(config.initialBalance)}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Saldo Terkini</span>
            <span className="font-mono font-bold text-slate-900">{formatIDR(currentBalance)}</span>
          </div>
        </div>

        {/* Executive Summary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-200">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block font-semibold">TOTAL NET PnL</span>
            <div className={`text-xl font-black font-mono mt-1 ${isNetProfit ? 'text-emerald-700' : 'text-rose-700'}`}>
              {formatIDR(stats.totalNetPnl, true)}
            </div>
            <span className="text-xs font-semibold text-slate-600 font-mono">
              Return: {formatPercent(stats.netPnlPercentage, true)}
            </span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block font-semibold">WIN RATE</span>
            <div className="text-xl font-black font-mono mt-1 text-slate-900">
              {stats.winRate.toFixed(1)}%
            </div>
            <span className="text-xs text-slate-600 font-mono">
              {stats.winTrades} Win · {stats.lossTrades} Loss
            </span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block font-semibold">PROFIT FACTOR</span>
            <div className="text-xl font-black font-mono mt-1 text-slate-900">
              {stats.profitFactor.toFixed(2)}
            </div>
            <span className="text-xs text-slate-600 font-mono">
              Avg Win: {formatIDR(stats.avgWin)}
            </span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block font-semibold">MAX DRAWDOWN</span>
            <div className="text-xl font-black font-mono mt-1 text-rose-700">
              {stats.maxDrawdownPct.toFixed(1)}%
            </div>
            <span className="text-xs text-slate-600 font-mono">
              Target: {config.targetMonthlyPct}%
            </span>
          </div>
        </div>

        {/* Detail Rekap Transaksi */}
        <div className="py-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
            Rincian Log Transaksi Harian
          </h2>
          
          <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <th className="p-2 border-r border-slate-300">No</th>
                <th className="p-2 border-r border-slate-300">Tanggal</th>
                <th className="p-2 border-r border-slate-300">Pair & Posisi</th>
                <th className="p-2 border-r border-slate-300">Lot</th>
                <th className="p-2 border-r border-slate-300">Entry / Exit</th>
                <th className="p-2 border-r border-slate-300">Pips</th>
                <th className="p-2 border-r border-slate-300 text-right">Net PnL (IDR)</th>
                <th className="p-2 border-r border-slate-300">Strategi</th>
                <th className="p-2">Evaluasi & Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {trades.map((t, idx) => {
                const isProf = t.pnlAmount >= 0;
                return (
                  <tr key={t.id} className="print-break-inside-avoid">
                    <td className="p-2 border-r border-slate-200 text-slate-500">{idx + 1}</td>
                    <td className="p-2 border-r border-slate-200 font-mono">{t.date}</td>
                    <td className="p-2 border-r border-slate-200 font-bold">
                      {t.pair} <span className={t.direction === 'BUY' ? 'text-emerald-700' : 'text-rose-700'}>({t.direction})</span>
                    </td>
                    <td className="p-2 border-r border-slate-200 font-mono">{t.lot}</td>
                    <td className="p-2 border-r border-slate-200 font-mono">{t.entryPrice} / {t.exitPrice}</td>
                    <td className="p-2 border-r border-slate-200 font-mono">
                      {t.pips > 0 ? `+${t.pips.toFixed(1)}` : t.pips.toFixed(1)}
                    </td>
                    <td className={`p-2 border-r border-slate-200 font-mono font-bold text-right ${
                      isProf ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {formatIDR(t.pnlAmount, true)}
                    </td>
                    <td className="p-2 border-r border-slate-200 font-medium">{t.strategy}</td>
                    <td className="p-2 text-slate-700 text-[10px] leading-tight">{t.notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Signature & Validation Footer */}
        <div className="pt-8 mt-6 border-t border-slate-300 flex justify-between items-end text-xs text-slate-600 print-break-inside-avoid">
          <div>
            <p className="font-semibold text-slate-900">Catatan Evaluator:</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Laporan ini dibuat otomatis melalui sistem jurnal analitik TradeVault.
            </p>
          </div>
          <div className="text-center w-48">
            <div className="h-14 border-b border-slate-400 mb-1" />
            <span className="font-bold text-slate-900">{config.traderName}</span>
            <span className="block text-[10px] text-slate-500">Trader Mandiri</span>
          </div>
        </div>

      </div>
    </div>
  );
};
