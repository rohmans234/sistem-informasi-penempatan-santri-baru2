"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Search, XCircle, ArrowRight, MapPin, Download, Annoyed } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { PenempatanResult } from '@/lib/types';
import { useAppContext } from '@/context/app-context';

export function PlacementCheckForm() {
  const { placementResults } = useAppContext();
  const [regNumber, setRegNumber] = useState('');
  const [result, setResult] = useState<PenempatanResult | 'not_found' | 'not_placed' | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!regNumber) return;

    setLoading(true);
    setSearched(true);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      const found = placementResults.find((p) => p.no_pendaftaran === regNumber);
      // Simulate not placed case
      if (regNumber === '202401005') {
        setResult('not_placed');
      } else {
        setResult(found || 'not_found');
      }
      setLoading(false);
    }, 1500);
  };

  const getResultCard = () => {
    if (loading) {
      return (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center mt-8"
        >
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            Mencari data...
          </div>
        </motion.div>
      );
    }

    if (!result) return null;

    if (result === 'not_found') {
      return (
        <motion.div key="not-found" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 max-w-3xl mx-auto">
          <Card className="bg-red-50 border-red-200 text-red-800 shadow-md">
            <CardHeader className="flex-row items-center gap-4 space-y-0">
              <XCircle className="w-10 h-10 text-red-500" />
              <div>
                <CardTitle>Data Tidak Ditemukan</CardTitle>
                <CardDescription className="text-red-700">
                  Pastikan nomor pendaftaran yang Anda masukkan sudah benar.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      );
    }
    
    if (result === 'not_placed' || typeof result === 'object') {
        const isPlaced = typeof result === 'object';
        const statusData = {
            title: isPlaced ? "DITERIMA / LULUS" : "TIDAK DITEMPATKAN",
            icon: isPlaced ? <CheckCircle className="w-6 h-6" /> : <Annoyed className="w-6 h-6" />,
            color: isPlaced ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800",
            mainBg: isPlaced ? "bg-green-50" : "bg-orange-50",
            name: isPlaced ? result.nama_lengkap : "Yusuf Ibrahim",
            pendaftaran: isPlaced ? result.no_pendaftaran : "202401005",
            asal: "Surabaya, Jawa Timur"
        };


      return (
        <motion.div key="found" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-10 max-w-4xl mx-auto">
            <div className={`rounded-xl shadow-lg border border-gray-200 overflow-hidden ${statusData.mainBg}`}>
                {/* Header Hasil */}
                <div className="p-4 sm:p-6 flex justify-between items-center border-b border-gray-200 bg-white/50">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${statusData.color}`}>
                        {statusData.icon}
                        <span>Status Kelulusan: <strong>{statusData.title}</strong></span>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Tahun Ajaran</p>
                        <p className="font-bold text-gray-800">1446 / 2025</p>
                    </div>
                </div>

                {/* Body Hasil */}
                <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8 bg-white">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <p className="text-sm text-gray-500">Nomor Pendaftaran</p>
                            <p className="text-2xl font-bold font-mono text-gray-800">{statusData.pendaftaran}</p>
                        </div>
                         <div>
                            <p className="text-sm text-gray-500">Nama Lengkap</p>
                            <p className="text-3xl font-bold text-gray-900">{statusData.name}</p>
                        </div>
                         <div>
                            <p className="text-sm text-gray-500">Asal Daerah</p>
                            <p className="text-xl font-medium text-gray-800">{statusData.asal}</p>
                        </div>
                    </div>
                    
                    {isPlaced ? (
                        <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center text-center border">
                           <p className="text-sm font-semibold text-gray-500 tracking-wider uppercase">DITEMPATKAN DI KAMPUS</p>
                           <div className="my-4 bg-yellow-400 text-gray-900 rounded-2xl p-6 w-full shadow-lg border-2 border-gray-900">
                                <MapPin className="w-8 h-8 mx-auto mb-2"/>
                                <p className="text-xl font-bold">{result.kampus}</p>
                                <p className="text-sm">Ponorogo, Jawa Timur</p>
                           </div>
                           <Button variant="outline" className="w-full bg-white">
                                <Download className="mr-2 h-4 w-4"/>
                                Unduh Surat Bukti Lulus
                           </Button>
                        </div>
                    ) : (
                         <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center justify-center text-center border">
                            <p className="text-base font-semibold text-gray-700">Mohon maaf, Anda belum dapat ditempatkan pada periode ini karena kuota kampus telah terpenuhi.</p>
                         </div>
                    )}
                </div>

                {/* Footer Hasil */}
                <div className="p-4 bg-gray-100/80 border-t border-gray-200">
                    <p className="text-xs text-gray-600 text-center">
                        <strong>Catatan:</strong> Harap melakukan daftar ulang sebelum tanggal <strong>25 Mei 2024</strong>. Informasi lebih lanjut hubungi panitia.
                    </p>
                </div>
            </div>
        </motion.div>
      )
    }
  }

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="outline" className="bg-lime-100 text-lime-800 border-lime-300 font-semibold mb-4">
           🎉 Hasil Penempatan Resmi Telah Diumumkan!
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Cek Hasil Penempatan
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Silakan masukkan nomor pendaftaran calon santri untuk melihat hasil keputusan penempatan kampus.
        </p>
      </div>

      <div className="mt-10">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-2 border border-gray-200">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Search className="h-5 w-5 text-gray-400 ml-3" />
                <Input
                  id="regNumber"
                  placeholder="Contoh: 2024001"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  required
                  className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base p-0 h-12 bg-transparent"
                />
                <Button type="submit" disabled={loading} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl px-6 py-6 text-base">
                  Cek Hasil
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </form>
        </div>
      </div>
      
       <AnimatePresence mode="wait">
            {searched && getResultCard()}
       </AnimatePresence>
    </>
  );
}
