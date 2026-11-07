import React from 'react';
import { MonthlyStats, AccountConfig } from '../types/trading';
import { formatIDR, formatPercent } from '../utils/formatters';
import { Wallet, TrendingUp, TrendingDown, Target, Award, ShieldCheck } from 'lucide-react';

interface KPICardsProps {
  stats: MonthlyStats;
  config: AccountConfig;
}

export const KPICards: React.FC<KPICardsProps> = ({ stats, config }) => {
  const currentBalance = config.initialBalance + stats.totalNetPnl;
  const isNetProfit = stats.totalNetPnl >= 0;
  const isTargetAchieved = stats.netPnlPercentage >= config.targetMonthlyPct;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Kartu 1: Saldo Akun Terkini */}
      <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-medium">Saldo Akun Terkini</span>
          <Wallet className="h-4 w-4 text-slate-400" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
          {formatIDR(currentBalance)}
        </div>
        <div className="mt-2.5 flex items-center gap-2 text-xs">
          <span className="text-slate-400">Modal Awal:</span>
          <span className="font-mono text-slate-300 tabular-nums">{formatIDR(config.initialBalance)}</span>
        </div>
      </div>

      {/* Kartu 2: Total Net PnL & Persentase Profit */}
      <div className={`rounded-xl border p-5 ${
        isNetProfit 
          ? 'border-emerald-500/20 bg-emerald-950/10' 
          : 'border-rose-500/20 bg-rose-950/10'
      }`}>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-medium">Total Profit / Rugi (Net PnL)</span>
          {isNetProfit ? (
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          ) : (
            <TrendingDown className="h-4 w-4 text-rose-400" />
          )}
        </div>
        <div className={`text-2xl font-bold tracking-tight font-mono tabular-nums ${
          isNetProfit ? 'text-emerald-400' : 'text-rose-400'
        }`}>
          {formatIDR(stats.totalNetPnl, true)}
        </div>
        <div className="mt-2.5 flex items-center gap-2 text-xs">
          <span className="text-slate-400">Return Modal:</span>
          <span className={`font-mono font-semibold tabular-nums ${
            isNetProfit ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {formatPercent(stats.netPnlPercentage, true)}
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">Target: {config.targetMonthlyPct}%</span>
        </div>
      </div>

      {/* Kartu 3: Win Rate & Rasio Transaksi */}
      <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-medium">Win Rate & Eksekusi</span>
          <Award className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
          {stats.winRate.toFixed(1)}%
        </div>
        <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-400">
          <span className="text-emerald-400 font-mono tabular-nums font-medium">{stats.winTrades} Win</span>
          <span>·</span>
          <span className="text-rose-400 font-mono tabular-nums font-medium">{stats.lossTrades} Loss</span>
          {stats.bepTrades > 0 && (
            <>
              <span>·</span>
              <span className="text-slate-300 font-mono tabular-nums">{stats.bepTrades} BEP</span>
            </>
          )}
          <span>·</span>
          <span className="text-slate-400">Total {stats.totalTrades}</span>
        </div>
      </div>

      {/* Kartu 4: Profit Factor & Average R:R */}
      <div className="rounded-xl border border-slate-800 bg-[#111827] p-5">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-medium">Profit Factor & Rata-rata</span>
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
          {stats.profitFactor.toFixed(2)}
        </div>
        <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-400">
          <span>Avg Win:</span>
          <span className="text-emerald-400 font-mono tabular-nums">{formatIDR(stats.avgWin)}</span>
          <span>·</span>
          <span>Avg Loss:</span>
          <span className="text-rose-400 font-mono tabular-nums">{formatIDR(stats.avgLoss)}</span>
        </div>
      </div>
    </div>
  );
};
