import React from 'react';
import { TradeRecord } from '../types/trading';
import { formatIDR, formatPercent, formatIndonesianDate } from '../utils/formatters';
import { X, Star, CheckCircle, AlertTriangle, ArrowUpRight, ArrowDownRight, Clock, Tag } from 'lucide-react';

interface EvaluationDetailModalProps {
  trade: TradeRecord | null;
  onClose: () => void;
  onEdit: (trade: TradeRecord) => void;
}

export const EvaluationDetailModal: React.FC<EvaluationDetailModalProps> = ({
  trade,
  onClose,
  onEdit,
}) => {
  if (!trade) return null;

  const isProfit = trade.pnlAmount >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-[#111827] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0e1422]">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white tracking-tight">{trade.pair}</span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold tracking-wider ${
                trade.direction === 'BUY'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}
            >
              {trade.direction}
            </span>
            <span className="text-xs text-slate-400">· {trade.lot} Lot</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Main Profit / Loss Card */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isProfit
              ? 'border-emerald-500/20 bg-emerald-950/20'
              : 'border-rose-500/20 bg-rose-950/20'
          }`}>
            <div>
              <span className="text-xs text-slate-400">Hasil Bersih Transaksi</span>
              <div className={`text-2xl font-bold font-mono tracking-tight tabular-nums mt-0.5 ${
                isProfit ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {formatIDR(trade.pnlAmount, true)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Return & Pips</span>
              <div className={`text-sm font-bold font-mono tabular-nums ${
                isProfit ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {formatPercent(trade.pnlPercentage, true)}
              </div>
              <div className="text-xs font-mono text-slate-300 tabular-nums">
                {trade.pips > 0 ? `+${trade.pips.toFixed(1)}` : trade.pips.toFixed(1)} Pips
              </div>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/60">
              <span className="text-slate-400 block text-[11px]">Entry Price</span>
              <span className="text-white font-mono font-bold">{trade.entryPrice}</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/60">
              <span className="text-slate-400 block text-[11px]">Exit Price</span>
              <span className="text-white font-mono font-bold">{trade.exitPrice}</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/60">
              <span className="text-slate-400 block text-[11px]">Stop Loss</span>
              <span className="text-rose-400 font-mono font-bold">{trade.stopLoss || '-'}</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/60">
              <span className="text-slate-400 block text-[11px]">Take Profit</span>
              <span className="text-emerald-400 font-mono font-bold">{trade.takeProfit || '-'}</span>
            </div>
          </div>

          {/* Meta & Execution Discipline */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Tanggal & Jam Eksekusi
              </span>
              <span className="text-slate-200 font-mono">
                {formatIndonesianDate(trade.date)} {trade.time && `· ${trade.time}`}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" /> Setup Strategi
              </span>
              <span className="text-white font-semibold">
                {trade.strategy || '-'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Kepatuhan Trading Plan</span>
              <div>
                {trade.rulesFollowed ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle className="h-3.5 w-3.5" /> Disiplin 100%
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-400 font-medium">
                    <AlertTriangle className="h-3.5 w-3.5" /> Melanggar Rencana
                  </span>
                )}
              </div>
            </div>

            {trade.mistakeTag && (
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Faktor / Tag Evaluasi</span>
                <span className="text-amber-400 font-medium">
                  {trade.mistakeTag}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Rating Eksekusi</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${
                      star <= trade.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Notes */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Catatan Refleksi & Evaluasi Strategi
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
              {trade.notes || 'Tidak ada catatan khusus untuk transaksi ini.'}
            </p>
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => {
                onEdit(trade);
                onClose();
              }}
              className="px-4 py-2 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Edit Catatan
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
