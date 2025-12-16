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
import { mockKampus } from '@/lib/mock-data';
import { MoreHorizontal, PlusCircle } from 'lucide-react';

export default function CampusPage() {
  return (
    <>
      <PageHeader
        title="Manajemen Kampus"
        description="Kelola data kampus, kapasitas, dan kuota untuk penempatan."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Kampus
        </Button>
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
              {mockKampus.map((kampus) => (
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
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
    </>
  );
}
