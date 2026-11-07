import React, { useState } from 'react';
import { AccountConfig } from '../types/trading';
import { formatIDR } from '../utils/formatters';
import { X, Check } from 'lucide-react';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AccountConfig;
  onSaveConfig: (newConfig: AccountConfig) => void;
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [initialBalance, setInitialBalance] = useState<number>(config.initialBalance);
  const [targetMonthlyPct, setTargetMonthlyPct] = useState<number>(config.targetMonthlyPct);
  const [usdToIdrRate, setUsdToIdrRate] = useState<number>(config.usdToIdrRate);
  const [traderName, setTraderName] = useState<string>(config.traderName);
  const [accountNumber, setAccountNumber] = useState<string>(config.accountNumber || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      initialBalance: Number(initialBalance) || 50000000,
      targetMonthlyPct: Number(targetMonthlyPct) || 10,
      usdToIdrRate: Number(usdToIdrRate) || 16000,
      traderName: traderName.trim() || 'Trader',
      accountNumber: accountNumber.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-[#111827] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0e1422]">
          <h3 className="text-base font-bold text-white tracking-tight">
            Pengaturan Akun & Modal Trading
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Modal Awal Akun (IDR - Rupiah)
            </label>
            <input
              type="number"
              step="500000"
              required
              value={initialBalance}
              onChange={(e) => setInitialBalance(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
            />
            <span className="block text-[11px] text-slate-400 mt-1 font-mono">
              Terbaca: {formatIDR(initialBalance)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target Profit Bulanan (%)
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={targetMonthlyPct}
                onChange={(e) => setTargetMonthlyPct(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Kurs USD ke IDR (Rp)
              </label>
              <input
                type="number"
                step="100"
                required
                value={usdToIdrRate}
                onChange={(e) => setUsdToIdrRate(parseFloat(e.target.value) || 16000)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Nama Trader
            </label>
            <input
              type="text"
              value={traderName}
              onChange={(e) => setTraderName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Nomor Akun Broker / MT5 (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: MT5-9921002"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-sm transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
