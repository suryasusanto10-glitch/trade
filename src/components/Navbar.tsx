import React from 'react';
import { Plus, Download, Settings, TrendingUp, Calendar, BookOpen, BarChart3 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'overview' | 'trades' | 'calendar' | 'strategies';
  setActiveTab: (tab: 'overview' | 'trades' | 'calendar' | 'strategies') => void;
  onOpenTradeModal: () => void;
  onOpenExportModal: () => void;
  onOpenSettingsModal: () => void;
  monthSelector: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenTradeModal,
  onOpenExportModal,
  onOpenSettingsModal,
  monthSelector,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0B0F17]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              TradeVault
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-normal">
              Rekap & Jurnal Trading IDR
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (single line, no capsule buttons) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'overview'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Ringkasan & Grafik</span>
          </button>

          <button
            onClick={() => setActiveTab('trades')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'trades'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Rekap Harian</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'calendar'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Kalender PnL</span>
          </button>

          <button
            onClick={() => setActiveTab('strategies')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'strategies'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Evaluasi Strategi</span>
          </button>
        </nav>

        {/* Zone 3: Quick Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:block">
            {monthSelector}
          </div>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-white whitespace-nowrap shrink-0"
            title="Ekspor ke Excel atau PDF"
          >
            <Download className="h-3.5 w-3.5 text-slate-300" />
            <span className="hidden sm:inline">Ekspor</span>
          </button>

          <button
            onClick={onOpenSettingsModal}
            className="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900/80 p-2 text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-white shrink-0"
            title="Pengaturan Akun & Modal"
          >
            <Settings className="h-4 w-4" />
          </button>

          <button
            onClick={onOpenTradeModal}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 transition-colors hover:bg-emerald-500 active:scale-95 whitespace-nowrap shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>+ Catat Trade</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Links */}
      <div className="flex md:hidden border-t border-slate-800/80 px-4 py-2 overflow-x-auto gap-4 text-xs font-medium bg-[#0f1420]">
        <button
          onClick={() => setActiveTab('overview')}
          className={`whitespace-nowrap px-2 py-1 rounded ${
            activeTab === 'overview' ? 'text-emerald-400 font-semibold bg-emerald-500/10' : 'text-slate-400'
          }`}
        >
          Ringkasan & Grafik
        </button>
        <button
          onClick={() => setActiveTab('trades')}
          className={`whitespace-nowrap px-2 py-1 rounded ${
            activeTab === 'trades' ? 'text-emerald-400 font-semibold bg-emerald-500/10' : 'text-slate-400'
          }`}
        >
          Rekap Transaksi
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`whitespace-nowrap px-2 py-1 rounded ${
            activeTab === 'calendar' ? 'text-emerald-400 font-semibold bg-emerald-500/10' : 'text-slate-400'
          }`}
        >
          Kalender PnL
        </button>
        <button
          onClick={() => setActiveTab('strategies')}
          className={`whitespace-nowrap px-2 py-1 rounded ${
            activeTab === 'strategies' ? 'text-emerald-400 font-semibold bg-emerald-500/10' : 'text-slate-400'
          }`}
        >
          Evaluasi Strategi
        </button>
      </div>
    </header>
  );
};
