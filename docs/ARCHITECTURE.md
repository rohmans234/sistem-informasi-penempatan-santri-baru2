# Arsitektur Sistem SantriPlacement

Dokumen ini memberikan gambaran umum tentang arsitektur teknis yang digunakan dalam membangun aplikasi SantriPlacement.

## Diagram Arsitektur

```mermaid
graph TD
    subgraph "Pengguna (Aktor)"
        A1(Panitia / Admin)
        A2(Calon Santri)
    end

    subgraph "Lapisan Presentasi (Frontend)"
        UI_Publik[Halaman Pengecekan Publik]
        UI_Admin[Dasbor Admin]
    end

    subgraph "Lapisan Logika & Data (State Management)"
        Logic[Logika Bisnis & State]
        Algo[Algoritma Penempatan]
        Data[Sumber Data (Mock)]
    end
    
    subgraph "Teknologi & Kerangka Kerja"
        T1[Next.js & React]
        T2[Tailwind CSS]
        T3[ShadCN UI]
        T4[React Context API]
        T5[Recharts]
    end

    A1 -- Akses --> UI_Admin
    A2 -- Akses --> UI_Publik

    UI_Admin -- Berinteraksi dengan --> Logic
    UI_Publik -- Membaca --> Logic

    Logic -- Menjalankan --> Algo
    Logic -- Mengelola --> Data
    
    UI_Admin -- Dibangun dengan --> T1
    UI_Publik -- Dibangun dengan --> T1
    UI_Admin -- Menggunakan Komponen --> T3
    UI_Publik -- Menggunakan Komponen --> T3
    UI_Admin -- Ditata dengan --> T2
    UI_Publik -- Ditata dengan --> T2
    Logic -- Menggunakan --> T4
    UI_Admin -- Menampilkan Grafik --> T5

    classDef tech fill:#E8F5E9,stroke:#66BB6A,stroke-width:2px;
    class T1,T2,T3,T4,T5 tech;
```

## Penjelasan Komponen

1.  **Pengguna (Aktor)**:
    *   **Panitia/Admin**: Mengakses sistem melalui **Dasbor Admin** untuk mengelola data master, menjalankan proses penempatan, dan mempublikasikan hasil.
    *   **Calon Santri**: Mengakses **Halaman Publik** untuk mengecek status dan hasil penempatan mereka.

2.  **Lapisan Presentasi (Frontend)**:
    *   Dibangun sepenuhnya menggunakan **Next.js** dan **React**, yang memungkinkan rendering sisi server (SSR) dan sisi klien (Client Components).
    *   **Halaman Pengecekan Publik**: Antarmuka sederhana bagi santri untuk memasukkan nomor pendaftaran dan melihat hasilnya.
    *   **Dasbor Admin**: Antarmuka kompleks yang terdiri dari berbagai menu untuk manajemen kampus, santri, panitia, dan proses penempatan. Menggunakan komponen UI dari **ShadCN UI** dan visualisasi data dengan **Recharts**.
    *   Styling dikelola secara konsisten menggunakan **Tailwind CSS**.

3.  **Lapisan Logika & Data (State Management)**:
    *   **Logika Bisnis & State**: Saat ini, seluruh state aplikasi (data kampus, santri, hasil penempatan) dikelola secara terpusat di sisi klien menggunakan **React Context API** (`AppContext`). Ini memastikan konsistensi data di semua komponen.
    *   **Algoritma Penempatan**: Logika inti yang diimplementasikan dalam JavaScript/TypeScript, diaktifkan dari Dasbor Admin. Algoritma ini memproses data dari `AppContext` untuk menghasilkan penempatan.
    *   **Sumber Data**: Saat ini menggunakan data statis (mock data) yang diimpor ke dalam `AppContext` sebagai sumber kebenaran awal. Dalam skenario produksi, komponen ini akan digantikan oleh database (seperti Firestore, PostgreSQL, dll).

4.  **Teknologi & Kerangka Kerja**:
    *   **Next.js & React**: Kerangka kerja utama untuk membangun aplikasi.
    *   **ShadCN UI & Tailwind CSS**: Untuk membangun antarmuka pengguna yang modern, responsif, dan konsisten.
    *   **React Context API**: Digunakan untuk manajemen state global di sisi klien.
    *   **Recharts**: Library untuk membuat grafik dan chart interaktif di dasbor.
    *   **Framer Motion**: Digunakan untuk animasi transisi pada antarmuka.
    *   **Lucide-React**: Untuk pustaka ikon.
    *   **Zod & React Hook Form**: Untuk validasi skema dan manajemen formulir.