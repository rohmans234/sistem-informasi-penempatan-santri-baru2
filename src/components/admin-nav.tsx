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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  GanttChartSquare,
  LayoutDashboard,
  Building2,
  Users,
  MapPin,
  Shield,
  LogOut,
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

const adminAvatar = PlaceHolderImages.find((img) => img.id === 'admin-avatar');

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
        <Link href="/admin" className="flex items-center gap-2">
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
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={{ children: 'Logout', side: 'right' }}
            >
              <Link href="/">
                <LogOut />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-10 w-10">
            {adminAvatar && (
               <Image src={adminAvatar.imageUrl} alt={adminAvatar.description} width={40} height={40} data-ai-hint={adminAvatar.imageHint}/>
            )}
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Super Admin</span>
            <span className="text-xs text-muted-foreground">
              superadmin@gontor.ac.id
            </span>
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}
