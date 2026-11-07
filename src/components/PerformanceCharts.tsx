import React, { useState } from 'react';
import { EquityPoint, DailySummary } from '../utils/statsCalculator';
import { formatIDR, formatIndonesianDate } from '../utils/formatters';
import { TrendingUp, BarChart2, Info } from 'lucide-react';

interface PerformanceChartsProps {
  equityPoints: EquityPoint[];
  dailySummaries: Record<string, DailySummary>;
  initialBalance: number;
  periodName: string;
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({
  equityPoints,
  dailySummaries,
  initialBalance,
  periodName,
}) => {
  const [chartType, setChartType] = useState<'equity' | 'daily'>('equity');
  const [hoveredPoint, setHoveredPoint] = useState<EquityPoint | null>(null);
  const [hoveredDaily, setHoveredDaily] = useState<DailySummary | null>(null);

  // Prepare Daily Array sorted by date
  const dailyList = Object.values(dailySummaries).sort((a, b) => a.date.localeCompare(b.date));

  // SVG dimensions for Equity Curve
  const width = 800;
  const height = 300;
  const paddingX = 40;
  const paddingTop = 25;
  const paddingBottom = 40;

  // Calculate scales for Equity Curve
  const balances = equityPoints.map((p) => p.balance);
  const minBal = balances.length > 0 ? Math.min(...balances, initialBalance * 0.95) : initialBalance;
  const maxBal = balances.length > 0 ? Math.max(...balances, initialBalance * 1.05) : initialBalance;
  const rangeBal = maxBal - minBal || 1;

  const getX = (index: number) => {
    if (equityPoints.length <= 1) return paddingX;
    return paddingX + (index / (equityPoints.length - 1)) * (width - paddingX * 2);
  };

  const getY = (bal: number) => {
    return height - paddingBottom - ((bal - minBal) / rangeBal) * (height - paddingTop - paddingBottom);
  };

  // Build SVG path
  let pathD = '';
  let areaD = '';

  if (equityPoints.length > 0) {
    pathD = equityPoints.reduce((acc, pt, idx) => {
      const x = getX(idx);
      const y = getY(pt.balance);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');

    const firstX = getX(0);
    const lastX = getX(equityPoints.length - 1);
    const bottomY = height - paddingBottom;
    areaD = `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }

  // Baseline Y for Initial Balance
  const initialY = getY(initialBalance);

  // Calculate scales for Daily PnL
  const dailyPnLs = dailyList.map((d) => d.totalPnl);
  const maxAbsPnl = dailyPnLs.length > 0 
    ? Math.max(...dailyPnLs.map((v) => Math.abs(v)), 1000000)
    : 1000000;

  const barChartHeight = 240;
  const zeroLineY = barChartHeight / 2;

  return (
    <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            <span>Visualisasi Performa Bulanan</span>
            <span className="text-xs text-slate-400 font-normal">· {periodName}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Grafik pertumbuhan modal dan rekap untung-rugi per sesi transaksi
          </p>
        </div>

        {/* Chart View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setChartType('equity')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              chartType === 'equity'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Kurva Ekuitas (Saldo)</span>
          </button>
          <button
            onClick={() => setChartType('daily')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              chartType === 'daily'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            <span>Untung Rugi Harian (Bar)</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas View */}
      <div className="pt-4">
        {chartType === 'equity' ? (
          <div>
            {/* Equity Curve SVG */}
            <div className="relative w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-64 select-none"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference lines */}
                <line
                  x1={paddingX}
                  y1={paddingTop}
                  x2={width - paddingX}
                  y2={paddingTop}
                  stroke="#1E293B"
                  strokeDasharray="4 4"
                />
                <line
                  x1={paddingX}
                  y1={height - paddingBottom}
                  x2={width - paddingX}
                  y2={height - paddingBottom}
                  stroke="#1E293B"
                />

                {/* Modal Awal Baseline */}
                {initialY >= paddingTop && initialY <= height - paddingBottom && (
                  <g>
                    <line
                      x1={paddingX}
                      y1={initialY}
                      x2={width - paddingX}
                      y2={initialY}
                      stroke="#475569"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={width - paddingX + 5}
                      y={initialY + 4}
                      fill="#94A3B8"
                      fontSize="10"
                      fontFamily="JetBrains Mono"
                    >
                      Modal Awal
                    </text>
                  </g>
                )}

                {/* Area and Line */}
                {areaD && <path d={areaD} fill="url(#equityGradient)" />}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points */}
                {equityPoints.map((pt, idx) => {
                  const cx = getX(idx);
                  const cy = getY(pt.balance);
                  const isHovered = hoveredPoint?.index === pt.index;

                  return (
                    <g key={pt.index}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 6 : 3.5}
                        fill={pt.pnl >= 0 ? '#10B981' : '#F43F5E'}
                        stroke="#0B0F17"
                        strokeWidth="2"
                        className="transition-all duration-150 cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Hover Details Card */}
              {hoveredPoint ? (
                <div className="absolute top-3 left-4 bg-slate-900/95 border border-slate-700/80 rounded-lg p-2.5 text-xs shadow-xl backdrop-blur-sm pointer-events-none">
                  <div className="text-slate-400 font-medium">{hoveredPoint.date}</div>
                  <div className="text-white font-mono font-bold text-sm mt-0.5 tabular-nums">
                    Saldo: {formatIDR(hoveredPoint.balance)}
                  </div>
                  {hoveredPoint.index > 0 && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-slate-400">{hoveredPoint.tradeDesc || 'Trade'}:</span>
                      <span className={`font-mono font-semibold tabular-nums ${
                        hoveredPoint.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {formatIDR(hoveredPoint.pnl, true)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-slate-500 px-2 mt-1 font-mono tabular-nums">
                  <span>Mulai: {formatIDR(initialBalance)}</span>
                  <span>Maks: {formatIDR(maxBal)}</span>
                  <span>Akhir: {formatIDR(balances[balances.length - 1] || initialBalance)}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Daily Net PnL Bar Chart */}
            {dailyList.length === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-slate-500 text-xs">
                <Info className="h-5 w-5 mb-1 text-slate-600" />
                <span>Belum ada transaksi di bulan ini</span>
              </div>
            ) : (
              <div className="relative">
                <div className="h-60 w-full flex items-center justify-between gap-1.5 px-3 pt-4 pb-8 border-b border-slate-800">
                  {dailyList.map((day) => {
                    const isProfit = day.totalPnl >= 0;
                    const heightPct = Math.min((Math.abs(day.totalPnl) / maxAbsPnl) * 45, 45); // up to 45% max
                    const isHovered = hoveredDaily?.date === day.date;

                    return (
                      <div
                        key={day.date}
                        className="flex-1 flex flex-col items-center h-full justify-center relative group cursor-pointer"
                        onMouseEnter={() => setHoveredDaily(day)}
                        onMouseLeave={() => setHoveredDaily(null)}
                      >
                        {/* Upper Half (Positive PnL) */}
                        <div className="h-1/2 w-full flex items-end justify-center">
                          {isProfit && (
                            <div
                              style={{ height: `${Math.max(heightPct, 6)}%` }}
                              className={`w-full max-w-[28px] rounded-t-sm transition-all ${
                                isHovered ? 'bg-emerald-400' : 'bg-emerald-500/80 hover:bg-emerald-400'
                              }`}
                            />
                          )}
                        </div>

                        {/* Baseline Divider */}
                        <div className="w-full h-[1px] bg-slate-700 my-0" />

                        {/* Lower Half (Negative PnL) */}
                        <div className="h-1/2 w-full flex items-start justify-center">
                          {!isProfit && (
                            <div
                              style={{ height: `${Math.max(heightPct, 6)}%` }}
                              className={`w-full max-w-[28px] rounded-b-sm transition-all ${
                                isHovered ? 'bg-rose-400' : 'bg-rose-500/80 hover:bg-rose-400'
                              }`}
                            />
                          )}
                        </div>

                        {/* Day Label */}
                        <span className="absolute bottom-1 text-[10px] font-mono text-slate-400">
                          {day.date.split('-')[2]}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Hover Details for Daily Bar */}
                {hoveredDaily ? (
                  <div className="absolute top-2 left-4 bg-slate-900/95 border border-slate-700 rounded-lg p-2.5 text-xs shadow-xl backdrop-blur-sm pointer-events-none">
                    <div className="text-slate-400 font-medium">
                      {formatIndonesianDate(hoveredDaily.date)}
                    </div>
                    <div className={`font-mono font-bold text-sm mt-0.5 tabular-nums ${
                      hoveredDaily.totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {formatIDR(hoveredDaily.totalPnl, true)}
                    </div>
                    <div className="text-slate-400 mt-1 flex items-center gap-2">
                      <span>{hoveredDaily.tradeCount} Trade</span>
                      <span>·</span>
                      <span className="text-emerald-400">{hoveredDaily.wins} Win</span>
                      <span>·</span>
                      <span className="text-rose-400">{hoveredDaily.losses} Loss</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between text-[11px] text-slate-500 mt-2 px-3">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                      Hari Untung (Profit)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block w-2.5 h-2.5 rounded-xs bg-rose-500" />
                      Hari Rugi (Loss)
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
