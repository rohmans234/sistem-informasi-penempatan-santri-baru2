'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlayCircle, Info, Send, Loader2, Trash2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/app-context';
import { supabase } from '@/lib/supabase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PlacementPage() {
  const { santriList, resetPlacement, fetchData } = useAppContext();
  const [isPublished, setIsPublished] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPublishAlertOpen, setIsPublishAlertOpen] = useState(false);
  const { toast } = useToast();

  // Fungsi untuk mengecek apakah sudah ada data yang dipublish di database
  const checkPublishStatus = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('penempatan')
        .select('status_publish')
        .eq('status_publish', true)
        .limit(1);
      
      setIsPublished(data && data.length > 0 ? true : false);
    } catch (err) {
      console.error("Gagal cek status publish:", err);
    }
  }, []);

  // Jalankan pengecekan setiap kali daftar santri berubah (setelah placement/reset)
  useEffect(() => {
    checkPublishStatus();
  }, [santriList, checkPublishStatus]);

  const handleRunPlacement = async () => {
    setIsProcessing(true);
    try {
      const { data: availableSantri } = await supabase
        .from('calon_santri')
        .select('*')
        .ilike('status_penempatan', 'Belum Ditempatkan')
        .order('rata_rata_ujian', { ascending: false });

      const { data: availableKampus } = await supabase
        .from('master_kampus')
        .select('*')
        .eq('status_aktif', true);

      if (!availableSantri || availableSantri.length === 0) {
        toast({ variant: "destructive", title: "Gagal", description: "Tidak ada santri yang perlu ditempatkan." });
        setIsProcessing(false);
        return;
      }

      const newPlacements: any[] = [];
      const tempKampus = JSON.parse(JSON.stringify(availableKampus || []));
      const updateSantriIds: number[] = [];
      const genders = ['Laki-laki', 'Perempuan'];

      genders.forEach(gender => {
        const santriGender = availableSantri.filter(s => s.jenis_kelamin === gender);
        const kampusGender = tempKampus.filter((k: any) => k.jenis_kelamin === gender);
        if (kampusGender.length === 0) return;

        let kampusIdx = 0;
        santriGender.forEach(santri => {
          let found = false;
          let attempts = 0;
          while (!found && attempts < kampusGender.length) {
            const currentKampus = kampusGender[kampusIdx];
            if (currentKampus.kuota_terisi < currentKampus.kuota_pelajar_baru) {
              newPlacements.push({ 
                id_santri: santri.id_santri, 
                id_kampus_tujuan: currentKampus.id_kampus, 
                status_publish: false 
              });
              currentKampus.kuota_terisi++;
              updateSantriIds.push(santri.id_santri);
              found = true;
            }
            kampusIdx = (kampusIdx + 1) % kampusGender.length;
            attempts++;
          }
        });
      });

      if (newPlacements.length > 0) {
        await supabase.from('penempatan').insert(newPlacements);
        await supabase.from('calon_santri').update({ status_penempatan: 'Ditempatkan' }).in('id_santri', updateSantriIds);
        
        for (const k of tempKampus) {
          await supabase.from('master_kampus').update({ kuota_terisi: k.kuota_terisi }).eq('id_kampus', k.id_kampus);
        }

        toast({ title: "Berhasil!", description: `${newPlacements.length} santri ditempatkan.` });
        
        // SINKRONISASI: Paksa status published ke false karena data baru belum dipublish
        setIsPublished(false); 
        await fetchData(); 
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('penempatan')
        .update({ status_publish: true })
        .eq('status_publish', false);
      
      if (!error) {
        setIsPublished(true);
        setIsPublishAlertOpen(false);
        toast({ title: 'Dipublikasikan!', description: 'Hasil kini dapat diakses oleh publik.' });
        await fetchData();
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Gagal", description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = async () => {
    if (confirm("Hapus semua penempatan dan reset kuota?")) {
      setIsProcessing(true);
      try {
        await resetPlacement();
        setIsPublished(false); // Reset status tombol
        toast({ title: "Berhasil", description: "Data penempatan telah dibersihkan." });
      } catch (err: any) {
        toast({ variant: "destructive", title: "Gagal", description: err.message });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <>
      <PageHeader title="Proses Penempatan" description="Algoritma pemerataan kualitas santri ke seluruh kampus." />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card>
            <CardHeader><CardTitle>1. Jalankan Penempatan</CardTitle></CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Info Sistem</AlertTitle>
                <AlertDescription>Gunakan tombol ini untuk memproses distribusi santri ke kampus.</AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={handleRunPlacement} disabled={isProcessing}>
                {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlayCircle className="mr-2 h-5 w-5" />}
                {isProcessing ? 'Memproses...' : 'Jalankan Penempatan'}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader><CardTitle>2. Finalisasi</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full" 
                // Logika: Tombol aktif jika belum dipublish DAN ada santri yang sudah berstatus 'Ditempatkan'
                disabled={isProcessing || isPublished || !santriList.some(s => s.status_penempatan?.toLowerCase() === 'ditempatkan')}
                onClick={() => setIsPublishAlertOpen(true)}
              >
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                {isPublished ? 'Hasil Sudah Terbit' : 'Publish ke Publik'}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full text-red-600 border-red-200 hover:bg-red-50" 
                onClick={handleReset} 
                disabled={isProcessing}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Reset Semua Data
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
           <Card>
            <CardHeader><CardTitle>Status Penempatan Santri</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Daftar</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {santriList.length > 0 ? santriList.map((s) => (
                    <TableRow key={s.id_santri}>
                      <TableCell className="font-mono">{s.no_pendaftaran}</TableCell>
                      <TableCell>{s.nama_lengkap}</TableCell>
                      <TableCell>
                        <Badge variant={s.status_penempatan === 'Ditempatkan' ? "default" : "outline"}>
                          {s.status_penempatan}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={3} className="text-center py-4">Belum ada data santri.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={isPublishAlertOpen} onOpenChange={setIsPublishAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publikasikan Sekarang?</AlertDialogTitle>
            <AlertDialogDescription>Data akan dikunci dan santri dapat melihat hasil lewat nomor pendaftaran.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish} disabled={isProcessing}>Ya, Publish</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}