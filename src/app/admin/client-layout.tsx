'use client';

import AdminNav from '@/components/admin-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppProvider } from '@/context/app-context';

export default function AdminClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Membungkus di sini sudah benar jika root layout belum membungkusnya.
    <AppProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar>
            <SidebarHeader className="p-4 font-bold border-b">
               SantriPlacement Admin
            </SidebarHeader>
            <SidebarContent>
              <AdminNav />
            </SidebarContent>
          </Sidebar>
          
          <div className="flex-1 flex flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
              <SidebarTrigger />
              <div className="flex-1" />
              <ThemeToggle />
            </header>
            
            <main className="flex-1">
              <SidebarInset className="p-4 md:p-6 lg:p-8">
                {children}
              </SidebarInset>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AppProvider>
  );
}