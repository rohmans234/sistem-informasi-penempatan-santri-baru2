'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlayCircle, Info, Send, MoreHorizontal, Loader2 } from 'lucide-react';
import type { PenempatanResult, CalonSantri, MasterKampus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';

export default function PlacementPage() {
  const [santriList, setSantriList] = useState<CalonSantri[]>([]);
  const [kampusList, setKampusList] = useState<MasterKampus[]>([]);
  const [placementResults, setPlacementResults] = useState<PenempatanResult[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPublishAlertOpen, setIsPublishAlertOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<PenempatanResult | null>(null);
  const [editedKampusId, setEditedKampusId] = useState<string>('');

  const { toast } = useToast();

  // Load data awal dari Supabase
  const fetchData = async () => {
    const { data: santri } = await supabase.from('calon_santri').select('*');
    const { data: kampus } = await supabase.from('master_kampus').select('*');
    if (santri) setSantriList(santri);
    if (kampus) setKampusList(kampus);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRunPlacement = async () => {
    setIsProcessing(true);
    
    // 1. Ambil data segar dari DB
    const { data: availableSantri } = await supabase
      .from('calon_santri')
      .select('*')
      .eq('status_penempatan', 'Belum Ditempatkan')
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
    const tempKampus = JSON.parse(JSON.stringify(availableKampus));
    const updateSantriIds: number[] = [];

    // 2. Logika Pemerataan (Round Robin) per Gender
    const genders: ('Laki-laki' | 'Perempuan')[] = ['Laki-laki', 'Perempuan'];

    genders.forEach(gender => {
      const santriGender = availableSantri.filter(s => s.jenis_kelamin === gender);
      const kampusGender = tempKampus.filter((k: any) => k.jenis_kelamin === gender);
      
      if (kampusGender.length === 0) return;

      let kampusIdx = 0;
      santriGender.forEach(santri => {
        // Cari kampus berikutnya yang masih punya kuota (Looping)
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
          kampusIdx = (kampusIdx + 1) % kampusGender.length; // Bergeser ke kampus lain untuk pemerataan
          attempts++;
        }
      });
    });

    // 3. Simpan ke Database
    try {
      const { error: insertErr } = await supabase.from('penempatan').insert(newPlacements);
      if (insertErr) throw insertErr;

      await supabase.from('calon_santri').update({ status_penempatan: 'Ditempatkan' }).in('id_santri', updateSantriIds);
      
      for (const k of tempKampus) {
        await supabase.from('master_kampus').update({ kuota_terisi: k.kuota_terisi }).eq('id_kampus', k.id_kampus);
      }

      toast({ title: "Berhasil!", description: `${newPlacements.length} santri telah ditempatkan secara merata.` });
      fetchData(); // Refresh UI
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = async () => {
    const { error } = await supabase.from('penempatan').update({ status_publish: true }).eq('status_publish', false);
    if (!error) {
      setIsPublished(true);
      setIsPublishAlertOpen(false);
      toast({ title: 'Dipublikasikan!', description: 'Hasil kini dapat diakses oleh publik.' });
    }
  };

  return (
    <>
      <PageHeader title="Proses Penempatan" description="Algoritma pemerataan kualitas santri ke seluruh kampus Gontor." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Jalankan SPK Pemerataan</CardTitle>
              <CardDescription>Mendistribusikan santri berdasarkan peringkat nilai agar kualitas setiap kampus seimbang.</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Info Sistem</AlertTitle>
                <AlertDescription>Santri dengan nilai tertinggi akan disebar bergantian ke tiap kampus tujuan.</AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={handleRunPlacement} disabled={isProcessing}>
                {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlayCircle className="mr-2 h-5 w-5" />}
                {isProcessing ? 'Memproses Pemerataan...' : 'Jalankan Penempatan'}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Finalisasi</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                disabled={isPublished || santriList.filter(s => s.status_penempatan === 'Ditempatkan').length === 0}
                onClick={() => setIsPublishAlertOpen(true)}
              >
                <Send className="mr-2 h-4 w-4" />
                {isPublished ? 'Hasil Sudah Terbit' : 'Publish ke Publik'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Status Penempatan Santri</CardTitle>
              <CardDescription>Daftar santri yang sudah diproses oleh sistem.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pendaftaran</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {santriList.length > 0 ? santriList.map((s) => (
                    <TableRow key={s.id_santri}>
                      <TableCell className="font-mono">{s.no_pendaftaran}</TableCell>
                      <TableCell>{s.nama_lengkap}</TableCell>
                      <TableCell>{s.jenis_kelamin}</TableCell>
                      <TableCell>
                        <Badge variant={s.status_penempatan === 'Ditempatkan' ? "default" : "outline"}>
                          {s.status_penempatan}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={4} className="text-center">Belum ada data santri.</TableCell></TableRow>
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
            <AlertDialogDescription>Data akan dikunci dan santri bisa mengecek hasil lewat nomor pendaftaran.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish}>Ya, Publish</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}