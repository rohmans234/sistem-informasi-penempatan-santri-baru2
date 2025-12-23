# Flowchart Aplikasi SantriPlacement

Dokumen ini menjelaskan alur kerja utama dari sistem SantriPlacement, mulai dari persiapan data oleh admin hingga pengecekan hasil oleh santri.

## 1. Alur Kerja Admin

```mermaid
flowchart TD
    subgraph "Persiapan Data"
        A[Mulai] --> B{Manajemen Kampus};
        B --> C[Input/Update Kuota & Status Kampus];
        A --> D{Manajemen Santri};
        D --> E[Import/Input Data & Nilai Santri];
    end

    subgraph "Proses Penempatan"
        F[Jalankan Algoritma Penempatan]
        C --> F;
        E --> F;
        F --> G[Sistem Memproses];
        G --> G1[1. Pisahkan Santri Putra & Putri];
        G1 --> G2[2. Urutkan Santri Berdasarkan Nilai Tertinggi];
        G2 --> G3[3. Lakukan Alokasi Round-Robin ke Kampus Tersedia];
        G3 --> H{Hasil Penempatan Sementara};
    end

    subgraph "Finalisasi & Publikasi"
        H --> I{Review & Koreksi Manual};
        I --> J[Simpan Perubahan];
        J --> K{Publikasikan Hasil};
        H --> K;
        K --> L[Selesai];
    end

    style F fill:#3F51B5,color:#fff,stroke:#333,stroke-width:2px
    style K fill:#FFAB40,color:#000,stroke:#333,stroke-width:2px
    style G fill:#f5f5f5,stroke:#999
```

**Penjelasan Alur Kerja Admin:**

1.  **Persiapan Data**: Admin memastikan data `MasterKampus` (kuota, status) dan `CalonSantri` (data diri, nilai ujian) sudah lengkap dan valid.
2.  **Proses Penempatan**: Admin menekan tombol "Jalankan Penempatan Otomatis".
3.  **Sistem Memproses**:
    *   Algoritma memisahkan santri berdasarkan jenis kelamin.
    *   Santri diurutkan dari nilai rata-rata tertinggi ke terendah.
    *   Sistem melakukan alokasi ke kampus yang sesuai dengan jenis kelamin dan yang kuotanya masih tersedia.
4.  **Review & Koreksi**: Hasil sementara ditampilkan. Admin dapat meninjau dan melakukan pemindahan manual jika diperlukan.
5.  **Publikasi**: Setelah semua hasil dianggap final, admin menekan tombol "Publish Hasil" agar dapat dilihat oleh santri.

## 2. Alur Pengecekan Santri

```mermaid
flowchart TD
    subgraph "Akses Publik"
        P_A[Santri Mengunjungi Halaman Utama] --> P_B[Input Nomor Pendaftaran];
        P_B --> P_C[Klik Tombol "Cek Hasil"];
        P_C --> P_D{Sistem Mencari Data};
        P_D --> P_E{Hasil Ditemukan?};
        P_E -- Ya --> P_F[Tampilkan Detail Penempatan];
        P_E -- Tidak --> P_G[Tampilkan Pesan "Data Tidak Ditemukan"];
    end
```

**Penjelasan Alur Pengecekan Santri:**

1.  Santri membuka halaman publik aplikasi.
2.  Ia memasukkan nomor pendaftaran yang dimiliki.
3.  Sistem akan mencari data di tabel `Penempatan` yang statusnya sudah `status_publish = true`.
4.  Jika data ditemukan, detail penempatan (nama, kampus tujuan, dll.) akan ditampilkan. Jika tidak, sistem akan memberikan notifikasi bahwa data tidak ditemukan.
