'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { UploadCloud, FileSpreadsheet, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import Papa from 'papaparse';
import Link from 'next/link';

interface ImportSantriDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Callback untuk refresh data di halaman utama
}

export function ImportSantriDialog({ isOpen, onClose, onSuccess }: ImportSantriDialogProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "File tidak ditemukan",
        description: "Silakan pilih file CSV terlebih dahulu.",
      });
      return;
    }

    setIsUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          // Validasi & Mapping data dari CSV ke kolom database
          const formattedData = results.data.map((row: any) => {
            const bindo = parseFloat(row.nilai_bindonesia) || 0;
            const imla = parseFloat(row.nilai_imla) || 0;
            const alquran = parseFloat(row.nilai_alquran) || 0;
            const hitung = parseFloat(row.nilai_berhitung) || 0;

            return {
              no_pendaftaran: row.no_pendaftaran,
              nama_lengkap: row.nama_lengkap,
              jenis_kelamin: row.jenis_kelamin, // Pastikan isinya 'Laki-laki' atau 'Perempuan'
              nilai_bindonesia: bindo,
              nilai_imla: imla,
              nilai_alquran: alquran,
              nilai_berhitung: hitung,
              rata_rata_ujian: (bindo + imla + alquran + hitung) / 4,
              status_penempatan: 'Belum Ditempatkan'
            };
          });

          const { error } = await supabase
            .from('calon_santri')
            .insert(formattedData);

          if (error) throw error;

          toast({
            title: "Berhasil",
            description: `${formattedData.length} data santri berhasil diimpor.`,
          });

          if (onSuccess) onSuccess();
          onClose();
          setFile(null);
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Gagal Import",
            description: error.message || "Pastikan format kolom CSV sudah benar.",
          });
        } finally {
          setIsUploading(false);
        }
      },
      error: (error) => {
        setIsUploading(false);
        toast({
          variant: "destructive",
          title: "Gagal Membaca File",
          description: error.message,
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Data Santri</DialogTitle>
          <DialogDescription>
            Unggah file CSV untuk mengimpor data calon santri secara massal.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="csv-file">File CSV</Label>
            <div className="flex items-center space-x-2">
              <Input 
                id="csv-file" 
                type="file" 
                accept=".csv" 
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <Button size="icon" variant="outline" className='shrink-0' disabled={!file || isUploading}>
                <UploadCloud className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button variant="link" size="sm" className="p-0 h-auto" asChild>
            <Link href="/template-santri.csv" download>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Unduh Template CSV
            </Link>
          </Button>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
            Batal
          </Button>
          <Button onClick={handleImport} disabled={!file || isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengimport...
              </>
            ) : (
              'Import'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}