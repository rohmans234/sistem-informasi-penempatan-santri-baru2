"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Building, CheckCircle, Search, User, XCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { mockPenempatan } from '@/lib/mock-data';
import type { PenempatanResult } from '@/lib/types';
import { Separator } from './ui/separator';

export function PlacementCheckForm() {
  const [regNumber, setRegNumber] = useState('');
  const [result, setResult] = useState<PenempatanResult | null | 'not_found'>(null);
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
      const found = mockPenempatan.find((p) => p.no_pendaftaran === regNumber);
      setResult(found || 'not_found');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="mt-12">
      <Card className="max-w-lg mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline">Cek Hasil Penempatan</CardTitle>
          <CardDescription>Masukkan nomor pendaftaran Anda untuk melihat hasil penempatan.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSearch}>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="regNumber" className="text-md">Nomor Pendaftaran</Label>
              <div className="flex space-x-2">
                <Input
                  id="regNumber"
                  placeholder="Contoh: 202401001"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  required
                  className="text-base"
                />
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  <span className="sr-only">Cari</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </form>
      </Card>

      {searched && (
        <div className="mt-8 max-w-lg mx-auto">
          <AnimatePresence>
            {loading ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  Mencari data...
                </div>
              </motion.div>
            ) : result === 'not_found' ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="bg-destructive/10 border-destructive text-destructive-foreground">
                  <CardHeader className="flex-row items-center gap-4 space-y-0">
                    <XCircle className="w-10 h-10 text-destructive" />
                    <div>
                      <CardTitle>Data Tidak Ditemukan</CardTitle>
                      <CardDescription className="text-destructive/80">
                        Pastikan nomor pendaftaran yang Anda masukkan sudah benar.
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ) : (
              result && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card className="shadow-lg">
                    <CardHeader className="bg-primary/5 rounded-t-lg">
                      <div className="flex items-center gap-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                        <div>
                          <CardTitle className="text-xl">Selamat! Anda Dinyatakan Lulus</CardTitle>
                          <CardDescription>Berikut adalah detail penempatan Anda:</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 grid gap-4">
                       <div className="flex items-center">
                          <User className="w-5 h-5 mr-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                            <p className="font-semibold">{result.nama_lengkap}</p>
                          </div>
                        </div>
                      <Separator />
                       <div className="flex items-center">
                          <Building className="w-5 h-5 mr-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Kampus Penempatan</p>
                            <p className="font-semibold text-primary">{result.kampus}</p>
                          </div>
                        </div>
                      <Separator />
                       <div className="flex items-center">
                          <User className="w-5 h-5 mr-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Wakil Pengasuh</p>
                            <p className="font-semibold">{result.wakil_pengasuh}</p>
                          </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                       <p className="text-xs text-muted-foreground text-center w-full">
                         Silakan lakukan pendaftaran ulang sesuai dengan jadwal yang telah ditentukan.
                       </p>
                    </CardFooter>
                  </Card>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
