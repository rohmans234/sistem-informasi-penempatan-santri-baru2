
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { mockKampus, mockSantri, mockPenempatan } from '@/lib/mock-data';
import type { MasterKampus, CalonSantri, PenempatanResult } from '@/lib/types';

interface AppContextType {
  kampusList: MasterKampus[];
  setKampusList: React.Dispatch<React.SetStateAction<MasterKampus[]>>;
  addKampus: (newKampus: Omit<MasterKampus, 'id_kampus' | 'kuota_terisi' | 'tanggal_dibuat'>) => void;
  updateKampus: (id: number, updatedKampus: Partial<Omit<MasterKampus, 'id_kampus'>>) => void;
  deleteKampus: (id: number) => void;
  santriList: CalonSantri[];
  setSantriList: React.Dispatch<React.SetStateAction<CalonSantri[]>>;
  addSantri: (newSantri: Omit<CalonSantri, 'id_santri' | 'rata_rata_ujian' | 'status_penempatan'>) => void;
  updateSantri: (id: number, updatedSantri: Partial<Omit<CalonSantri, 'id_santri'>>) => void;
  deleteSantri: (id: number) => void;
  placementResults: PenempatanResult[];
  setPlacementResults: React.Dispatch<React.SetStateAction<PenempatanResult[]>>;
  updateSinglePlacement: (id: string, updatedResult: Partial<PenempatanResult>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [kampusList, setKampusList] = useState<MasterKampus[]>(mockKampus);
  const [santriList, setSantriList] = useState<CalonSantri[]>(mockSantri);
  const [placementResults, setPlacementResults] = useState<PenempatanResult[]>(mockPenempatan);

  const addKampus = useCallback((newKampusData: Omit<MasterKampus, 'id_kampus' | 'kuota_terisi' | 'tanggal_dibuat'>) => {
    setKampusList(prev => {
        const newKampus: MasterKampus = {
            id_kampus: Math.max(0, ...prev.map(k => k.id_kampus)) + 1,
            ...newKampusData,
            kuota_terisi: 0,
            tanggal_dibuat: new Date().toISOString().split('T')[0],
        };
        return [...prev, newKampus];
    });
  }, []);

  const updateKampus = useCallback((id: number, updatedData: Partial<Omit<MasterKampus, 'id_kampus'>>) => {
      setKampusList(prev => 
          prev.map(k => k.id_kampus === id ? { ...k, ...updatedData } : k)
      );
  }, []);

  const deleteKampus = useCallback((id: number) => {
      setKampusList(prev => prev.filter(k => k.id_kampus !== id));
  }, []);

  const addSantri = useCallback((newSantriData: Omit<CalonSantri, 'id_santri' | 'rata_rata_ujian' | 'status_penempatan'>) => {
    const rataRata = (newSantriData.nilai_bindonesia + newSantriData.nilai_imla + newSantriData.nilai_alquran + newSantriData.nilai_berhitung) / 4;
    setSantriList(prev => {
        const newSantri: CalonSantri = {
            id_santri: Math.max(0, ...prev.map(s => s.id_santri)) + 1,
            ...newSantriData,
            rata_rata_ujian: rataRata,
            status_penempatan: 'Belum Ditempatkan',
        };
        return [...prev, newSantri];
    });
  }, []);

  const updateSantri = useCallback((id: number, updatedData: Partial<Omit<CalonSantri, 'id_santri'>>) => {
      const rataRata = updatedData.nilai_bindonesia !== undefined && updatedData.nilai_imla !== undefined && updatedData.nilai_alquran !== undefined && updatedData.nilai_berhitung !== undefined 
        ? (updatedData.nilai_bindonesia + updatedData.nilai_imla + updatedData.nilai_alquran + updatedData.nilai_berhitung) / 4
        : null;

      setSantriList(prev => 
          prev.map(s => {
            if (s.id_santri === id) {
              const finalData = { ...s, ...updatedData };
              if (rataRata !== null) {
                finalData.rata_rata_ujian = rataRata;
              }
              return finalData;
            }
            return s;
          })
      );
  }, []);

  const deleteSantri = useCallback((id: number) => {
      setSantriList(prev => prev.filter(s => s.id_santri !== id));
  }, []);
  
  const updateSinglePlacement = useCallback((id: string, updatedResult: Partial<PenempatanResult>) => {
    setPlacementResults(prev => prev.map(p => p.id === id ? { ...p, ...updatedResult } : p));
  }, []);

  const value = {
    kampusList,
    setKampusList,
    addKampus,
    updateKampus,
    deleteKampus,
    santriList,
    setSantriList,
    addSantri,
    updateSantri,
    deleteSantri,
    placementResults,
    setPlacementResults,
    updateSinglePlacement,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
