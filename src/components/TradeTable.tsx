import React, { useState } from 'react';
import { TradeRecord } from '../types/trading';
import { formatIDR, formatPercent, formatIndonesianDate } from '../utils/formatters';
import { 
  Search, 
  Filter, 
  Star, 
  Trash2, 
  Edit3, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  ArrowUpDown,
  BookOpen
} from 'lucide-react';

interface TradeTableProps {
  trades: TradeRecord[];
  onEditTrade: (trade: TradeRecord) => void;
  onDeleteTrade: (id: string) => void;
  onViewEvaluation: (trade: TradeRecord) => void;
  selectedDateFilter?: string | null;
  onClearDateFilter?: () => void;
}

export const TradeTable: React.FC<TradeTableProps> = ({
  trades,
  onEditTrade,
  onDeleteTrade,
  onViewEvaluation,
  selectedDateFilter,
  onClearDateFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pairFilter, setPairFilter] = useState('ALL');
  const [resultFilter, setResultFilter] = useState<'ALL' | 'WIN' | 'LOSS'>('ALL');
  const [strategyFilter, setStrategyFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'date' | 'pnl' | 'pips'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Extract unique pairs and strategies
  const uniquePairs = Array.from(new Set(trades.map((t) => t.pair)));
  const uniqueStrategies = Array.from(new Set(trades.map((t) => t.strategy).filter(Boolean)));

  // Filter trades
  const filtered = trades.filter((t) => {
    if (selectedDateFilter && t.date !== selectedDateFilter) return false;
    if (pairFilter !== 'ALL' && t.pair !== pairFilter) return false;
    if (resultFilter === 'WIN' && t.pnlAmount <= 0) return false;
    if (resultFilter === 'LOSS' && t.pnlAmount >= 0) return false;
    if (strategyFilter !== 'ALL' && t.strategy !== strategyFilter) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        t.pair.toLowerCase().includes(q) ||
        t.strategy.toLowerCase().includes(q) ||
        t.notes.toLowerCase().includes(q) ||
        (t.mistakeTag && t.mistakeTag.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Sort trades
  const sorted = [...filtered].sort((a, b) => {
    let comp = 0;
    if (sortField === 'date') {
      comp = a.date.localeCompare(b.date);
      if (comp === 0) comp = (a.time || '').localeCompare(b.time || '');
    } else if (sortField === 'pnl') {
      comp = a.pnlAmount - b.pnlAmount;
    } else if (sortField === 'pips') {
      comp = a.pips - b.pips;
    }
    return sortOrder === 'desc' ? -comp : comp;
  });

  const toggleSort = (field: 'date' | 'pnl' | 'pips') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#111827] overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari pair, strategi, evaluasi..."
              className="w-full rounded-lg border border-slate-700 bg-slate-900/90 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Pair Filter */}
          <select
            value={pairFilter}
            onChange={(e) => setPairFilter(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900/90 px-2.5 py-1.5 text-xs text-slate-300 focus:border-emerald-500 focus:outline-none"
          >
            <option value="ALL">Semua Pair</option>
            {uniquePairs.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {/* Result Filter */}
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value as any)}
            className="rounded-lg border border-slate-700 bg-slate-900/90 px-2.5 py-1.5 text-xs text-slate-300 focus:border-emerald-500 focus:outline-none"
          >
            <option value="ALL">Semua Hasil</option>
            <option value="WIN">Profit Only</option>
            <option value="LOSS">Loss Only</option>
          </select>

          {/* Strategy Filter */}
          {uniqueStrategies.length > 0 && (
            <select
              value={strategyFilter}
              onChange={(e) => setStrategyFilter(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900/90 px-2.5 py-1.5 text-xs text-slate-300 focus:border-emerald-500 focus:outline-none max-w-[150px] truncate"
            >
              <option value="ALL">Semua Strategi</option>
              {uniqueStrategies.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}
        </div>

        {/* Date Filter Indicator */}
        {selectedDateFilter && (
          <div className="flex items-center gap-2 text-xs bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md text-emerald-400">
            <span>Filter Tanggal: {formatIndonesianDate(selectedDateFilter)}</span>
            {onClearDateFilter && (
              <button
                onClick={onClearDateFilter}
                className="text-xs text-slate-300 hover:text-white underline font-medium ml-1"
              >
                Hapus
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-medium select-none">
              <th className="py-3 px-3.5 whitespace-nowrap">
                <button
                  onClick={() => toggleSort('date')}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>Waktu & Tanggal</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3 px-3.5 whitespace-nowrap">Pair & Posisi</th>
              <th className="py-3 px-3.5 whitespace-nowrap">Lot</th>
              <th className="py-3 px-3.5 whitespace-nowrap">Entry / Exit</th>
              <th className="py-3 px-3.5 whitespace-nowrap">
                <button
                  onClick={() => toggleSort('pips')}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>Pips</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3 px-3.5 whitespace-nowrap text-right">
                <button
                  onClick={() => toggleSort('pnl')}
                  className="flex items-center gap-1 ml-auto hover:text-white transition-colors"
                >
                  <span>Untung / Rugi (IDR)</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="py-3 px-3.5 whitespace-nowrap">Strategi & Setup</th>
              <th className="py-3 px-3.5 whitespace-nowrap">Evaluasi & Catatan</th>
              <th className="py-3 px-3.5 whitespace-nowrap text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <BookOpen className="h-6 w-6 text-slate-600 mb-1" />
                    <span>Tidak ada catatan transaksi yang sesuai dengan filter</span>
                  </div>
                </td>
              </tr>
            ) : (
              sorted.map((t) => {
                const isProfit = t.pnlAmount > 0;
                const isLoss = t.pnlAmount < 0;

                return (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Waktu & Tanggal */}
                    <td className="py-3 px-3.5 whitespace-nowrap font-mono tabular-nums text-slate-300">
                      <div>{t.date}</div>
                      <div className="text-[10px] text-slate-500">{t.time || '-'}</div>
                    </td>

                    {/* Pair & Posisi */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white tracking-wide">{t.pair}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                            t.direction === 'BUY'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {t.direction}
                        </span>
                      </div>
                    </td>

                    {/* Lot Size */}
                    <td className="py-3 px-3.5 whitespace-nowrap font-mono tabular-nums text-slate-300">
                      {t.lot.toFixed(2)}
                    </td>

                    {/* Entry / Exit */}
                    <td className="py-3 px-3.5 whitespace-nowrap font-mono tabular-nums text-slate-300">
                      <div>{t.entryPrice}</div>
                      <div className="text-[10px] text-slate-500">Exit: {t.exitPrice}</div>
                    </td>

                    {/* Pips */}
                    <td className="py-3 px-3.5 whitespace-nowrap font-mono tabular-nums">
                      <span className={isProfit ? 'text-emerald-400 font-semibold' : isLoss ? 'text-rose-400 font-semibold' : 'text-slate-400'}>
                        {t.pips > 0 ? `+${t.pips.toFixed(1)}` : t.pips.toFixed(1)}
                      </span>
                    </td>

                    {/* PnL Amount (IDR) & Percentage */}
                    <td className="py-3 px-3.5 whitespace-nowrap text-right font-mono tabular-nums">
                      <div className={`text-sm font-bold ${
                        isProfit ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-slate-300'
                      }`}>
                        {formatIDR(t.pnlAmount, true)}
                      </div>
                      <div className={`text-[10px] font-semibold ${
                        isProfit ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-slate-500'
                      }`}>
                        {formatPercent(t.pnlPercentage, true)}
                      </div>
                    </td>

                    {/* Setup Strategi */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="text-slate-200 font-medium">{t.strategy || '-'}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        {t.rulesFollowed ? (
                          <span className="flex items-center gap-0.5 text-emerald-400">
                            <CheckCircle className="h-3 w-3" /> Disiplin
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-rose-400">
                            <AlertTriangle className="h-3 w-3" /> Melanggar Plan
                          </span>
                        )}
                        {t.mistakeTag && t.mistakeTag !== 'Disiplin Penuh' && (
                          <>
                            <span>·</span>
                            <span className="text-amber-400">{t.mistakeTag}</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Catatan Evaluasi Preview */}
                    <td className="py-3 px-3.5 max-w-[240px]">
                      <p className="truncate text-slate-300 text-xs" title={t.notes}>
                        {t.notes || '-'}
                      </p>
                      <div className="flex items-center gap-0.5 mt-1 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-2.5 w-2.5 ${
                              i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-3.5 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => onViewEvaluation(t)}
                          className="p-1 rounded text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                          title="Lihat Evaluasi Detail"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onEditTrade(t)}
                          className="p-1 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                          title="Edit Catatan"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTrade(t.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Hapus Catatan"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Count */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/40 text-xs text-slate-400 flex items-center justify-between">
        <span>Menampilkan {sorted.length} dari {trades.length} transaksi</span>
        <span className="font-mono tabular-nums">
          Total PnL Halaman: {formatIDR(sorted.reduce((acc, t) => acc + t.pnlAmount, 0), true)}
        </span>
      </div>
    </div>
  );
};
