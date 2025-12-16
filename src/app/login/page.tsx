'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GanttChartSquare } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just navigate to the admin dashboard.
    // Real authentication logic will be added later.
    router.push('/admin');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
       <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm bg-card">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center justify-center gap-2">
            <GanttChartSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">SantriPlacement</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <Card className="mx-auto max-w-sm w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Login Panitia</CardTitle>
            <CardDescription>
              Masukkan username dan password Anda untuk masuk ke dashboard admin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="superadmin"
                  required
                  defaultValue="superadmin"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required defaultValue="password" />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-card">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Pondok Modern Darussalam Gontor. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
