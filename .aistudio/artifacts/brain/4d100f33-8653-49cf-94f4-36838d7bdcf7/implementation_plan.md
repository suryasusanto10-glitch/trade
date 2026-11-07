# Jurnal & Rekap Trading Harian (Forex & XAU/USD)

Aplikasi pencatatan dan evaluasi trading harian spesifik untuk instrumen Forex & Emas (XAU/USD) berbasis mata uang Rupiah (IDR), dilengkapi visualisasi grafik performa bulanan, kalkulasi otomatis win rate dan persentase profit, evaluasi strategi per transaksi, serta ekspor laporan berkala ke Excel dan PDF.

### User Review & Critical Decisions

> [!IMPORTANT]
> Keputusan preferensi pengguna yang telah dikonfirmasi pada tahap klarifikasi:

- **Fokus Pasar & Pasangan Mata Uang**: Forex & Emas (XAU/USD) seperti XAU/USD, EUR/USD, GBP/USD, USD/JPY, AUD/USD, GBP/JPY, dll. Mendukung input lot, harga entry, stop loss, take profit, dan exit.
- **Mata Uang Acuan**: Indonesian Rupiah (IDR - Rp) untuk saldo akun modal awal, nominal profit/rugi bersih (PnL), komisi, dan swap. Terdapat konversi nilai tukar otomatis atau kurs standar (mis. 1 USD = Rp 16.000) agar trader yang terbiasa melihat pip/USD juga bisa menginput atau otomatis terkonversi ke IDR.
- **Gaya Visual & Tema**: Pro Trader Dark Mode (tampilan bertema terminal profesional bernuansa slate gelap `#0B0F17`, aksen emerald `#10B981` untuk profit/bullish, rose `#F43F5E` untuk loss/bearish, serta cyan `#06B6D4` untuk garis ekuitas).
- **Format Ekspor**: 
  - **Excel**: File `.xlsx` / spreadsheet berstruktur lengkap dengan kolom tanggal, instrumen, tipe posisi (BUY/SELL), lot, harga buka/tutup, PnL (Rp & %), strategi/setup, dan catatan evaluasi.
  - **PDF / Print Report**: Template laporan berkala resmi siap cetak/simpan PDF dengan ringkasan metrik eksekutif (Total Profit, Win Rate, Profit Factor, Max Drawdown) dan grafik performa bulanan.

---

### 1. Overview & Core Concept

- **What It Does**: Membantu trader mencatat setiap transaksi harian secara cepat, menghitung otomatis untung-rugi bersih dalam IDR beserta persentase return terhadap modal akun, memetakan performa bulanan melalui grafik pertumbuhan saldo (Equity Curve) & kalender trading PnL harian, mengevaluasi psikologi/setup strategi per transaksi, serta mencetak laporan berkala ke format Excel dan PDF.
- **Target Audience**: Trader harian (day trader & swing trader) instrumen Forex dan XAU/USD yang membutuhkan jurnal disiplin tanpa repot membuat rumus manual di spreadsheet.
- **Key Value**: Menghilangkan bias subjektif dalam trading dengan menyediakan metrik objektif (Win Rate, Risk-to-Reward terwujud, Profit Factor, Average Win vs Average Loss, Evaluasi Emosi & Kesalahan Eksekusi) serta visualisasi bulanan yang jelas.

---

### 2. User Experience & Visual Design

#### A. Key User Flows
1. **Atur Modal & Parameter Awal**: Trader memasukkan modal awal akun (contoh: Rp 50.000.000) dan target bulanan.
2. **Entri Transaksi Cepat (Fast Trade Entry)**:
   - Pilih tanggal & waktu, pasangan pair (XAU/USD, EUR/USD, GBP/USD, dll.).
   - Arah posisi: BUY (Long) atau SELL (Short).
   - Ukuran Lot, Entry Price, Exit Price, Stop Loss, Take Profit.
   - PnL (Rp) dihitung otomatis atau bisa diisi langsung sesuai tiket MT4/MT5.
   - Setup Strategi (e.g. *Breakout, Pullback Fibonacci, SnR Rejection, ICT/SMC Order Block, Scalping News*).
   - Rating Eksekusi (1-5 bintang), Catatan Evaluasi (apa yang dipelajari, kesalahan psikologi seperti FOMO / Overtrading), dan opsional link screenshot chart.
3. **Dashboard Ringkasan & Visualisasi Bulanan**:
   - Kartu Metrik Utama: Saldo Akun Terkini, Total Net PnL (Rp & %), Win Rate (%), Total Trades, Profit Factor, Rata-rata Profit vs Loss.
   - Grafik Kurva Ekuitas (Equity Growth) interaktif berbasis garis mulus & area glow.
   - Grafik Bar Distribusi Bulanan (Net PnL per hari / per minggu).
   - Mini Kalender PnL: Melihat hari-hari trading mana yang hijau (profit) dan merah (loss) secara visual dalam bulan terpilih.
4. **Log Transaksi & Evaluasi Strategi**:
   - Tabel responsif dengan filter instrumen, strategi, bulan/tahun, dan hasil (Win/Loss/BEP).
   - Dialog Detail Evaluasi: Menampilkan refleksi mendalam, aturan trading yang dilanggar vs dipatuhi, serta rekomendasi perbaikan.
5. **Pusat Ekspor & Laporan**:
   - Ekspor Excel (.xlsx) instan dengan formula dan format sel terstandar.
   - Cetak Laporan PDF: Tata letak profesional dengan kop laporan, ringkasan performa bulanan, grafik visual, dan rincian transaksi terpilih.

#### B. Visual Identity & Theme (Pro Trader Terminal)
- **Palette**:
  - Background Utama: Deep Charcoal Dark (`#0B0F17`)
  - Permukaan Kontainer / Panel: Obsidian Slate (`#111827`, border hairline `rgba(255,255,255,0.08)`)
  - Aksen Bullish / Profit: Emerald Glow (`#10B981`, background tint `rgba(16,185,129,0.12)`)
  - Aksen Bearish / Loss: Rose Red (`#F43F5E`, background tint `rgba(244,63,94,0.12)`)
  - Aksen Netral / Info: Cyan Terminal (`#06B6D4`) dan Sky Blue (`#38BDF8`)
  - Muted Text: Slate 400 (`#94A3B8`)
- **Typography**:
  - Display & Headings: `Plus Jakarta Sans` / `Outfit` yang modern dan tajam.
  - Body Text: `Plus Jakarta Sans` untuk kenyamanan membaca jurnal evaluasi.
  - Data Numerik & Finansial: Tabular figures (`tabular-nums font-mono`) agar angka mata uang Rp dan persentase selalu sejajar rapi.
- **Spatial Discipline**:
  - Top Bar ringkas dengan wordmark, tanggal aktif, dan tombol aksi "Catat Trade Baru" & "Ekspor Laporan".
  - Layout dashboard 1440px responsif tanpa card-in-card berlebihan, menggunakan hairline borders halus.

---

### 3. Key Product Decisions & Trade-Offs

- **Kalkulasi Otomatis vs Fleksibilitas Manual**:
  - *Keputusan*: Mendukung perhitungan otomatis PnL berbasis pip & lot untuk XAU/USD dan Forex pairs standar, sekaligus menyediakan override manual jika ada komisi broker, swap semalam, atau slippage.
  - *Alasan*: Tiap broker lokal maupun luar negeri memiliki aturan komisi per lot yang berbeda; fleksibilitas ini mencegah selisih antara saldo jurnal dan akun riil broker.
- **Penyimpanan Data Lokal (IndexedDB / LocalStorage) dengan Fitur Backup & Restore**:
  - *Keputusan*: Menggunakan LocalStorage yang persisten di browser dengan opsi Ekspor/Impor JSON data cadangan penuh.
  - *Alasan*: Privasi finansial trader tetap terjaga 100% di perangkat mereka sendiri, cepat, instan, dan bebas lag tanpa ketergantungan koneksi backend.
- **Ekspor Excel & PDF Mandiri di Sisi Klien**:
  - *Keputusan*: Memanfaatkan library spreadsheet terpercaya (`xlsx`) untuk unduhan file `.xlsx` asli, serta template cetak CSS Print / PDF generation berkualitas tinggi.
  - *Alasan*: Menjamin unduhan langsung berhasil dalam 1 klik tanpa memerlukan server backend atau konversi cloud pihak ketiga.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Navigation Bar                              │
│  [TradeVault IDR]    Bulan: [November 2026]    [+ Transaksi] [Ekspor]  │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌───────────────────────────────────┐ ┌───────────────────────────────────┐
│     Ringkasan Metrik Akun         │ │    Filter & Pemilih Periode       │
│  - Saldo Akun (Rp)                │ │  - Dropdown Bulan / Tahun         │
│  - Net PnL Bulan Ini (Rp / %)     │ │  - Filter Pair (XAU, EUR, GBP)    │
│  - Win Rate (%) & Profit Factor   │ │  - Filter Setup Strategi          │
└──────────────────┬────────────────┘ └─────────────────┬─────────────────┘
                   │                                    │
                   ▼                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│           Visualisasi Grafik & Kalender Performa Bulanan                │
│  ┌───────────────────────────────┐  ┌────────────────────────────────┐  │
│  │  Grafik Kurva Ekuitas (Saldo) │  │ Kalender PnL Harian (Heatmap)  │  │
│  │  Pertumbuhan modal per hari   │  │ Hijau (+Rp) / Merah (-Rp)      │  │
│  └───────────────────────────────┘  └────────────────────────────────┘  │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                   ┌───────────────┴───────────────┐
                   ▼                               ▼
┌─────────────────────────────────────┐ ┌─────────────────────────────────┐
│   Tabel Rekap Transaksi Harian      │ │    Modal Input & Evaluasi       │
│  - Tanggal, Pair, BUY/SELL, Lot     │ │  - Form Entri Lengkap           │
│  - Entry, Exit, PnL (Rp & %)        │ │  - Catatan Psikologi & Evaluasi │
│  - Setup Strategi, Rating, Evaluasi │ │  - Aturan Disiplin Checklist    │
└──────────────────┬──────────────────┘ └─────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              Modul Ekspor Laporan (Excel & PDF Print)                   │
│  - Download .xlsx dengan data terstruktur dan ringkasan bulanan         │
│  - Cetak Laporan Formal PDF (Clean Print Stylesheet A4 Landscape/Port)  │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Data Model Transaksi (TypeScript)
```typescript
interface TradeRecord {
  id: string;
  date: string;          // YYYY-MM-DD
  time?: string;         // HH:mm
  pair: string;          // e.g. "XAU/USD", "EUR/USD", "GBP/USD", "USD/JPY"
  direction: 'BUY' | 'SELL';
  lot: number;           // e.g. 0.10, 0.50
  entryPrice: number;
  exitPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  pnlAmount: number;     // Nominal keuntungan/kerugian bersih dalam IDR (Rp)
  pnlPercentage: number; // Persentase terhadap saldo akun sebelum trade
  pips?: number;
  strategy: string;      // e.g. "Breakout SnR", "SMC Order Block", "Fibonacci Retracement"
  rating: number;        // 1-5 bintang kepatuhan rencana
  rulesFollowed: boolean;// Disiplin sesuai trading plan
  notes: string;         // Catatan evaluasi strategi & psikologi
  mistakeTag?: string;   // e.g. "FOMO", "Geser Stop Loss", "Overlot", "None"
}

interface AccountConfig {
  initialBalance: number;  // Modal awal (IDR)
  targetMonthlyPct: number;// Target bulanan (%)
  usdToIdrRate: number;    // Kurs konversi (default Rp 16.000)
}
```

#### Rencana Pengujian & Validasi
1. Menghitung kalkulasi PnL, Win Rate, dan Profit Factor dengan data realistis contoh trading XAU/USD dan Forex.
2. Memverifikasi kelancaran interaksi grafik performa bulanan dan kalender heatmap harian.
3. Menguji fitur Ekspor Excel dengan mengunduh file spreadsheet `.xlsx` yang valid.
4. Menguji dialog Cetak / Ekspor PDF untuk memastikan tata letak dokumen rapi tanpa elemen terpotong.
5. Memastikan seluruh form entri dan modal evaluasi strategi berjalan tanpa error atau lagging.
