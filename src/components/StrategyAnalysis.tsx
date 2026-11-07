import React from 'react';
import { TradeRecord } from '../types/trading';
import { formatIDR, formatPercent } from '../utils/formatters';
import { ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

interface StrategyAnalysisProps {
  trades: TradeRecord[];
}

export const StrategyAnalysis: React.FC<StrategyAnalysisProps> = ({ trades }) => {
  // Group by Strategy
  const strategyStats: Record<string, {
    count: number;
    wins: number;
    losses: number;
    totalPnl: number;
    totalPips: number;
  }> = {};

  // Group by Discipline / Mistakes
  const mistakeStats: Record<string, {
    count: number;
    totalPnl: number;
    losses: number;
  }> = {};

  let disciplinedCount = 0;
  let undisciplinedCount = 0;
  let disciplinedPnl = 0;
  let undisciplinedPnl = 0;

  trades.forEach((t) => {
    // Strategy grouping
    const strat = t.strategy || 'Tanpa Kategori';
    if (!strategyStats[strat]) {
      strategyStats[strat] = { count: 0, wins: 0, losses: 0, totalPnl: 0, totalPips: 0 };
    }
    strategyStats[strat].count += 1;
    strategyStats[strat].totalPnl += t.pnlAmount;
    strategyStats[strat].totalPips += t.pips;
    if (t.pnlAmount > 0) strategyStats[strat].wins += 1;
    if (t.pnlAmount < 0) strategyStats[strat].losses += 1;

    // Discipline grouping
    if (t.rulesFollowed) {
      disciplinedCount++;
      disciplinedPnl += t.pnlAmount;
    } else {
      undisciplinedCount++;
      undisciplinedPnl += t.pnlAmount;
    }

    // Mistake tag grouping
    const tag = t.mistakeTag || (t.rulesFollowed ? 'Disiplin Penuh' : 'Melanggar Plan');
    if (!mistakeStats[tag]) {
      mistakeStats[tag] = { count: 0, totalPnl: 0, losses: 0 };
    }
    mistakeStats[tag].count += 1;
    mistakeStats[tag].totalPnl += t.pnlAmount;
    if (t.pnlAmount < 0) mistakeStats[tag].losses += 1;
  });

  const sortedStrategies = Object.entries(strategyStats).sort((a, b) => b[1].totalPnl - a[1].totalPnl);
  const sortedMistakes = Object.entries(mistakeStats).sort((a, b) => a[1].totalPnl - b[1].totalPnl);

  return (
    <div className="space-y-6">
      {/* Overview Cards: Disiplin vs Melanggar Rencana */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Disiplin */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>Transaksi Disiplin (Sesuai Trading Plan)</span>
            </span>
            <span className="text-xs font-mono text-emerald-300 font-bold tabular-nums">
              {disciplinedCount} Transaksi ({trades.length > 0 ? ((disciplinedCount / trades.length) * 100).toFixed(0) : 0}%)
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-3 tabular-nums">
            {formatIDR(disciplinedPnl, true)}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Hasil keuntungan akumulatif yang didapatkan saat Anda disiplin mengikuti checklist dan aturan risk management.
          </p>
        </div>

        {/* Melanggar Plan / Emosional */}
        <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              <span>Transaksi Melanggar Rencana (FOMO / Emosi)</span>
            </span>
            <span className="text-xs font-mono text-rose-300 font-bold tabular-nums">
              {undisciplinedCount} Transaksi ({trades.length > 0 ? ((undisciplinedCount / trades.length) * 100).toFixed(0) : 0}%)
            </span>
          </div>
          <div className={`text-2xl font-bold font-mono mt-3 tabular-nums ${
            undisciplinedPnl >= 0 ? 'text-slate-200' : 'text-rose-400'
          }`}>
            {formatIDR(undisciplinedPnl, true)}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Dampak finansial dari transaksi yang dipicu emosi, mengejar harga, overlot, atau menggeser stop loss.
          </p>
        </div>
      </div>

      {/* Tabel Performa Per Strategi */}
      <div className="rounded-xl border border-slate-800 bg-[#111827] overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-white">
            Evaluasi Efektivitas Setup Strategi
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Menganalisis setup mana yang menghasilkan win rate tertinggi dan kontribusi profit terbesar
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-medium">
                <th className="py-3 px-4">Nama Strategi</th>
                <th className="py-3 px-4 text-center">Jumlah Trade</th>
                <th className="py-3 px-4 text-center">Win / Loss</th>
                <th className="py-3 px-4 text-center">Win Rate (%)</th>
                <th className="py-3 px-4 text-right">Total Pips</th>
                <th className="py-3 px-4 text-right">Total Net PnL (IDR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {sortedStrategies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Belum ada data strategi yang dicatat
                  </td>
                </tr>
              ) : (
                sortedStrategies.map(([strat, st]) => {
                  const wr = st.count > 0 ? (st.wins / st.count) * 100 : 0;
                  const isProfit = st.totalPnl >= 0;

                  return (
                    <tr key={strat} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">
                        {strat}
                      </td>
                      <td className="py-3 px-4 text-center font-mono tabular-nums">
                        {st.count}
                      </td>
                      <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-400">
                        <span className="text-emerald-400">{st.wins}W</span> · <span className="text-rose-400">{st.losses}L</span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono tabular-nums font-semibold">
                        <span className={wr >= 50 ? 'text-emerald-400' : 'text-amber-400'}>
                          {wr.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        {st.totalPips > 0 ? `+${st.totalPips.toFixed(1)}` : st.totalPips.toFixed(1)}
                      </td>
                      <td className={`py-3 px-4 text-right font-mono font-bold tabular-nums ${
                        isProfit ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {formatIDR(st.totalPnl, true)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabel Analisis Kebocoran / Kesalahan Psikologi */}
      <div className="rounded-xl border border-slate-800 bg-[#111827] overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            <span>Audit Faktor Psikologi & Evaluasi Kesalahan</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Identifikasi pola kelemahan eksekusi untuk evaluasi dan perbaikan jurnal mingguan
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-medium">
                <th className="py-3 px-4">Faktor / Tag Kesalahan</th>
                <th className="py-3 px-4 text-center">Frekuensi Transaksi</th>
                <th className="py-3 px-4 text-center">Total Rugi (Loss Trades)</th>
                <th className="py-3 px-4 text-right">Net PnL (IDR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {sortedMistakes.map(([tag, st]) => {
                const isLoss = st.totalPnl < 0;
                return (
                  <tr key={tag} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${tag === 'Disiplin Penuh' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      <span>{tag}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums">
                      {st.count} kali
                    </td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums text-rose-400">
                      {st.losses} trade
                    </td>
                    <td className={`py-3 px-4 text-right font-mono font-bold tabular-nums ${
                      !isLoss ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {formatIDR(st.totalPnl, true)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
