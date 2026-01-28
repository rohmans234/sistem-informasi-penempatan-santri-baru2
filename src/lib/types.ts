export type MasterKampus = {
  id_kampus: number;
  nama_kampus: string;
  lokasi: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  kuota_pelajar_baru: number;
  kuota_terisi: number;
  status_aktif: boolean;
  wakil_pengasuh: string;
  tanggal_dibuat: string;
};

export type CalonSantri = {
  id_santri: number;
  no_pendaftaran: string;
  nama_lengkap: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  tanggal_lahir: string;
  alamat: string;
  nama_wali: string;
  status_penempatan: 'Ditempatkan' | 'Belum Ditempatkan' | 'Tidak Ditempatkan';
  nilai_imla: number;
  nilai_alquran: number;
  nilai_berhitung: number;
  nilai_bindonesia: number;
  rata_rata_ujian: number;
  kampus_penempatan?: string;
};

export type Penempatan = {
  id_penempatan: number;
  id_santri: number;
  id_kampus_tujuan: number; // <-- The correct column name
  tanggal_penempatan: string;
  status_publish: boolean;
};

export type Panitia = {
  id_panitia: number;
  username: string;
  role: 'admin' | 'staff';
};

export type PenempatanResult = {
  id: string; // no_pendaftaran
  nama: string;
  gender: 'Laki-laki' | 'Perempuan';
  nilai: number;
  status: 'Ditempatkan' | 'Belum Ditempatkan' | 'Tidak Ditempatkan';
  kampus?: string; // Nama kampus
  wakil_pengasuh?: string;
  isManual?: boolean;
};