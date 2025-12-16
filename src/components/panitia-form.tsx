
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
import type { Panitia } from '@/lib/types';
import { useEffect } from 'react';

const formSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  role: z.enum(['Super Admin', 'Admin Penempatan']),
});

type PanitiaFormValues = z.infer<typeof formSchema>;

interface PanitiaFormProps {
  initialData?: Panitia | null;
  onSubmit: (values: PanitiaFormValues) => void;
  onClose: () => void;
}

export function PanitiaForm({ initialData, onSubmit, onClose }: PanitiaFormProps) {
  const form = useForm<PanitiaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          username: initialData.username,
          role: initialData.role,
        }
      : {
          username: '',
          role: 'Admin Penempatan',
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({
        username: '',
        role: 'Admin Penempatan',
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username unik" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Admin Penempatan">
                    Admin Penempatan
                  </SelectItem>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
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
