
'use client';

import Link from 'next/link';
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
import {
  Building2,
  Users,
  PieChart,
  UserCheck,
  CalendarDays,
  Download,
  AlertTriangle,
  Info,
  MoreHorizontal,
  Clock,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import CampusDistributionChart from '@/components/campus-distribution-chart';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppContext } from '@/context/app-context';


const recentActivities = [
    { name: "Muhammad Fatih", status: "Diterima", campus: "Gontor 1", time: "2 min ago", avatar: "https://i.pravatar.cc/150?img=1" },
    { name: "Aisyah Putri", status: "Berkas Diverifikasi", campus: "Gontor Putri 1", time: "15 min ago", avatar: "https://i.pravatar.cc/150?img=2" },
    { name: "Abdullah Azzam", status: "Menunggu Verifikasi", campus: "Gontor 2", time: "1 hour ago", avatar: "https://i.pravatar.cc/150?img=3" },
    { name: "Fatimah Az-Zahra", status: "Berkas Tidak Lengkap", campus: "Gontor Putri 2", time: "3 hours ago", avatar: "https://i.pravatar.cc/150?img=4" },
];


export default function DashboardPage() {
  const { santriList, kampusList, placementResults } = useAppContext();

  const totalPendaftar = santriList.length;
  const totalDiterima = placementResults.length;
  
  const totalKuota = kampusList
    .filter(k => k.status_aktif)
    .reduce((acc, k) => acc + k.kuota_pelajar_baru, 0);

  const sisaKuota = totalKuota - totalDiterima;

  const kampusPenuh = kampusList.filter(k => k.status_aktif && k.kuota_terisi >= k.kuota_pelajar_baru).length;
  const totalKampus = kampusList.filter(k => k.status_aktif).length;


  return (
    <>
      <PageHeader
        title="Dashboard Utama"
        description={`Ringkasan statistik penerimaan Santri baru tahun ajaran ${new Date().getFullYear()}/${new Date().getFullYear() + 1}`}
      >
        <Button variant="outline">
          <CalendarDays className="mr-2 h-4 w-4" />
          Tahun Ajaran {`${new Date().getFullYear()}/${new Date().getFullYear() + 1}`}
        </Button>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Laporan
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/santri">
          <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calon Santri</CardTitle>
              <div className="p-2 bg-blue-100 rounded-md">
                  <Users className="h-5 w-5 text-blue-600" />
              </div>
              </CardHeader>
              <CardContent>
              <div className="text-3xl font-bold">{totalPendaftar.toLocaleString('id-ID')}</div>
              <p className="text-xs text-muted-foreground">
                  Santri yang lulus ujian masuk
              </p>
              </CardContent>
          </Card>
        </Link>
        <Link href="/admin/penempatan">
          <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Santri Ditempatkan</CardTitle>
              <div className="p-2 bg-green-100 rounded-md">
                  <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              </CardHeader>
              <CardContent>
              <div className="text-3xl font-bold">{totalDiterima.toLocaleString('id-ID')}</div>
              <p className="text-xs text-muted-foreground">
                  Santri yang sudah mendapat kampus
              </p>
              </CardContent>
          </Card>
        </Link>
        <Link href="/admin/penempatan">
          <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sisa Kuota</CardTitle>
              <div className="p-2 bg-yellow-100 rounded-md">
                  <PieChart className="h-5 w-5 text-yellow-600" />
              </div>
              </CardHeader>
              <CardContent>
              <div className="text-3xl font-bold">{sisaKuota.toLocaleString('id-ID')}</div>
              <p className="text-xs text-muted-foreground">
                  Dari total kuota {totalKuota.toLocaleString('id-ID')}
              </p>
              </CardContent>
          </Card>
        </Link>
        <Link href="/admin/kampus">
          <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kampus Penuh</CardTitle>
              <div className="p-2 bg-red-100 rounded-md">
                  <Building2 className="h-5 w-5 text-red-600" />
              </div>
              </CardHeader>
              <CardContent>
              <div className="text-3xl font-bold">{kampusPenuh} <span className="text-lg text-muted-foreground">/ {totalKampus} Kampus</span></div>
              <p className="text-xs text-muted-foreground">
                  Kampus dengan kuota terpenuhi
              </p>
              </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-5 lg:grid-cols-3 mt-6">
        <Card className="md:col-span-3 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Sebaran Santri per Kampus</CardTitle>
                <CardDescription>
                Distribusi penempatan santri yang diterima
                </CardDescription>
            </div>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                    <DropdownMenuItem>Export Data</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="pl-2">
            <CampusDistributionChart />
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Status Berkas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className='space-y-2'>
                <div className="flex justify-between items-center text-sm">
                    <span className='font-medium'>Lengkap</span>
                    <span className='text-muted-foreground'>68%</span>
                </div>
                <Progress value={68} className="h-2" />
             </div>
              <div className='space-y-2'>
                <div className="flex justify-between items-center text-sm">
                    <span className='font-medium'>Menunggu Verifikasi</span>
                    <span className='text-muted-foreground'>22%</span>
                </div>
                <Progress value={22} className="h-2" />
             </div>
              <div className='space-y-2'>
                <div className="flex justify-between items-center text-sm">
                    <span className='font-medium'>Kurang Dokumen</span>
                    <span className='text-muted-foreground'>10%</span>
                </div>
                <Progress value={10} className="h-2" />
             </div>
             <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                <Info className="h-4 w-4 !text-blue-600" />
                <AlertTitle className="text-blue-900 font-semibold">Butuh Tindakan</AlertTitle>
                <AlertDescription className="text-blue-800/90">
                    452 berkas santri memerlukan verifikasi manual dari admin.
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Aktivitas Terbaru</CardTitle>
                <Button variant="link" size="sm" asChild>
                    <Link href="#">Lihat Semua</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Santri</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Kampus Tujuan</TableHead>
                            <TableHead className="text-right">Waktu</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentActivities.map((activity, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={activity.avatar} alt={activity.name} />
                                            <AvatarFallback>{activity.name.substring(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{activity.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                     <Badge variant="outline" className={
                                        activity.status === 'Diterima' ? 'border-green-600 text-green-600' :
                                        activity.status === 'Berkas Diverifikasi' ? 'border-blue-600 text-blue-600' :
                                        activity.status === 'Menunggu Verifikasi' ? 'border-yellow-600 text-yellow-600' :
                                        'border-red-600 text-red-600'
                                     }>
                                         {activity.status}
                                     </Badge>
                                </TableCell>
                                <TableCell>{activity.campus}</TableCell>
                                <TableCell className="text-right text-muted-foreground text-xs">{activity.time}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Pemberitahuan Sistem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive" className="bg-orange-50 border-orange-200 text-orange-800">
                <AlertTriangle className="h-4 w-4 !text-orange-500" />
                <AlertTitle className="text-orange-900 font-semibold">Kuota Gontor 2 Menipis</AlertTitle>
                <AlertDescription className="text-orange-800/90">
                    Sisa kuota kurang dari 5%. Mohon periksa alokasi.
                </AlertDescription>
            </Alert>
             <Alert>
                <Clock className="h-4 w-4" />
                <AlertTitle>Penempatan Dijadwalkan</AlertTitle>
                <AlertDescription>
                    Proses penempatan otomatis berikutnya akan berjalan dalam 3 hari.
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
