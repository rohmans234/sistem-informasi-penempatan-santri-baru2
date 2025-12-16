
'use client';

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
import { UploadCloud, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImportSantriDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportSantriDialog({ isOpen, onClose }: ImportSantriDialogProps) {
    const { toast } = useToast();

    const handleImport = () => {
        // TODO: Implement actual file parsing and data import logic
        toast({
            title: "Fitur Dalam Pengembangan",
            description: "Fungsionalitas import data akan segera tersedia.",
        });
        onClose();
    }

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
                <Input id="csv-file" type="file" accept=".csv" />
                <Button size="icon" variant="outline" className='shrink-0'>
                    <UploadCloud className="h-4 w-4" />
                </Button>
            </div>
          </div>
           <Button variant="link" size="sm" className="p-0 h-auto">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Unduh Template CSV
            </Button>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" onClick={handleImport}>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
