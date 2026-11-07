import React from 'react';
import { DailySummary } from '../utils/statsCalculator';
import { formatIDR } from '../utils/formatters';
import { Calendar as CalendarIcon, CheckCircle2, XCircle } from 'lucide-react';

interface CalendarHeatmapProps {
  currentMonth: string; // e.g. "2026-11"
  dailySummaries: Record<string, DailySummary>;
  onSelectDate: (date: string) => void;
  selectedDate: string | null;
}

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  currentMonth,
  dailySummaries,
  onSelectDate,
  selectedDate,
}) => {
  // Parse year and month
  const [yearStr, monthStr] = currentMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10); // 1-12

  // Days in month
  const daysInMonth = new Date(year, month, 0).getDate();
  // First day of month (0 = Sun, 1 = Mon, ... 6 = Sat)
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  // Day names header (Senin - Minggu or Ming - Sab)
  const dayHeaders = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  // Calculate month green days and red days
  let greenDays = 0;
  let redDays = 0;
  let monthPnl = 0;

  Object.entries(dailySummaries).forEach(([date, sum]) => {
    if (date.startsWith(currentMonth)) {
      monthPnl += sum.totalPnl;
      if (sum.totalPnl > 0) greenDays++;
      else if (sum.totalPnl < 0) redDays++;
    }
  });

  return (
    <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-emerald-400" />
            <span>Kalender Hasil Trading Harian</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Klik tanggal untuk melihat daftar transaksi pada hari tersebut
          </p>
        </div>

        {/* Badge summary */}
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{greenDays} Hari Profit</span>
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1 text-rose-400 font-medium">
            <XCircle className="h-3.5 w-3.5" />
            <span>{redDays} Hari Rugi</span>
          </span>
          {selectedDate && (
            <button
              onClick={() => onSelectDate('')}
              className="text-xs text-slate-400 hover:text-white underline ml-2"
            >
              Reset Filter Tanggal
            </button>
          )}
        </div>
      </div>

      {/* Grid Kalender */}
      <div className="pt-4">
        {/* Header Nama Hari */}
        <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
          {dayHeaders.map((dh, i) => (
            <div
              key={dh}
              className={`text-[11px] font-semibold py-1 uppercase tracking-wider ${
                i === 0 || i === 6 ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {dh}
            </div>
          ))}
        </div>

        {/* Kotak Tanggal */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Offset kosong sebelum tanggal 1 */}
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="min-h-[72px] sm:min-h-[80px] rounded-lg border border-transparent bg-slate-900/20 opacity-30"
            />
          ))}

          {/* Tanggal-tanggal di bulan */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dayKey = `${currentMonth}-${dayNum.toString().padStart(2, '0')}`;
            const summary = dailySummaries[dayKey];
            const hasTrades = !!summary;
            const isProfit = summary && summary.totalPnl >= 0;
            const isSelected = selectedDate === dayKey;

            return (
              <button
                key={dayKey}
                onClick={() => {
                  if (hasTrades) {
                    onSelectDate(isSelected ? '' : dayKey);
                  }
                }}
                disabled={!hasTrades}
                className={`min-h-[72px] sm:min-h-[80px] p-2 rounded-lg border flex flex-col justify-between text-left transition-all ${
                  isSelected
                    ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#0B0F17]'
                    : ''
                } ${
                  hasTrades
                    ? isProfit
                      ? 'border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 cursor-pointer'
                      : 'border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40 cursor-pointer'
                    : 'border-slate-800/60 bg-slate-900/40 opacity-60 cursor-default'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-semibold font-mono ${
                      hasTrades
                        ? isProfit
                          ? 'text-emerald-300'
                          : 'text-rose-300'
                        : 'text-slate-500'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {hasTrades && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {summary.tradeCount} trade
                    </span>
                  )}
                </div>

                {hasTrades ? (
                  <div className="mt-1">
                    <div
                      className={`text-[11px] sm:text-xs font-bold font-mono tracking-tight tabular-nums truncate ${
                        isProfit ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {formatIDR(summary.totalPnl, true)}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <span className="text-emerald-400">{summary.wins}W</span>
                      <span>·</span>
                      <span className="text-rose-400">{summary.losses}L</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-600 mt-auto">-</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
