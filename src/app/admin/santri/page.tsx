
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
import { Input } from '@/components/ui/input';
import { MoreHorizontal, PlusCircle, Upload, Search } from 'lucide-react';
import type { CalonSantri } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { SantriForm } from '@/components/santri-form';
import { ImportSantriDialog } from '@/components/import-santri-dialog';
import { useAppContext } from '@/context/app-context';

export default function SantriPage() {
  const { santriList, addSantri, updateSantri, deleteSantri } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<CalonSantri | null>(null);
  const { toast } = useToast();

  const handleOpenForm = (santri?: CalonSantri | null) => {
    setSelectedSantri(santri || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedSantri(null);
    setIsFormOpen(false);
  };

  const handleFormSubmit = (values: Omit<CalonSantri, 'id_santri' | 'rata_rata_ujian' | 'status_penempatan'>) => {
    if (selectedSantri) {
      // Update
      updateSantri(selectedSantri.id_santri, values);
      toast({ title: 'Berhasil!', description: 'Data santri berhasil diperbarui.' });
    } else {
      // Create
      addSantri(values);
      toast({ title: 'Berhasil!', description: 'Santri baru berhasil ditambahkan.' });
    }
    handleCloseForm();
  };

  const handleDeleteSantri = (id_santri: number) => {
    deleteSantri(id_santri);
    toast({ title: "Berhasil!", description: "Data santri berhasil dihapus.", variant: "destructive" });
  };

  return (
    <>
      <PageHeader
        title="Manajemen Calon Santri"
        description="Impor, kelola, dan input nilai untuk calon santri yang lulus."
      >
        <Button variant="outline" onClick={() => setIsImportOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Import Data
        </Button>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Santri
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedSantri ? 'Edit' : 'Tambah'} Santri</DialogTitle>
            </DialogHeader>
            <SantriForm
              initialData={selectedSantri}
              onSubmit={handleFormSubmit}
              onClose={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Calon Santri</CardTitle>
          <CardDescription>
            Berikut adalah daftar calon santri yang telah lulus ujian masuk.
          </CardDescription>
          <div className="pt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari santri..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Pendaftaran</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Jenis Kelamin</TableHead>
                <TableHead>Nilai Rata-rata</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {santriList.map((santri) => (
                <TableRow key={santri.id_santri}>
                  <TableCell className="font-mono">{santri.no_pendaftaran}</TableCell>
                  <TableCell className="font-medium">{santri.nama_lengkap}</TableCell>
                  <TableCell>
                    <Badge variant={santri.jenis_kelamin === 'Laki-laki' ? 'default' : 'secondary'} className={santri.jenis_kelamin === 'Perempuan' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300' : ''}>
                      {santri.jenis_kelamin}
                    </Badge>
                  </TableCell>
                  <TableCell>{santri.rata_rata_ujian.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={santri.status_penempatan === 'Ditempatkan' ? 'outline' : 'secondary'} className={santri.status_penempatan === 'Ditempatkan' ? 'border-green-600 text-green-600' : ''}>
                      {santri.status_penempatan}
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
                        <DropdownMenuItem onClick={() => handleOpenForm(santri)}>Input/Edit Nilai</DropdownMenuItem>
                        <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteSantri(santri.id_santri)}>
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
      
      <ImportSantriDialog isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
    </>
  );
}
