
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
import { mockPanitia as initialPanitia } from '@/lib/mock-data';
import { MoreHorizontal, PlusCircle, ShieldCheck, UserCog } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import type { Panitia } from '@/lib/types';
import { PanitiaForm } from '@/components/panitia-form';

export default function PanitiaPage() {
  const [panitiaList, setPanitiaList] =
    useState<Panitia[]>(initialPanitia);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPanitia, setSelectedPanitia] = useState<Panitia | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenForm = (panitia?: Panitia | null) => {
    setSelectedPanitia(panitia || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedPanitia(null);
    setIsFormOpen(false);
  };

  const handleOpenDeleteAlert = (panitia: Panitia) => {
    setSelectedPanitia(panitia);
    setIsDeleteAlertOpen(true);
  };

  const handleCloseDeleteAlert = () => {
    setSelectedPanitia(null);
    setIsDeleteAlertOpen(false);
  };
  
  const handleResetPassword = (username: string) => {
    toast({
        title: "Fitur Dalam Pengembangan",
        description: `Fitur reset password untuk ${username} akan segera tersedia.`,
    });
  }

  const handleFormSubmit = (values: Omit<Panitia, 'id_panitia'>) => {
    if (selectedPanitia) {
      // Update
      setPanitiaList(
        panitiaList.map((p) =>
          p.id_panitia === selectedPanitia.id_panitia ? { ...p, ...values } : p
        )
      );
      toast({
        title: 'Berhasil!',
        description: 'Data panitia berhasil diperbarui.',
      });
    } else {
      // Create
      const newPanitia: Panitia = {
        id_panitia: Math.max(...panitiaList.map((p) => p.id_panitia)) + 1,
        ...values,
      };
      setPanitiaList([...panitiaList, newPanitia]);
      toast({
        title: 'Berhasil!',
        description: 'Akun panitia baru berhasil ditambahkan.',
      });
    }
    handleCloseForm();
  };

  const handleDeletePanitia = () => {
    if (!selectedPanitia) return;
    setPanitiaList(
      panitiaList.filter((p) => p.id_panitia !== selectedPanitia.id_panitia)
    );
    toast({
      title: 'Berhasil!',
      description: 'Akun panitia berhasil dihapus.',
      variant: 'destructive',
    });
    handleCloseDeleteAlert();
  };

  return (
    <>
      <PageHeader
        title="Manajemen Panitia"
        description="Kelola akun panitia dan hak akses."
      >
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Panitia
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {selectedPanitia ? 'Edit' : 'Tambah'} Panitia
              </DialogTitle>
            </DialogHeader>
            <PanitiaForm
              initialData={selectedPanitia}
              onSubmit={handleFormSubmit}
              onClose={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Akun Panitia</CardTitle>
          <CardDescription>
            Berikut adalah daftar pengguna yang memiliki akses ke sistem admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {panitiaList.map((panitia) => (
                <TableRow key={panitia.id_panitia}>
                  <TableCell className="font-medium">{panitia.username}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        panitia.role === 'Super Admin'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {panitia.role === 'Super Admin' ? (
                        <ShieldCheck className="mr-2 h-3.5 w-3.5" />
                      ) : (
                        <UserCog className="mr-2 h-3.5 w-3.5" />
                      )}
                      {panitia.role}
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
                        <DropdownMenuItem onClick={() => handleOpenForm(panitia)}>
                          Edit Hak Akses
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResetPassword(panitia.username)}>
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleOpenDeleteAlert(panitia)}
                        >
                          Hapus Akun
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
      <AlertDialog
        open={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat diurungkan. Ini akan menghapus data akun
              panitia secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteAlert}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePanitia}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
