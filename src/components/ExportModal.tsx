import React, { useRef } from 'react';
import { TradeRecord, AccountConfig, MonthlyStats } from '../types/trading';
import { exportTradesToExcel } from '../utils/exportUtils';
import { X, FileSpreadsheet, Printer, Upload, DownloadCloud, RotateCcw } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  trades: TradeRecord[];
  config: AccountConfig;
  stats: MonthlyStats;
  periodName: string;
  onTriggerPrint: () => void;
  onImportTrades: (imported: TradeRecord[]) => void;
  onResetData: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  trades,
  config,
  stats,
  periodName,
  onTriggerPrint,
  onImportTrades,
  onResetData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExcelExport = () => {
    exportTradesToExcel(trades, config, stats, periodName);
  };

  const handleBackupJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trades, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `TradeVault_Backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImportTrades(json);
          alert(`Berhasil memulihkan ${json.length} data transaksi!`);
          onClose();
        } else {
          alert('Format berkas JSON tidak sesuai.');
        }
      } catch (err) {
        alert('Gagal membaca berkas JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-[#111827] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0e1422]">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Pusat Ekspor & Laporan Berkala
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Unduh rekap data trading ke Excel (.xlsx) atau cetak laporan PDF
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Options */}
        <div className="p-6 space-y-4">
          
          {/* Opsi 1: Ekspor Excel */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Ekspor ke Microsoft Excel (.xlsx)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Lengkap dengan 2 sheet: Rincian transaksi & ringkasan statistik bulanan
                </p>
              </div>
            </div>
            <button
              onClick={handleExcelExport}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white whitespace-nowrap shadow-sm transition-colors shrink-0"
            >
              Unduh Excel
            </button>
          </div>

          {/* Opsi 2: Cetak / Simpan PDF */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                <Printer className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Cetak / Simpan ke Dokumen PDF
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Format dokumen resmi profesional A4 siap cetak atau Save as PDF
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onTriggerPrint();
                onClose();
              }}
              className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-white whitespace-nowrap transition-colors shrink-0"
            >
              Buka PDF
            </button>
          </div>

          {/* Section Backup & Restore */}
          <div className="pt-2 border-t border-slate-800/80">
            <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Cadangan Data Pribadi (Backup JSON)
            </h5>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleBackupJson}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/40 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <DownloadCloud className="h-3.5 w-3.5" />
                <span>Cadangkan JSON</span>
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/40 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Pulihkan JSON</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-2 text-center">
            <button
              onClick={() => {
                if (confirm('Kembalikan ke data contoh transaksi awal?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="text-[11px] text-slate-500 hover:text-slate-400 flex items-center justify-center gap-1 mx-auto"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset ke Data Demo Awal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
