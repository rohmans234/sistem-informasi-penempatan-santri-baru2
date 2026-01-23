'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { MasterKampus, CalonSantri, PenempatanResult } from '@/lib/types';

interface AppContextType {
  kampusList: MasterKampus[];
  setKampusList: React.Dispatch<React.SetStateAction<MasterKampus[]>>;
  addKampus: (newKampus: Omit<MasterKampus, 'id_kampus' | 'kuota_terisi' | 'tanggal_dibuat'>) => Promise<void>;
  updateKampus: (id: number, updatedKampus: Partial<Omit<MasterKampus, 'id_kampus'>>) => Promise<void>;
  deleteKampus: (id: number) => Promise<void>;
  santriList: CalonSantri[];
  setSantriList: React.Dispatch<React.SetStateAction<CalonSantri[]>>;
  addSantri: (newSantri: Omit<CalonSantri, 'id_santri' | 'rata_rata_ujian' | 'status_penempatan'>) => Promise<void>;
  updateSantri: (id: number, updatedSantri: Partial<Omit<CalonSantri, 'id_santri'>>) => Promise<void>;
  deleteSantri: (id: number) => Promise<void>;
  placementResults: PenempatanResult[];
  setPlacementResults: React.Dispatch<React.SetStateAction<PenempatanResult[]>>;
  updateSinglePlacement: (id: string, updatedResult: Partial<PenempatanResult>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [kampusList, setKampusList] = useState<MasterKampus[]>([]);
  const [santriList, setSantriList] = useState<CalonSantri[]>([]);
  const [placementResults, setPlacementResults] = useState<PenempatanResult[]>([]);

  // 1. Ambil data awal dari Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data: kampus } = await supabase.from('master_kampus').select('*').order('id_kampus', { ascending: true });
      const { data: santri } = await supabase.from('calon_santri').select('*').order('id_santri', { ascending: true });
      
      if (kampus) setKampusList(kampus);
      if (santri) setSantriList(santri);
    };
    
    fetchData();
  }, []);

  // 2. Fungsi Kampus
  const addKampus = useCallback(async (newKampusData: Omit<MasterKampus, 'id_kampus' | 'kuota_terisi' | 'tanggal_dibuat'>) => {
    const { data, error } = await supabase.from('master_kampus').insert([newKampusData]).select();
    if (error) console.error("Gagal tambah kampus:", error.message);
    else if (data) setKampusList(prev => [...prev, data[0]]);
  }, []);

  const updateKampus = useCallback(async (id: number, updatedData: Partial<Omit<MasterKampus, 'id_kampus'>>) => {
    const { error } = await supabase.from('master_kampus').update(updatedData).eq('id_kampus', id);
    if (error) console.error("Gagal update kampus:", error.message);
    else setKampusList(prev => prev.map(k => k.id_kampus === id ? { ...k, ...updatedData } : k));
  }, []);

  const deleteKampus = useCallback(async (id: number) => {
    const { error } = await supabase.from('master_kampus').delete().eq('id_kampus', id);
    if (error) console.error("Gagal hapus kampus:", error.message);
    else setKampusList(prev => prev.filter(k => k.id_kampus !== id));
  }, []);

  // 3. Fungsi Santri
  const addSantri = useCallback(async (newSantriData: Omit<CalonSantri, 'id_santri' | 'rata_rata_ujian' | 'status_penempatan'>) => {
    const rataRata = (newSantriData.nilai_bindonesia + newSantriData.nilai_imla + newSantriData.nilai_alquran + newSantriData.nilai_berhitung) / 4;
    const { data, error } = await supabase.from('calon_santri').insert([{ ...newSantriData, rata_rata_ujian: rataRata, status_penempatan: 'Belum Ditempatkan' }]).select();
    if (error) console.error("Gagal tambah santri:", error.message);
    else if (data) setSantriList(prev => [...prev, data[0]]);
  }, []);

  const updateSantri = useCallback(async (id: number, updatedData: Partial<Omit<CalonSantri, 'id_santri'>>) => {
    let finalUpdate = { ...updatedData };
    const current = santriList.find(s => s.id_santri === id);
    
    if (current && (updatedData.nilai_bindonesia !== undefined || updatedData.nilai_imla !== undefined || updatedData.nilai_alquran !== undefined || updatedData.nilai_berhitung !== undefined)) {
      const n1 = updatedData.nilai_bindonesia ?? current.nilai_bindonesia;
      const n2 = updatedData.nilai_imla ?? current.nilai_imla;
      const n3 = updatedData.nilai_alquran ?? current.nilai_alquran;
      const n4 = updatedData.nilai_berhitung ?? current.nilai_berhitung;
      (finalUpdate as any).rata_rata_ujian = (n1 + n2 + n3 + n4) / 4;
    }

    const { error } = await supabase.from('calon_santri').update(finalUpdate).eq('id_santri', id);
    if (error) console.error("Gagal update santri:", error.message);
    else setSantriList(prev => prev.map(s => s.id_santri === id ? { ...s, ...finalUpdate } : s));
  }, [santriList]);

  const deleteSantri = useCallback(async (id: number) => {
    const { error } = await supabase.from('calon_santri').delete().eq('id_santri', id);
    if (error) console.error("Gagal hapus santri:", error.message);
    else setSantriList(prev => prev.filter(s => s.id_santri !== id));
  }, []);
  
  // 4. Update Penempatan (Fix Undefined Error)
  const updateSinglePlacement = useCallback((id: string, updatedResult: Partial<PenempatanResult>) => {
    setPlacementResults(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updatedResult };
        // Tambahkan pengecekan array kampusList agar tidak error saat loading
        if (updatedResult.kampus && kampusList.length > 0) {
          const newKampus = kampusList.find(k => k.nama_kampus === updatedResult.kampus);
          updated.wakil_pengasuh = newKampus?.wakil_pengasuh || 'Belum Ditentukan';
        }
        return updated;
      }
      return p;
    }));
  }, [kampusList]);

  const value = {
    kampusList, setKampusList, addKampus, updateKampus, deleteKampus,
    santriList, setSantriList, addSantri, updateSantri, deleteSantri,
    placementResults, setPlacementResults, updateSinglePlacement,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};