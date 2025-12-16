
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CalonSantri } from '@/lib/types';
import { useEffect } from 'react';

const formSchema = z.object({
  no_pendaftaran: z.string().min(1, 'No. pendaftaran tidak boleh kosong'),
  nama_lengkap: z.string().min(1, 'Nama lengkap tidak boleh kosong'),
  jenis_kelamin: z.enum(['Laki-laki', 'Perempuan']),
  nilai_bindonesia: z.coerce.number().min(0).max(100),
  nilai_imla: z.coerce.number().min(0).max(100),
  nilai_alquran: z.coerce.number().min(0).max(100),
  nilai_berhitung: z.coerce.number().min(0).max(100),
});

type SantriFormValues = z.infer<typeof formSchema>;

interface SantriFormProps {
  initialData?: CalonSantri | null;
  onSubmit: (values: SantriFormValues) => void;
  onClose: () => void;
}

export function SantriForm({ initialData, onSubmit, onClose }: SantriFormProps) {
  const form = useForm<SantriFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          no_pendaftaran: '',
          nama_lengkap: '',
          jenis_kelamin: 'Laki-laki',
          nilai_bindonesia: 0,
          nilai_imla: 0,
          nilai_alquran: 0,
          nilai_berhitung: 0,
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
        form.reset({
            no_pendaftaran: '',
            nama_lengkap: '',
            jenis_kelamin: 'Laki-laki',
            nilai_bindonesia: 0,
            nilai_imla: 0,
            nilai_alquran: 0,
            nilai_berhitung: 0,
        });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="no_pendaftaran"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No. Pendaftaran</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: 202401001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="nama_lengkap"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Nama lengkap calon santri" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jenis_kelamin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Kelamin</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
           <FormField
            control={form.control}
            name="nilai_bindonesia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nilai B. Indonesia</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="nilai_imla"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nilai Imla</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="nilai_alquran"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nilai Al-Quran</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="nilai_berhitung"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nilai Berhitung</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </Form>
  );
}
