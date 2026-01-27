'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  GanttChartSquare,
  LayoutDashboard,
  Building2,
  Users,
  MapPin,
  Shield,
  LogOut,
} from 'lucide-react';
// Hapus import PlaceHolderImages karena filenya sudah dihapus

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/kampus', icon: Building2, label: 'Kampus' },
  { href: '/admin/santri', icon: Users, label: 'Calon Santri' },
  { href: '/admin/penempatan', icon: MapPin, label: 'Penempatan' },
  { href: '/admin/panitia', icon: Shield, label: 'Panitia' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <Link href="/admin" className="flex items-center gap-2 p-2">
          <GanttChartSquare className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg">SantriPlacement</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Logout"
            >
              <Link href="/">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <div className="flex items-center gap-3 mt-4 px-2">
          <Avatar className="h-9 w-9 border">
            {/* Karena PlaceHolderImages sudah dihapus, kita gunakan Fallback secara default.
              Nantinya, Anda bisa mengambil URL foto profil dari Supabase Auth atau Storage.
            */}
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              SA
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-sm truncate">Super Admin</span>
            <span className="text-[10px] text-muted-foreground truncate">
              superadmin@gontor.ac.id
            </span>
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}