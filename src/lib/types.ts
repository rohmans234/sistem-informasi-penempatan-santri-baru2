export type Panitia = {
  id_panitia: number;
  username: string;
  role: 'Super Admin' | 'Admin Penempatan';
};

export type MasterKampus = {
  id_kampus: number;
  nama_kampus: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  kapasitas_total: number;
  kuota_pelajar_baru: number;
  kuota_terisi: number;
  status_aktif: boolean;
  tanggal_dibuat: string;
  wakil_pengasuh?: string;
};

export type CalonSantri = {
  id_santri: number;
  no_pendaftaran: string;
  nama_lengkap: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  nilai_bindonesia: number;
  nilai_imla: number;
  nilai_alquran: number;
  nilai_berhitung: number;
  rata_rata_ujian: number;
  status_penempatan: 'Belum Ditempatkan' | 'Ditempatkan';
};

export type Penempatan = {
  id_penempatan: number;
  id_santri: number;
  id_kampus_tujuan: number;
  wakil_pengasuh: string;
  status_publish: boolean;
};

export type PenempatanResult = {
  id: string;
  no_pendaftaran: string;
  nama_lengkap: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  kampus: string;
  wakil_pengasuh: string;
};
