import React, { useState, useEffect } from 'react';
import { TradeRecord, TradeDirection, AccountConfig } from '../types/trading';
import { calculatePips, estimatePnlIDR, formatIDR } from '../utils/formatters';
import { X, Calculator, Star, CheckCircle2, AlertCircle } from 'lucide-react';

interface TradeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trade: TradeRecord) => void;
  editingTrade?: TradeRecord | null;
  config: AccountConfig;
  currentBalance: number;
}

const COMMON_PAIRS = ['XAU/USD', 'EUR/USD', 'GBP/USD', 'USD/JPY', 'GBP/JPY', 'AUD/USD'];
const COMMON_STRATEGIES = [
  'SMC Order Block (M15)',
  'Breakout SnR',
  'Pullback Fibo 61.8%',
  'Liquidity Sweep & CHoCH',
  'SnR Rejection',
  'Momentum Scalping',
  'Trendline Rebound',
  'News High Impact Trading',
];
const MISTAKE_TAGS = [
  'Disiplin Penuh',
  'FOMO',
  'Geser Stop Loss',
  'Overlot / Risk Kebesaran',
  'Terlalu Cepat Ambil Profit',
  'Revenge Trade',
  'Tanpa Stop Loss',
  'Terjebak False Breakout',
];

export const TradeFormModal: React.FC<TradeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTrade,
  config,
  currentBalance,
}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [pair, setPair] = useState('XAU/USD');
  const [customPair, setCustomPair] = useState('');
  const [direction, setDirection] = useState<TradeDirection>('BUY');
  const [lot, setLot] = useState<number>(0.10);
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [exitPrice, setExitPrice] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number | undefined>(undefined);
  const [takeProfit, setTakeProfit] = useState<number | undefined>(undefined);
  const [pnlAmount, setPnlAmount] = useState<number>(0);
  const [strategy, setStrategy] = useState('SMC Order Block (M15)');
  const [customStrategy, setCustomStrategy] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [rulesFollowed, setRulesFollowed] = useState<boolean>(true);
  const [mistakeTag, setMistakeTag] = useState<string>('Disiplin Penuh');
  const [notes, setNotes] = useState<string>('');

  // Initial populate
  useEffect(() => {
    if (editingTrade) {
      setDate(editingTrade.date);
      setTime(editingTrade.time || '');
      if (COMMON_PAIRS.includes(editingTrade.pair)) {
        setPair(editingTrade.pair);
        setCustomPair('');
      } else {
        setPair('OTHER');
        setCustomPair(editingTrade.pair);
      }
      setDirection(editingTrade.direction);
      setLot(editingTrade.lot);
      setEntryPrice(editingTrade.entryPrice);
      setExitPrice(editingTrade.exitPrice);
      setStopLoss(editingTrade.stopLoss);
      setTakeProfit(editingTrade.takeProfit);
      setPnlAmount(editingTrade.pnlAmount);
      if (COMMON_STRATEGIES.includes(editingTrade.strategy)) {
        setStrategy(editingTrade.strategy);
        setCustomStrategy('');
      } else {
        setStrategy('OTHER');
        setCustomStrategy(editingTrade.strategy);
      }
      setRating(editingTrade.rating);
      setRulesFollowed(editingTrade.rulesFollowed);
      setMistakeTag(editingTrade.mistakeTag || 'Disiplin Penuh');
      setNotes(editingTrade.notes);
    } else {
      // Default to current date and time
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');

      setDate(`${yyyy}-${mm}-${dd}`);
      setTime(`${hh}:${min}`);
      setPair('XAU/USD');
      setCustomPair('');
      setDirection('BUY');
      setLot(0.10);
      setEntryPrice(2740.00);
      setExitPrice(2745.00);
      setStopLoss(2735.00);
      setTakeProfit(2750.00);
      setPnlAmount(800000);
      setStrategy('SMC Order Block (M15)');
      setCustomStrategy('');
      setRating(5);
      setRulesFollowed(true);
      setMistakeTag('Disiplin Penuh');
      setNotes('');
    }
  }, [editingTrade, isOpen]);

  if (!isOpen) return null;

  const activePair = pair === 'OTHER' ? customPair.toUpperCase() : pair;
  const activeStrategy = strategy === 'OTHER' ? customStrategy : strategy;

  // Calculate live pips and auto estimated PnL
  const calculatedPips = calculatePips(activePair, direction, entryPrice, exitPrice);

  const handleAutoCalculatePnl = () => {
    const estimated = estimatePnlIDR(
      activePair,
      direction,
      lot,
      entryPrice,
      exitPrice,
      config.usdToIdrRate
    );
    setPnlAmount(estimated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!activePair.trim()) {
      alert('Silakan pilih atau masukkan pasangan mata uang (pair).');
      return;
    }

    if (!entryPrice || !exitPrice) {
      alert('Harga entry dan exit wajib diisi.');
      return;
    }

    const effectivePnl = Number(pnlAmount) || 0;
    const baseBal = currentBalance > 0 ? currentBalance : config.initialBalance;
    const pnlPercentage = baseBal > 0 ? (effectivePnl / baseBal) * 100 : 0;

    const tradeData: TradeRecord = {
      id: editingTrade?.id || `trade-${Date.now()}`,
      date,
      time,
      pair: activePair,
      direction,
      lot: Number(lot),
      entryPrice: Number(entryPrice),
      exitPrice: Number(exitPrice),
      stopLoss: stopLoss ? Number(stopLoss) : undefined,
      takeProfit: takeProfit ? Number(takeProfit) : undefined,
      pnlAmount: effectivePnl,
      pnlPercentage,
      pips: calculatedPips,
      strategy: activeStrategy,
      rating,
      rulesFollowed,
      mistakeTag,
      notes: notes.trim(),
    };

    onSave(tradeData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#111827] shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0e1422]">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {editingTrade ? 'Edit Catatan Transaksi' : 'Catat Transaksi Trading Baru'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Input parameter eksekusi, otomatisasi PnL IDR, dan catatan evaluasi strategi
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Section 1: Tanggal, Waktu & Pair */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Jam Transaksi
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Posisi / Arah
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 border border-slate-700 rounded-lg">
                <button
                  type="button"
                  onClick={() => setDirection('BUY')}
                  className={`py-1.5 text-xs font-bold rounded transition-colors ${
                    direction === 'BUY'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  BUY (Long)
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('SELL')}
                  className={`py-1.5 text-xs font-bold rounded transition-colors ${
                    direction === 'SELL'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SELL (Short)
                </button>
              </div>
            </div>
          </div>

          {/* Pair Quick Select */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Instrumen / Pasangan Mata Uang
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_PAIRS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPair(p);
                    setCustomPair('');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    pair === p
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                      : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPair('OTHER')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  pair === 'OTHER'
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                    : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                Lainnya...
              </button>
            </div>
            {pair === 'OTHER' && (
              <input
                type="text"
                placeholder="Misal: USD/CAD, NZD/USD, NAS100..."
                value={customPair}
                onChange={(e) => setCustomPair(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            )}
          </div>

          {/* Section 2: Lot, Entry, Exit, SL, TP */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Ukuran Lot
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={lot}
                onChange={(e) => setLot(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Harga Entry
              </label>
              <input
                type="number"
                step="any"
                required
                value={entryPrice}
                onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Harga Exit
              </label>
              <input
                type="number"
                step="any"
                required
                value={exitPrice}
                onChange={(e) => setExitPrice(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Perolehan Pips
              </label>
              <div className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 font-mono font-bold">
                {calculatedPips > 0 ? `+${calculatedPips.toFixed(1)}` : calculatedPips.toFixed(1)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Stop Loss (Opsional)
              </label>
              <input
                type="number"
                step="any"
                value={stopLoss !== undefined ? stopLoss : ''}
                onChange={(e) => setStopLoss(e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Contoh: 2735.00"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Take Profit (Opsional)
              </label>
              <input
                type="number"
                step="any"
                value={takeProfit !== undefined ? takeProfit : ''}
                onChange={(e) => setTakeProfit(e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Contoh: 2750.00"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 3: PnL Amount (IDR) & Auto Calculator */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Hasil Untung / Rugi Bersih (IDR - Rupiah)</span>
              </label>
              <button
                type="button"
                onClick={handleAutoCalculatePnl}
                className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium self-start sm:self-auto"
              >
                <Calculator className="h-3.5 w-3.5" />
                <span>Hitung Otomatis Berdasarkan Pip (Kurs Rp 16.000)</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="1000"
                required
                value={pnlAmount}
                onChange={(e) => setPnlAmount(parseFloat(e.target.value) || 0)}
                placeholder="Masukkan nominal Rp (negatif jika rugi)"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
              />
              <div className="shrink-0 text-xs font-mono font-semibold text-slate-300">
                Preview: {formatIDR(pnlAmount, true)}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Tip: Nilai dapat disesuaikan manual sesuai net tiket MT4/MT5 setelah komisi dan swap broker.
            </p>
          </div>

          {/* Section 4: Setup Strategi & Kepatuhan Plan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Setup Strategi Trading
              </label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                {COMMON_STRATEGIES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
                <option value="OTHER">Strategi Lainnya...</option>
              </select>
              {strategy === 'OTHER' && (
                <input
                  type="text"
                  placeholder="Nama strategi khusus..."
                  value={customStrategy}
                  onChange={(e) => setCustomStrategy(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Faktor Psikologi / Tag Evaluasi
              </label>
              <select
                value={mistakeTag}
                onChange={(e) => setMistakeTag(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                {MISTAKE_TAGS.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Disiplin & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rulesFollowed"
                checked={rulesFollowed}
                onChange={(e) => setRulesFollowed(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
              />
              <label htmlFor="rulesFollowed" className="text-xs text-slate-200 cursor-pointer">
                Disiplin mengikuti rencana trading (Trading Plan dipatuhi)
              </label>
            </div>

            <div className="flex items-center gap-2 justify-start sm:justify-end">
              <span className="text-xs text-slate-400">Rating Eksekusi:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-0.5 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 5: Catatan Evaluasi Strategi di Setiap Transaksi */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Catatan Evaluasi Strategi & Refleksi Transaksi
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Entry saat retest breakout resistance XAU/USD. Kenapa ambil trade ini? Apakah ada keraguan saat eksekusi? Apa pelajaran yang didapat?"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 transition-colors"
            >
              {editingTrade ? 'Simpan Perubahan' : 'Tambahkan ke Rekap'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
