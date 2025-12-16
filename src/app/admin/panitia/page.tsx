import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
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
import { mockPanitia } from '@/lib/mock-data';
import { MoreHorizontal, PlusCircle, ShieldCheck, UserCog } from 'lucide-react';

export default function PanitiaPage() {
  return (
    <>
      <PageHeader
        title="Manajemen Panitia"
        description="Kelola akun panitia dan hak akses."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Panitia
        </Button>
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
              {mockPanitia.map((panitia) => (
                <TableRow key={panitia.id_panitia}>
                  <TableCell className="font-medium">{panitia.username}</TableCell>
                  <TableCell>
                    <Badge variant={panitia.role === 'Super Admin' ? 'destructive' : 'secondary'}>
                      {panitia.role === 'Super Admin' ? 
                        <ShieldCheck className="mr-2 h-3.5 w-3.5" /> : 
                        <UserCog className="mr-2 h-3.5 w-3.5" />
                      }
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
                        <DropdownMenuItem>Edit Hak Akses</DropdownMenuItem>
                        <DropdownMenuItem>Reset Password</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
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
    </>
  );
}
