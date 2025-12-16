
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { mockKampus as initialKampus } from '@/lib/mock-data';
import type { MasterKampus } from '@/lib/types';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
import { useToast } from '@/hooks/use-toast';
import { KampusForm } from '@/components/kampus-form';


export default function CampusPage() {
  const [kampusList, setKampusList] = useState<MasterKampus[]>(initialKampus);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedKampus, setSelectedKampus] = useState<MasterKampus | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenForm = (kampus?: MasterKampus | null) => {
    setSelectedKampus(kampus || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedKampus(null);
    setIsFormOpen(false);
  };

  const handleOpenDeleteAlert = (kampus: MasterKampus) => {
    setSelectedKampus(kampus);
    setIsDeleteAlertOpen(true);
  }

  const handleCloseDeleteAlert = () => {
    setSelectedKampus(null);
    setIsDeleteAlertOpen(false);
  }

  const handleFormSubmit = (values: Omit<MasterKampus, 'id_kampus' | 'kuota_terisi' | 'tanggal_dibuat'>) => {
    if (selectedKampus) {
      // Update
      setKampusList(
        kampusList.map((k) =>
          k.id_kampus === selectedKampus.id_kampus ? { ...k, ...values } : k
        )
      );
       toast({ title: "Berhasil!", description: "Data kampus berhasil diperbarui." });
    } else {
      // Create
      const newKampus: MasterKampus = {
        id_kampus: Math.max(...kampusList.map(k => k.id_kampus)) + 1,
        ...values,
        kuota_terisi: 0,
        tanggal_dibuat: new Date().toISOString().split('T')[0],
      };
      setKampusList([...kampusList, newKampus]);
      toast({ title: "Berhasil!", description: "Kampus baru berhasil ditambahkan." });
    }
    handleCloseForm();
  };

   const handleDeleteKampus = () => {
    if (!selectedKampus) return;
    setKampusList(kampusList.filter(k => k.id_kampus !== selectedKampus.id_kampus));
    toast({ title: "Berhasil!", description: "Data kampus berhasil dihapus.", variant: "destructive" });
    handleCloseDeleteAlert();
  };


  return (
    <>
      <PageHeader
        title="Manajemen Kampus"
        description="Kelola data kampus, kapasitas, dan kuota untuk penempatan."
      >
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Kampus
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{selectedKampus ? 'Edit' : 'Tambah'} Kampus</DialogTitle>
            </DialogHeader>
            <KampusForm
              initialData={selectedKampus}
              onSubmit={handleFormSubmit}
              onClose={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kampus</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kampus</TableHead>
                <TableHead>Jenis Kelamin</TableHead>
                <TableHead>Kapasitas</TableHead>
                <TableHead>Kuota Baru</TableHead>
                <TableHead>Terisi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kampusList.map((kampus) => (
                <TableRow key={kampus.id_kampus}>
                  <TableCell className="font-medium">{kampus.nama_kampus}</TableCell>
                  <TableCell>
                    <Badge variant={kampus.jenis_kelamin === 'Laki-laki' ? 'default' : 'secondary'} className={kampus.jenis_kelamin === 'Perempuan' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300' : ''}>
                      {kampus.jenis_kelamin}
                    </Badge>
                  </TableCell>
                  <TableCell>{kampus.kapasitas_total}</TableCell>
                  <TableCell>{kampus.kuota_pelajar_baru}</TableCell>
                  <TableCell>{kampus.kuota_terisi}</TableCell>
                  <TableCell>
                    <Badge variant={kampus.status_aktif ? 'outline' : 'destructive'} className={kampus.status_aktif ? 'border-green-600 text-green-600' : ''}>
                      {kampus.status_aktif ? 'Aktif' : 'Non-Aktif'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenForm(kampus)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleOpenDeleteAlert(kampus)}>
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat diurungkan. Ini akan menghapus data kampus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteAlert}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteKampus}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

