'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlayCircle, Info, Send, Loader2, Trash2, RefreshCw, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { CalonSantri, Penempatan, MasterKampus } from '@/lib/types';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppContext } from '@/context/app-context';

type SantriWithPlacement = CalonSantri & {
  penempatan: ({
    id_penempatan: number;
    id_kampus_tujuan: number;
    master_kampus: {
      nama_kampus: string;
    } | null;
  })[] | null;
};

export default function PlacementPage() {
  const { resetPlacement, fetchData: fetchAppContextData } = useAppContext();
  const [viewData, setViewData] = useState<SantriWithPlacement[]>([]);
  const [kampusList, setKampusList] = useState<MasterKampus[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [isReadyToPublish, setIsReadyToPublish] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPublishAlertOpen, setIsPublishAlertOpen] = useState(false);
  const [isResetAlertOpen, setIsResetAlertOpen] = useState(false);
  const { toast } = useToast();

  const fetchKampusList = useCallback(async () => {
    const { data, error } = await supabase.from('master_kampus').select('*');
    if (error) {
      toast({ variant: "destructive", title: "Gagal Memuat Data Kampus", description: error.message });
    } else if (data) {
      setKampusList(data);
    }
  }, [toast]);

  const fetchPlacementView = useCallback(async () => {
    setIsProcessing(true);
    const { data, error } = await supabase
      .from('calon_santri')
      .select(`*,
        penempatan (id_penempatan, id_kampus_tujuan, master_kampus:id_kampus_tujuan (nama_kampus))
      `)
      .order('rata_rata_ujian', { ascending: false });

    if (error) {
      toast({ variant: 'destructive', title: 'Gagal Memuat Data Tampilan', description: error.message });
    } else {
      setViewData(data as SantriWithPlacement[]);
    }
    setIsProcessing(false);
  }, [toast]);

  const checkInitialStatus = useCallback(async () => {
    const { data, error } = await supabase.from('penempatan').select('status_publish').limit(1);
    if (error || !data) return;
    const published = data.some(p => p.status_publish === true);
    const unpublished = data.some(p => p.status_publish === false);
    if (published) {
      setIsPublished(true);
      setIsReadyToPublish(false);
    } else if (unpublished) {
      setIsPublished(false);
      setIsReadyToPublish(true);
    }
  }, []);

  useEffect(() => {
    fetchPlacementView();
    fetchKampusList();
    checkInitialStatus();
  }, [fetchPlacementView, fetchKampusList, checkInitialStatus]);

  const handleRunPlacement = async () => {
    setIsProcessing(true);
    setIsReadyToPublish(false);
    toast({ title: "Memulai Proses", description: "Menganalisis data santri dan kampus..." });

    try {
      const { data: availableSantri, error: santriError } = await supabase
        .from('calon_santri')
        .select('id_santri, jenis_kelamin, rata_rata_ujian')
        .ilike('status_penempatan', 'Belum Ditempatkan')
        .order('rata_rata_ujian', { ascending: false });
      if (santriError) throw new Error(`Gagal mengambil data santri: ${santriError.message}`);

      const { data: availableKampus, error: kampusError } = await supabase.from('master_kampus').select('*').eq('status_aktif', true);
      if (kampusError) throw new Error(`Gagal mengambil data kampus: ${kampusError.message}`);

      if (!availableSantri?.length) {
        toast({ variant: "destructive", title: "Proses Dihentikan", description: "Tidak ada santri untuk ditempatkan." });
        setIsProcessing(false); return;
      }
      if (!availableKampus?.length) {
        toast({ variant: "destructive", title: "Proses Dihentikan", description: "Tidak ada kampus aktif." });
        setIsProcessing(false); return;
      }

      toast({ title: "Langkah 1/2", description: `Menjalankan algoritma untuk ${availableSantri.length} santri...` });
      
      const newPlacements: Omit<Penempatan, 'id_penempatan' | 'tanggal_penempatan'>[] = [];
      const tempKampusState = JSON.parse(JSON.stringify(availableKampus));
      const santriToUpdate: number[] = [];

      const processGender = (gender: 'Laki-laki' | 'Perempuan') => {
        const santriForGender = availableSantri.filter(s => s.jenis_kelamin === gender);
        const kampusForGender = tempKampusState.filter((k: MasterKampus) => k.jenis_kelamin === gender);
        if (!kampusForGender.length) return;
        let currentKampusIndex = 0;
        santriForGender.forEach(santri => {
          let placed = false;
          let attempts = 0;
          while (!placed && attempts < kampusForGender.length) {
            const kampus = kampusForGender[currentKampusIndex];
            if (kampus.kuota_terisi < kampus.kuota_pelajar_baru) {
              newPlacements.push({ id_santri: santri.id_santri, id_kampus_tujuan: kampus.id_kampus, status_publish: false });
              santriToUpdate.push(santri.id_santri);
              kampus.kuota_terisi++;
              placed = true;
            }
            currentKampusIndex = (currentKampusIndex + 1) % kampusForGender.length;
            attempts++;
          }
        });
      };

      processGender('Laki-laki');
      processGender('Perempuan');

      if (santriToUpdate.length === 0) {
        toast({ title: "Selesai", description: "Kuota kampus penuh, tidak ada penempatan baru." });
        setIsProcessing(false); return;
      }

      toast({ title: "Langkah 2/2", description: `Menyimpan ${santriToUpdate.length} penempatan baru...` });

      const { error: placementError } = await supabase.from('penempatan').insert(newPlacements);
      if (placementError) throw placementError;

      const { error: santriErrorUpdate } = await supabase.from('calon_santri').update({ status_penempatan: 'Ditempatkan' }).in('id_santri', santriToUpdate);
      if (santriErrorUpdate) throw new Error(`Gagal update status santri: ${santriErrorUpdate.message}`);

      for (const k of tempKampusState) {
        const { error: kampusErrorUpdate } = await supabase.from('master_kampus').update({ kuota_terisi: k.kuota_terisi }).eq('id_kampus', k.id_kampus);
        if (kampusErrorUpdate) console.error(`Gagal update kuota kampus ID ${k.id_kampus}:`, kampusErrorUpdate.message);
      }

      setIsReadyToPublish(true);
      await Promise.all([fetchAppContextData(), fetchPlacementView(), fetchKampusList()]);
      toast({ title: "Penempatan Selesai!", description: `${santriToUpdate.length} santri berhasil ditempatkan.` });

    } catch (err: any) {
      toast({ variant: "destructive", title: "Terjadi Kesalahan Kritis", description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdatePlacement = async (santri: SantriWithPlacement, newKampusId: number) => {
    if (!santri.penempatan || santri.penempatan.length === 0) return;
    setIsProcessing(true);
    toast({ title: "Memindahkan Santri..." });

    const placement = santri.penempatan[0];
    const oldKampusId = placement.id_kampus_tujuan;
    const oldKampus = kampusList.find(k => k.id_kampus === oldKampusId);
    const newKampus = kampusList.find(k => k.id_kampus === newKampusId);

    try {
      if (!oldKampus || !newKampus) throw new Error("Data kampus lama atau baru tidak ditemukan.");
      if (newKampus.kuota_terisi >= newKampus.kuota_pelajar_baru) throw new Error(`Kuota untuk ${newKampus.nama_kampus} sudah penuh.`);

      const results = await Promise.all([
        supabase.from('penempatan').update({ id_kampus_tujuan: newKampusId }).eq('id_penempatan', placement.id_penempatan),
        supabase.from('master_kampus').update({ kuota_terisi: oldKampus.kuota_terisi - 1 }).eq('id_kampus', oldKampusId),
        supabase.from('master_kampus').update({ kuota_terisi: newKampus.kuota_terisi + 1 }).eq('id_kampus', newKampusId),
      ]);

      const firstError = results.find(res => res.error);
      if (firstError) throw new Error(`Gagal memindahkan: ${firstError.error!.message}`);

      toast({ title: "Berhasil!", description: `${santri.nama_lengkap} telah dipindahkan ke ${newKampus.nama_kampus}.` });
      await Promise.all([fetchPlacementView(), fetchKampusList()]);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Gagal Memindahkan", description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.from('penempatan').update({ status_publish: true }).eq('status_publish', false);
      if (error) throw error;
      setIsPublished(true);
      setIsReadyToPublish(false);
      setIsPublishAlertOpen(false);
      await fetchPlacementView();
      toast({ title: 'Dipublikasikan!', description: 'Hasil kini dapat diakses oleh publik.' });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Gagal Publikasi", description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = async () => {
    setIsProcessing(true);
    try {
      await resetPlacement();
      setIsPublished(false);
      setIsReadyToPublish(false);
      await fetchPlacementView();
      toast({ title: "Berhasil Direset", description: "Semua data penempatan telah dibersihkan." });
      setIsResetAlertOpen(false);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Gagal Reset", description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const getSantriPlacementStatus = (santri: SantriWithPlacement) => {
    const campusName = santri.penempatan?.[0]?.master_kampus?.nama_kampus;
    if (campusName) return { status: campusName, isPlaced: true };
    if (santri.status_penempatan === 'Ditempatkan') return { status: 'Menunggu Data Kampus', isPlaced: true };
    return { status: santri.status_penempatan, isPlaced: false };
  };

  return (
    <>
      <PageHeader title="Proses Penempatan" description="Jalankan algoritma, lalu review dan koreksi hasil penempatan jika perlu." />
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
              <Button className="w-full" size="lg" onClick={handleRunPlacement} disabled={isProcessing || isPublished || isReadyToPublish}>
                {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlayCircle className="mr-2 h-5 w-5" />}
                {isProcessing ? 'Memproses...' : (isPublished || isReadyToPublish) ? 'Sudah Dijalankan' : 'Jalankan Penempatan'}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader><CardTitle>2. Finalisasi</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" disabled={isProcessing || isPublished || !isReadyToPublish} onClick={() => setIsPublishAlertOpen(true)}>
                <Send className="mr-2 h-4 w-4" />
                {isPublished ? 'Hasil Sudah Terbit' : 'Publish ke Publik'}
              </Button>
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={() => setIsResetAlertOpen(true)} disabled={isProcessing}>
                <Trash2 className="mr-2 h-4 w-4" />
                Reset Semua Data
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <div>
                <CardTitle>Status & Koreksi Hasil Penempatan</CardTitle>
                <CardDescription>Daftar santri yang sudah diproses dan dapat dikoreksi manual.</CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={() => { fetchPlacementView(); fetchKampusList(); }} disabled={isProcessing}>
                <RefreshCw className="h-4 w-4"/>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Daftar</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kampus Penempatan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isProcessing && viewData.length === 0 ? (
                     <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400"/></TableCell></TableRow>
                  ) : viewData.length > 0 ? viewData.map((s) => {
                    const { status, isPlaced } = getSantriPlacementStatus(s);
                    return (
                      <TableRow key={s.id_santri}>
                        <TableCell className="font-mono">{s.no_pendaftaran}</TableCell>
                        <TableCell className="font-medium">{s.nama_lengkap}</TableCell>
                        <TableCell>
                          <Badge variant={isPlaced ? "default" : "outline"} className={isPlaced ? 'bg-green-100 text-green-800' : ''}>
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {isPlaced && s.penempatan?.length ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0" disabled={isProcessing}>
                                  <span className="sr-only">Buka menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ubah Kampus</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {kampusList
                                  .filter(k => k.jenis_kelamin === s.jenis_kelamin && k.id_kampus !== s.penempatan![0].id_kampus_tujuan)
                                  .map(newKampus => (
                                    <DropdownMenuItem
                                      key={newKampus.id_kampus}
                                      onClick={() => handleUpdatePlacement(s, newKampus.id_kampus)}
                                      disabled={newKampus.kuota_terisi >= newKampus.kuota_pelajar_baru}
                                    >
                                      Pindah ke: {newKampus.nama_kampus}
                                      {newKampus.kuota_terisi >= newKampus.kuota_pelajar_baru && " (Penuh)"}
                                    </DropdownMenuItem>
                                  ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  }) : (
                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-500">Belum ada data untuk ditampilkan.</TableCell></TableRow>
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
            <AlertDialogTitle>Anda yakin ingin publikasikan hasil penempatan?</AlertDialogTitle>
            <AlertDialogDescription>
              Setelah dipublikasikan, data akan dikunci dan tidak bisa diubah lagi. Santri dapat melihat hasil penempatan mereka melalui halaman publik.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Ya, Publikasikan Sekarang
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isResetAlertOpen} onOpenChange={setIsResetAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda Yakin Ingin Mereset Semua Data?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus semua hasil penempatan, mereset status santri, dan mengosongkan kuota kampus. Tindakan ini tidak dapat diurungkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} disabled={isProcessing} className="bg-red-600 hover:bg-red-700 text-white">
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Ya, Reset Sekarang
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
