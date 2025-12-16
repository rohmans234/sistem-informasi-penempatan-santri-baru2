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
import { mockPenempatan } from '@/lib/mock-data';
import { PlayCircle, Info, Send, MoreHorizontal, FilePenLine } from 'lucide-react';

export default function PlacementPage() {
  const isPublished = false;

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
              <Button className="w-full" size="lg">
                <PlayCircle className="mr-2 h-5 w-5" />
                Jalankan Penempatan Otomatis
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
                <Button variant="outline" className="w-full">
                  <FilePenLine className="mr-2 h-4 w-4" />
                  Lengkapi Data Wali
                </Button>
                 <Button className="w-full" variant={isPublished ? "secondary" : "default"} disabled={isPublished}>
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
                  {mockPenempatan.map((result) => (
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
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Pindahkan Kampus</DropdownMenuItem>
                            <DropdownMenuItem>Edit Wakil Pengasuh</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
