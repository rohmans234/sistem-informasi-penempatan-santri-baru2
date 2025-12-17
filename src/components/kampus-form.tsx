
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
import { Switch } from '@/components/ui/switch';
import type { MasterKampus } from '@/lib/types';
import { useEffect } from 'react';

const formSchema = z.object({
  nama_kampus: z.string().min(1, 'Nama kampus tidak boleh kosong'),
  jenis_kelamin: z.enum(['Laki-laki', 'Perempuan']),
  kapasitas_total: z.coerce.number().min(1, 'Kapasitas harus lebih dari 0'),
  kuota_pelajar_baru: z.coerce.number().min(1, 'Kuota harus lebih dari 0'),
  wakil_pengasuh: z.string().optional(),
  status_aktif: z.boolean(),
});

type KampusFormValues = z.infer<typeof formSchema>;

interface KampusFormProps {
  initialData?: MasterKampus | null;
  onSubmit: (values: KampusFormValues) => void;
  onClose: () => void;
}

export function KampusForm({ initialData, onSubmit, onClose }: KampusFormProps) {
  const form = useForm<KampusFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          nama_kampus: '',
          jenis_kelamin: 'Laki-laki',
          kapasitas_total: 0,
          kuota_pelajar_baru: 0,
          wakil_pengasuh: '',
          status_aktif: true,
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
        form.reset({
            nama_kampus: '',
            jenis_kelamin: 'Laki-laki',
            kapasitas_total: 0,
            kuota_pelajar_baru: 0,
            wakil_pengasuh: '',
            status_aktif: true,
        });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nama_kampus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kampus</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Gontor 1 Pusat" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
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
             <FormField
                control={form.control}
                name="wakil_pengasuh"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Wakil Pengasuh</FormLabel>
                    <FormControl>
                    <Input placeholder="Nama Wakil Pengasuh" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
           <FormField
            control={form.control}
            name="kapasitas_total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kapasitas Total</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="kuota_pelajar_baru"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kuota Baru</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="status_aktif"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <FormLabel>Status Aktif</FormLabel>
                </div>
                 <FormControl>
                    <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                </FormControl>
            </FormItem>
          )}
        />
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
