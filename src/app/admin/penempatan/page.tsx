
'use client';

import { useState } from 'react';
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
import { mockSantri } from '@/lib/mock-data';
import { mockKampus } from '@/lib/mock-data';
import { PlayCircle, Info, Send, MoreHorizontal, FilePenLine } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function PlacementPage() {
  const [placementResults, setPlacementResults] = useState<PenempatanResult[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPublishAlertOpen, setIsPublishAlertOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<PenempatanResult | null>(null);
  const [editedWakil, setEditedWakil] = useState('');
  const [editedKampus, setEditedKampus] = useState('');

  const { toast } = useToast();

  const handleRunPlacement = () => {
    setIsProcessing(true);
    toast({ title: 'Memproses...', description: 'Algoritma penempatan sedang berjalan.' });

    setTimeout(() => {
      const availableSantri = mockSantri.filter(s => s.status_penempatan === 'Belum Ditempatkan');
      const availableKampus = [...mockKampus].filter(k => k.status_aktif);

      const newPlacements: PenempatanResult[] = [];
      let placementId = 1;

      availableSantri.sort((a, b) => b.rata_rata_ujian - a.rata_rata_ujian);

      for (const santri of availableSantri) {
        const targetKampus = availableKampus.find(
          k => k.jenis_kelamin === santri.jenis_kelamin && k.kuota_terisi < k.kuota_pelajar_baru
        );

        if (targetKampus) {
          newPlacements.push({
            id: (placementId++).toString(),
            no_pendaftaran: santri.no_pendaftaran,
            nama_lengkap: santri.nama_lengkap,
            jenis_kelamin: santri.jenis_kelamin,
            kampus: targetKampus.nama_kampus,
            wakil_pengasuh: 'Belum Ditentukan',
          });
          targetKampus.kuota_terisi++;
        }
      }

      setPlacementResults(newPlacements);
      setIsProcessing(false);
      toast({ title: 'Berhasil!', description: 'Proses penempatan otomatis telah selesai.' });
    }, 2000);
  };
  
  const handleOpenEditModal = (result: PenempatanResult, type: 'pindah' | 'editWali') => {
    setSelectedResult(result);
    setEditedWakil(result.wakil_pengasuh);
    setEditedKampus(result.kampus);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedResult(null);
    setIsEditModalOpen(false);
  }

  const handleUpdatePlacement = () => {
    if (!selectedResult) return;

    setPlacementResults(results => results.map(r => 
      r.id === selectedResult.id 
        ? { ...r, wakil_pengasuh: editedWakil, kampus: editedKampus }
        : r
    ));
    
    toast({ title: 'Berhasil!', description: 'Data penempatan telah diperbarui.' });
    handleCloseEditModal();
  }

  const handlePublish = () => {
    setIsPublished(true);
    setIsPublishAlertOpen(false);
    toast({ title: 'Hasil Dipublikasikan!', description: 'Santri sekarang dapat melihat hasil penempatan mereka.' });
  };
  
  const handleLengkapiData = () => {
      toast({
            title: "Fitur Dalam Pengembangan",
            description: "Fungsionalitas untuk melengkapi data wali secara massal akan segera tersedia.",
      });
  }

  const activeMaleKampus = mockKampus.filter(k => k.status_aktif && k.jenis_kelamin === 'Laki-laki').map(k => k.nama_kampus);
  const activeFemaleKampus = mockKampus.filter(k => k.status_aktif && k.jenis_kelamin === 'Perempuan').map(k => k.nama_kampus);
  const relevantKampusList = selectedResult?.jenis_kelamin === 'Laki-laki' ? activeMaleKampus : activeFemaleKampus;


  return (
    <>
      <PageHeader
        title="Proses Penempatan"
        description="Jalankan algoritma, review, dan publikasikan hasil penempatan."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Jalankan Algoritma</CardTitle>
              <CardDescription>Mulai proses penempatan otomatis berdasarkan data santri dan kuota kampus.</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Perhatian!</AlertTitle>
                <AlertDescription>
                  Pastikan semua data santri dan kampus sudah valid sebelum menjalankan proses ini.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={handleRunPlacement} disabled={isProcessing}>
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                ) : (
                  <PlayCircle className="mr-2 h-5 w-5" />
                )}
                {isProcessing ? 'Memproses...' : 'Jalankan Penempatan Otomatis'}
              </Button>
            </CardFooter>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>2. Finalisasi & Publikasi</CardTitle>
              <CardDescription>Lengkapi data dan publikasikan hasil agar dapat dilihat oleh santri.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <Button variant="outline" className="w-full" onClick={handleLengkapiData} disabled={placementResults.length === 0}>
                  <FilePenLine className="mr-2 h-4 w-4" />
                  Lengkapi Data Wali
                </Button>
                 <Button 
                    className="w-full" 
                    variant={isPublished ? "secondary" : "default"} 
                    disabled={isPublished || placementResults.length === 0}
                    onClick={() => setIsPublishAlertOpen(true)}
                  >
                  <Send className="mr-2 h-4 w-4" />
                  {isPublished ? 'Hasil Sudah Dipublish' : 'Publish Hasil'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Hasil Penempatan Sementara</CardTitle>
              <CardDescription>
                Review hasil dari algoritma. Koreksi manual dapat dilakukan jika perlu.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Pendaftaran</TableHead>
                    <TableHead>Nama Lengkap</TableHead>
                    <TableHead>Kampus Tujuan</TableHead>
                    <TableHead>Wakil Pengasuh</TableHead>
                    <TableHead>
                      <span className="sr-only">Aksi</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placementResults.length > 0 ? placementResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-mono">{result.no_pendaftaran}</TableCell>
                      <TableCell className="font-medium">{result.nama_lengkap}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{result.kampus}</Badge>
                      </TableCell>
                       <TableCell>
                        {result.wakil_pengasuh}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isPublished}>
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEditModal(result, 'pindah')}>Pindahkan Kampus</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenEditModal(result, 'editWali')}>Edit Wakil Pengasuh</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )) : (
                     <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            Belum ada hasil. Jalankan proses penempatan terlebih dahulu.
                        </TableCell>
                     </TableRow>
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
            <AlertDialogTitle>Publikasikan Hasil Penempatan?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan membuat hasil penempatan dapat diakses oleh calon santri. Pastikan semua data sudah final. Anda tidak dapat mengubah data setelah dipublikasikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish}>Ya, Publikasikan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Penempatan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
                <p className="font-medium">{selectedResult?.nama_lengkap}</p>
                <p className="text-sm text-muted-foreground">{selectedResult?.no_pendaftaran}</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-kampus">Pindahkan Kampus</Label>
                <Select value={editedKampus} onValueChange={setEditedKampus}>
                    <SelectTrigger id="edit-kampus">
                        <SelectValue placeholder="Pilih kampus baru" />
                    </SelectTrigger>
                    <SelectContent>
                        {relevantKampusList.map(kampus => (
                            <SelectItem key={kampus} value={kampus}>{kampus}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-wali">Wakil Pengasuh</Label>
                <Input 
                    id="edit-wali"
                    value={editedWakil}
                    onChange={(e) => setEditedWakil(e.target.value)}
                    placeholder="Masukkan nama wakil pengasuh"
                />
            </div>
          </div>
           <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseEditModal}>
                Batal
              </Button>
              <Button type="button" onClick={handleUpdatePlacement}>Simpan Perubahan</Button>
            </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

    