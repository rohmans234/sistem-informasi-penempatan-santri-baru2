# Use Case Diagram Aplikasi SantriPlacement

Diagram ini menjelaskan fungsi-fungsi utama yang dapat dilakukan oleh setiap aktor dalam sistem.

## Aktor

*   **Panitia (Admin)**: Pengguna yang memiliki hak akses untuk mengelola seluruh proses penempatan.
*   **Calon Santri**: Pengguna publik yang ingin mengecek hasil penempatan mereka.

## Diagram

```mermaid
graph TD
    subgraph "Sistem SantriPlacement"
        UC1[Login ke Dasbor]
        UC2[Manajemen Data Kampus]
        UC3[Manajemen Data Santri]
        UC4[Menjalankan Proses Penempatan]
        UC5[Review dan Koreksi Hasil]
        UC6[Publikasikan Hasil]
        UC7[Manajemen Akun Panitia]
        UC8[Cek Hasil Penempatan]
        UC9[Lihat Laporan Dashboard]
        UC10[Import Data Santri via CSV]
    end

    subgraph "Aktor"
        A1(Panitia / Admin)
        A2(Calon Santri)
    end

    A1 --> UC1
    A1 --> UC2
    A1 --> UC3
    A1 --> UC4
    A1 --> UC5
    A1 --> UC6
    A1 --> UC7
    A1 --> UC9
    
    UC3 --> UC10

    A2 --> UC8
    
    UC6 -.-> UC8 : "Memungkinkan"

    classDef actor fill:#FFF,stroke:#333,stroke-width:2px;
    class A1,A2 actor;
```

## Deskripsi Use Case

| ID   | Nama Use Case                  | Aktor Utama   | Deskripsi Singkat                                                                                     |
| :--- | :----------------------------- | :------------ | :---------------------------------------------------------------------------------------------------- |
| UC1  | Login ke Dasbor                | Panitia       | Panitia memasukkan kredensial untuk mengakses dasbor admin.                                           |
| UC2  | Manajemen Data Kampus          | Panitia       | Panitia dapat menambah, melihat, mengedit, dan menghapus data master kampus, termasuk kuota.            |
| UC3  | Manajemen Data Santri          | Panitia       | Panitia dapat menambah, melihat, mengedit, dan menghapus data calon santri beserta nilainya.            |
| UC4  | Menjalankan Proses Penempatan  | Panitia       | Panitia memicu eksekusi algoritma untuk menempatkan santri ke kampus secara otomatis.                   |
| UC5  | Review dan Koreksi Hasil       | Panitia       | Setelah algoritma berjalan, panitia dapat meninjau hasilnya dan memindahkan santri jika diperlukan.     |
| UC6  | Publikasikan Hasil             | Panitia       | Panitia membuat hasil penempatan final dapat diakses oleh publik (calon santri).                      |
| UC7  | Manajemen Akun Panitia         | Panitia       | Super Admin dapat mengelola akun dan hak akses untuk panitia lainnya.                                 |
| UC8  | Cek Hasil Penempatan           | Calon Santri  | Calon santri memasukkan nomor pendaftaran untuk melihat status kelulusan dan kampus penempatannya.      |
| UC9  | Lihat Laporan Dashboard        | Panitia       | Panitia melihat ringkasan statistik, sebaran santri, dan notifikasi penting di halaman dasbor.        |
| UC10 | Import Data Santri via CSV     | Panitia       | Panitia dapat mengunggah file CSV untuk mengimpor data banyak santri sekaligus. (Ekstensi dari UC3). |
