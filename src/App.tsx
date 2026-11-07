import React, { useState, useEffect, useMemo } from 'react';
import { TradeRecord, AccountConfig } from './types/trading';
import { INITIAL_TRADES, DEFAULT_CONFIG } from './data/initialTrades';
import { calculateStats, getEquityCurve, getDailySummaries } from './utils/statsCalculator';
import { formatIDR, INDONESIAN_MONTHS } from './utils/formatters';
import { Navbar } from './components/Navbar';
import { KPICards } from './components/KPICards';
import { PerformanceCharts } from './components/PerformanceCharts';
import { CalendarHeatmap } from './components/CalendarHeatmap';
import { TradeTable } from './components/TradeTable';
import { TradeFormModal } from './components/TradeFormModal';
import { StrategyAnalysis } from './components/StrategyAnalysis';
import { ExportModal } from './components/ExportModal';
import { AccountSettingsModal } from './components/AccountSettingsModal';
import { EvaluationDetailModal } from './components/EvaluationDetailModal';
import { PrintReportView } from './components/PrintReportView';
import { Calendar, Plus, Download, ChevronRight, BookOpen, Layers } from 'lucide-react';

export default function App() {
  // LocalStorage Persistence
  const [trades, setTrades] = useState<TradeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('tradevault_trades_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TRADES;
  });

  const [config, setConfig] = useState<AccountConfig>(() => {
    try {
      const saved = localStorage.getItem('tradevault_config_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CONFIG;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('tradevault_trades_v1', JSON.stringify(trades));
    } catch (e) {
      console.error(e);
    }
  }, [trades]);

  useEffect(() => {
    try {
      localStorage.setItem('tradevault_config_v1', JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  }, [config]);

  // Tab & Filter States
  const [activeTab, setActiveTab] = useState<'overview' | 'trades' | 'calendar' | 'strategies'>('overview');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-11');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);

  // Modal States
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<TradeRecord | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [viewingEvaluation, setViewingEvaluation] = useState<TradeRecord | null>(null);
  const [isPrintViewActive, setIsPrintViewActive] = useState(false);

  // Available Months for dropdown
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    trades.forEach((t) => {
      const ym = t.date.slice(0, 7);
      if (ym) set.add(ym);
    });
    // Ensure current month is present
    set.add('2026-11');
    return Array.from(set).sort().reverse();
  }, [trades]);

  const monthName = useMemo(() => {
    if (selectedMonth === 'all') return 'Semua Periode';
    const [y, m] = selectedMonth.split('-');
    const mIdx = parseInt(m, 10) - 1;
    return `${INDONESIAN_MONTHS[mIdx] || m} ${y}`;
  }, [selectedMonth]);

  // Calculate stats and series
  const stats = useMemo(() => {
    return calculateStats(trades, config.initialBalance, selectedMonth, monthName);
  }, [trades, config.initialBalance, selectedMonth, monthName]);

  const equityPoints = useMemo(() => {
    return getEquityCurve(trades, config.initialBalance, selectedMonth);
  }, [trades, config.initialBalance, selectedMonth]);

  const dailySummaries = useMemo(() => {
    return getDailySummaries(trades, selectedMonth);
  }, [trades, selectedMonth]);

  // Trades filtered for current month view
  const currentMonthTrades = useMemo(() => {
    if (selectedMonth === 'all') return trades;
    return trades.filter((t) => t.date.startsWith(selectedMonth));
  }, [trades, selectedMonth]);

  // Handlers
  const handleSaveTrade = (tradeData: TradeRecord) => {
    if (editingTrade) {
      setTrades((prev) => prev.map((t) => (t.id === tradeData.id ? tradeData : t)));
      setEditingTrade(null);
    } else {
      setTrades((prev) => [tradeData, ...prev]);
    }
  };

  const handleDeleteTrade = (id: string) => {
    if (confirm('Yakin ingin menghapus catatan transaksi ini?')) {
      setTrades((prev) => prev.filter((t) => t.id !== id));
      if (viewingEvaluation?.id === id) setViewingEvaluation(null);
    }
  };

  const handleEditTrade = (trade: TradeRecord) => {
    setEditingTrade(trade);
    setIsTradeModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditingTrade(null);
    setIsTradeModalOpen(true);
  };

  const handleResetData = () => {
    setTrades(INITIAL_TRADES);
    setConfig(DEFAULT_CONFIG);
  };

  // If Print View is requested, render the dedicated printable report
  if (isPrintViewActive) {
    return (
      <PrintReportView
        trades={currentMonthTrades}
        config={config}
        stats={stats}
        periodName={monthName}
        onBack={() => setIsPrintViewActive(false)}
      />
    );
  }

  // Month Selector Component
  const monthSelector = (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400 font-medium">Bulan:</span>
      <select
        value={selectedMonth}
        onChange={(e) => {
          setSelectedMonth(e.target.value);
          setSelectedDateFilter(null);
        }}
        className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-200 focus:border-emerald-500 focus:outline-none"
      >
        <option value="all">Semua Riwayat</option>
        {availableMonths.map((ym) => {
          const [y, m] = ym.split('-');
          const label = `${INDONESIAN_MONTHS[parseInt(m, 10) - 1] || m} ${y}`;
          return (
            <option key={ym} value={ym}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTradeModal={handleOpenAddModal}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        monthSelector={monthSelector}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Sub-header on Mobile to select month */}
        <div className="flex lg:hidden items-center justify-between p-3 rounded-lg border border-slate-800 bg-[#111827]">
          {monthSelector}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1 text-xs text-emerald-400 font-medium hover:underline"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Ekspor</span>
          </button>
        </div>

        {/* Tab 1: Ringkasan & Grafik Performa */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Metrik Utama */}
            <KPICards stats={stats} config={config} />

            {/* Visualisasi Grafik Bulanan */}
            <PerformanceCharts
              equityPoints={equityPoints}
              dailySummaries={dailySummaries}
              initialBalance={config.initialBalance}
              periodName={monthName}
            />

            {/* Dua Kolom: Kalender Ringkas & Log Transaksi Terbaru */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Kalender Heatmap Harian (5 Kolom) */}
              <div className="lg:col-span-5">
                <CalendarHeatmap
                  currentMonth={selectedMonth === 'all' ? '2026-11' : selectedMonth}
                  dailySummaries={dailySummaries}
                  onSelectDate={(d) => {
                    setSelectedDateFilter(d);
                    if (d) setActiveTab('trades');
                  }}
                  selectedDate={selectedDateFilter}
                />
              </div>

              {/* Transaksi Terkini & Evaluasi (7 Kolom) */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="rounded-xl border border-slate-800 bg-[#111827] p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-emerald-400" />
                          <span>Transaksi Terakhir & Evaluasi</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Klik untuk melihat rincian evaluasi strategi dan faktor psikologi
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('trades')}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                      >
                        <span>Lihat Semua</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 divide-y divide-slate-800/60">
                      {currentMonthTrades.slice(0, 5).map((t) => {
                        const isProf = t.pnlAmount >= 0;
                        return (
                          <div
                            key={t.id}
                            onClick={() => setViewingEvaluation(t)}
                            className="py-3 flex items-center justify-between hover:bg-slate-800/30 px-2 rounded-lg cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  t.direction === 'BUY'
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                }`}
                              >
                                {t.direction}
                              </span>
                              <div>
                                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                  <span>{t.pair}</span>
                                  <span className="text-[11px] font-normal text-slate-400 font-mono">
                                    · {t.lot} Lot
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 truncate max-w-[220px]">
                                  {t.strategy} · {t.notes}
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div
                                className={`text-xs font-bold font-mono tabular-nums ${
                                  isProf ? 'text-emerald-400' : 'text-rose-400'
                                }`}
                              >
                                {formatIDR(t.pnlAmount, true)}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                {t.date}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                    <button
                      onClick={handleOpenAddModal}
                      className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 font-medium"
                    >
                      <Plus className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Catat Transaksi Lainnya</span>
                    </button>
                    <button
                      onClick={() => setIsExportModalOpen(true)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      Unduh Laporan Excel / PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Rekap Transaksi Harian (Tabel Penuh) */}
        {activeTab === 'trades' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Rekap Jurnal Transaksi Harian
                </h2>
                <p className="text-xs text-slate-400">
                  Daftar transaksi lengkap, status untung-rugi otomatis, dan catatan evaluasi
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-3.5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Ekspor Excel / PDF</span>
                </button>
                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ Catat Trade</span>
                </button>
              </div>
            </div>

            <TradeTable
              trades={currentMonthTrades}
              onEditTrade={handleEditTrade}
              onDeleteTrade={handleDeleteTrade}
              onViewEvaluation={(t) => setViewingEvaluation(t)}
              selectedDateFilter={selectedDateFilter}
              onClearDateFilter={() => setSelectedDateFilter(null)}
            />
          </div>
        )}

        {/* Tab 3: Kalender PnL Harian Penuh */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Kalender Performa & Konsistensi Harian
              </h2>
              <p className="text-xs text-slate-400">
                Visualisasikan hari profit (hijau) dan loss (merah) untuk memantau konsistensi trading Anda
              </p>
            </div>

            <CalendarHeatmap
              currentMonth={selectedMonth === 'all' ? '2026-11' : selectedMonth}
              dailySummaries={dailySummaries}
              onSelectDate={(d) => setSelectedDateFilter(d)}
              selectedDate={selectedDateFilter}
            />

            {/* Tabel Transaksi untuk Tanggal yang dipilih */}
            {selectedDateFilter && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">
                    Transaksi pada tanggal: {selectedDateFilter}
                  </h3>
                  <button
                    onClick={() => setSelectedDateFilter(null)}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    Tampilkan Semua
                  </button>
                </div>
                <TradeTable
                  trades={trades.filter((t) => t.date === selectedDateFilter)}
                  onEditTrade={handleEditTrade}
                  onDeleteTrade={handleDeleteTrade}
                  onViewEvaluation={(t) => setViewingEvaluation(t)}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Evaluasi Strategi & Audit Psikologi */}
        {activeTab === 'strategies' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Evaluasi Strategi & Audit Psikologi Trading
              </h2>
              <p className="text-xs text-slate-400">
                Tinjau strategi dengan performa terbaik dan temukan kebocoran modal akibat pelanggaran trading plan
              </p>
            </div>

            <StrategyAnalysis trades={currentMonthTrades} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0B0F17] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TradeVault © 2026 · Rekap Trading Harian Forex & Emas (IDR)</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="hover:text-slate-400 transition-colors"
            >
              Setelan Akun
            </button>
            <span>·</span>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="hover:text-slate-400 transition-colors"
            >
              Pusat Ekspor
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TradeFormModal
        isOpen={isTradeModalOpen}
        onClose={() => {
          setIsTradeModalOpen(false);
          setEditingTrade(null);
        }}
        onSave={handleSaveTrade}
        editingTrade={editingTrade}
        config={config}
        currentBalance={config.initialBalance + stats.totalNetPnl}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        trades={currentMonthTrades}
        config={config}
        stats={stats}
        periodName={monthName}
        onTriggerPrint={() => setIsPrintViewActive(true)}
        onImportTrades={(imp) => setTrades(imp)}
        onResetData={handleResetData}
      />

      <AccountSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        config={config}
        onSaveConfig={(cfg) => setConfig(cfg)}
      />

      <EvaluationDetailModal
        trade={viewingEvaluation}
        onClose={() => setViewingEvaluation(null)}
        onEdit={(t) => handleEditTrade(t)}
      />
    </div>
  );
}
