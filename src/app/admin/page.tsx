import {
  Card,
  CardContent,
  CardDescription,
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
import { Badge } from '@/components/ui/badge';
import { Building2, Users, PieChart, CheckCheck } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import CampusDistributionChart from '@/components/campus-distribution-chart';
import { mockKampus, mockSantri } from '@/lib/mock-data';

const totalSantri = mockSantri.length;
const totalKampus = mockKampus.length;
const santriDitempatkan = mockSantri.filter(s => s.status_penempatan === 'Ditempatkan').length;
const kuotaTersedia = mockKampus.reduce((acc, k) => acc + k.kuota_pelajar_baru, 0) - santriDitempatkan;


const recentActivities = [
    { action: "Import Data Santri", user: "admin_penempatan_1", time: "5 menit lalu", status: "Success" },
    { action: "Update Kuota Kampus", user: "superadmin", time: "1 jam lalu", status: "Success" },
    { action: "Jalankan Penempatan", user: "admin_penempatan_1", time: "3 jam lalu", status: "Completed" },
    { action: "Tambah Kampus Baru", user: "superadmin", time: "1 hari lalu", status: "Success" },
    { action: "Publish Hasil", user: "superadmin", time: "2 hari lalu", status: "Published" },
];


export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Selamat datang di Sistem Informasi Penempatan Santri Baru."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calon Santri</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSantri}</div>
            <p className="text-xs text-muted-foreground">Total pendaftar yang lulus ujian</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kampus Aktif</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKampus.filter(k => k.status_aktif).length}</div>
            <p className="text-xs text-muted-foreground">Dari {totalKampus} total kampus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Santri Ditempatkan</CardTitle>
            <CheckCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{santriDitempatkan}</div>
            <p className="text-xs text-muted-foreground">Dari {totalSantri} total santri</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sisa Kuota</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kuotaTersedia}</div>
            <p className="text-xs text-muted-foreground">Total kuota tersedia di semua kampus</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Distribusi Santri per Kampus</CardTitle>
            <CardDescription>
              Visualisasi jumlah santri yang telah ditempatkan di setiap kampus.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <CampusDistributionChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>
              Log aktivitas yang dilakukan oleh panitia.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Aksi</TableHead>
                        <TableHead>Pengguna</TableHead>
                        <TableHead className="text-right">Waktu</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentActivities.map((activity, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{activity.action}</TableCell>
                            <TableCell>{activity.user}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{activity.time}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
