
# Entity-Relationship Diagram (ERD)

Diagram ini menggambarkan hubungan antar entitas utama dalam sistem SantriPlacement.

```mermaid
erDiagram
    CalonSantri ||--o{ Penempatan : "ditempatkan di"
    MasterKampus ||--o{ Penempatan : "menampung"

    CalonSantri {
        int id_santri PK
        string no_pendaftaran "Unique"
        string nama_lengkap
        enum jenis_kelamin
        float nilai_bindonesia
        float nilai_imla
        float nilai_alquran
        float nilai_berhitung
        float rata_rata_ujian
        enum status_penempatan
    }

    MasterKampus {
        int id_kampus PK
        string nama_kampus
        enum jenis_kelamin
        int kapasitas_total
        int kuota_pelajar_baru
        int kuota_terisi
        boolean status_aktif
        string wakil_pengasuh
    }

    Penempatan {
        int id_penempatan PK
        int id_santri FK
        int id_kampus_tujuan FK
        boolean status_publish
    }

    Panitia {
        int id_panitia PK
        string username "Unique"
        enum role
    }
```

### Penjelasan Entitas:

1.  **CalonSantri**:
    *   Menyimpan data calon santri yang telah lulus ujian.
    *   Setiap santri memiliki nilai dari berbagai mata pelajaran yang digunakan untuk menentukan rata-rata.

2.  **MasterKampus**:
    *   Menyimpan data semua kampus yang tersedia.
    *   Setiap kampus memiliki kuota, kapasitas, dan status aktif.
    *   Kolom `jenis_kelamin` menentukan apakah kampus tersebut untuk "Laki-laki" atau "Perempuan".

3.  **Penempatan**:
    *   Tabel penghubung yang mencatat santri mana ditempatkan di kampus mana.
    *   Ini adalah hasil dari proses algoritma penempatan.

4.  **Panitia**:
    *   Menyimpan data akun pengguna (admin) yang dapat mengakses dasbor.
